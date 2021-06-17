import React, { useState, useEffect, useCallback } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    FlatList,
    Pressable
} from 'react-native';
import {
    Button,
    Text,
    Menu,
    Divider,
    Searchbar
} from 'react-native-paper';
import { AnimatedTabBarView } from "@gorhom/animated-tabbar";
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TaskCard from '../../components/TaskCard';

import { useSelector, useDispatch } from 'react-redux';
import * as projectTaskActions from '../../store/actions/task';


const tabs = {
    "All Projects": {
        labelStyle: {
            color: "#5B37B7",
            fontFamily: 'poppins-medium',
        },
        icon: {
            component: () => <Icon name={'format-list-bulleted'} size={22} color={"rgba(91,55,183,1)"} />,
        },
        background: {
            activeColor: "rgba(223,215,243,1)",
            inactiveColor: "rgba(223,215,243,0)",
        },
    },
    "On Going": {
        labelStyle: {
            color: "#5B37B7",
            fontFamily: 'poppins-medium'
        },
        icon: {
            component: () => <Icon name={'clock-outline'} size={22} color={"rgba(91,55,183,1)"} />,
        },
        background: {
            activeColor: "rgba(244,225,218,1)",
            inactiveColor: "rgba(207,235,239,0)",
        },
    },
    Completed: {
        labelStyle: {
            color: "#5B37B7",
            fontFamily: 'poppins-medium'
        },
        icon: {
            component: () => <Icon name={'check-circle-outline'} size={22} color={"rgba(91,55,183,1)"} />,
        },
        background: {
            activeColor: "rgba(207,235,239,1)",
            inactiveColor: "rgba(207,235,239,0)",
        },
    },
};


const UserTaskScreen = ({ route, navigation }) => {

    const [index, setIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    const [isEnabled, setIsEnabled] = useState([]);
    const [filterData, setFilterData] = useState([]);
    const [visible, setVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchBox, setSearchBox] = useState(false);

    const tasks = useSelector(state => state.tasks.projectsTasks);

    const dispatch = useDispatch();

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Pressable onPress={() => setVisible(!visible)}>
                    <Icon name={'sort-variant'} size={25} color={'#fff'} style={{ marginLeft: 18 }} />
                </Pressable>
            ),
            headerRight: () => (
                <Pressable onPress={() => setSearchBox(!searchBox)}>
                    <Icon name={'magnify'} size={25} color={'#fff'} style={{ marginRight: 18 }} />
                </Pressable>
            )
        });
        clearTasks()
    }, []);

    const loadProjectTasks = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            await dispatch(projectTaskActions.userTask());
        } catch (err) {
            setError(err.message);
        }
        setIsRefreshing(false);
    }, [dispatch, setIsLoading, setError]);

    const clearTasks = async () => {
        try {
            await dispatch(projectTaskActions.clearData());
        } catch (err) {
            console.log(err.message);
        }
    }

    useEffect(() => {
        const willFocusSub = navigation.addListener(
            'focus',
            loadProjectTasks
        );

        return () => {
            willFocusSub;
        };
    }, [dispatch, loadProjectTasks]);


    if (error) {
        console.log(error)
        return (
            <View style={styles.container}>
                <Text>An error occurred!</Text>
                <Button onPress={loadProjectTasks}
                    mode='contained' icon={'refresh'}
                    loading={isLoading} >
                    Try again</Button>
            </View>
        );
    }

    const editTaskHandler = async (item) => {
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(
                projectTaskActions.editProjectTask(
                    item.id,
                    item.task_name,
                    (item.status == 0 ? 1 : 0)
                )
            )
            loadProjectTasks()
            setIsLoading(false);
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };


    const toggleState = (item) => {
        let newState = [...isEnabled];
        newState = newState.filter(data => item.id != data.item)
        let setState = item.status == 1 ? false : true
        newState.push({ state: setState, item: item.id })
        setIsEnabled(newState)
        editTaskHandler(item)
    };

    const renderProjectTask = (itemData) => {
        isEnabled.push({ state: itemData.item.status == 0 ? false : true, item: itemData.item.id })

        if (index == 0 || itemData.item.status + 1 == index) {
            return (
                <TaskCard
                    percent={itemData.item.progress}
                    title={itemData.item.task_name}
                    date={itemData.item.created_at}
                    owner={itemData.item.assigned_to}
                    toggleSwitch={() => toggleState(itemData.item)}
                    isEnabled={(isEnabled.filter(item => itemData.item.id == item.item))[0].state}
                    onSelect={() => {
                        navigation.navigate('TaskDetail', {
                            taskData: itemData.item
                        });
                    }}
                />
            );
        }
    };

    const onChangeSearch = query => {
        setSearchQuery(query);
        let filteredData = tasks.filter(function (item) {
            return item.task_name.includes(searchQuery);
        });
        setFilterData(filteredData)
    }

    return (
        <View style={styles.container}>
            {searchBox ? (<Searchbar
                placeholder="Search Task"
                onChangeText={onChangeSearch}
                value={searchQuery}
                onIconPress={() => {
                    setSearchBox(!searchBox)
                    setFilterData([])
                }}
                clearAccessibilityLabel="clear"
            />) : null}
            <View
                style={{
                    marginTop: -15,
                    position: 'absolute',
                    left: 0,
                    top: 0
                }}>
                <Menu
                    visible={visible}
                    onDismiss={() => setVisible(!visible)}
                    anchor={<Button onPress={() => setVisible(!visible)}></Button>}>
                    <Menu.Item onPress={() => {
                        let filteredData = tasks.sort((a, b) => {
                            const aDate = new Date(a.created_at)
                            const bDate = new Date(b.created_at)
                            return bDate - aDate
                        })
                        setFilterData(filteredData)
                        setVisible(!visible)
                    }} title="Newest First" />
                    <Divider />
                    <Menu.Item onPress={() => {
                        let filteredData = tasks.sort((a, b) => {
                            const aDate = new Date(a.created_at)
                            const bDate = new Date(b.created_at)
                            return aDate - bDate
                        })
                        setFilterData(filteredData)
                        setVisible(!visible)
                    }} title="Oldest First" />
                    <Divider />
                    <Menu.Item onPress={() => {
                        let filteredData = tasks.sort((a, b) => {
                            const aDays = moment(a.endDate).diff(moment(new Date()), 'days')
                            const bDays = moment(b.endDate).diff(moment(new Date()), 'days')
                            return aDays - bDays
                        })
                        setFilterData(filteredData)
                        setVisible(!visible)
                    }} title="Days Left" />
                    <Divider />
                    <Menu.Item onPress={() => {
                        setFilterData(tasks.sort((a, b) => b.progress - a.progress))
                        setVisible(!visible)
                    }} title="Progress Order" />
                </Menu>
            </View>
            <AnimatedTabBarView
                tabs={tabs}
                itemOuterSpace={{
                    horizontal: 6,
                    vertical: 12,
                }}
                itemInnerSpace={12}
                iconSize={20}
                style={styles.tabBarContainer}
                index={index}
                onIndexChange={setIndex}
            />
            <SafeAreaView style={{ flex: 1 }}>
                <FlatList
                    onRefresh={loadProjectTasks}
                    refreshing={isRefreshing}
                    data={filterData && filterData.length > 0 ? filterData : tasks}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderProjectTask}
                    contentContainerStyle={{
                        flexGrow: 1,
                    }}
                />
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    cardContainer: {
        width: '95%',
        margin: 10,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    statValues: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    tabBarContainer: {
        borderRadius: 10,
        backgroundColor: '#f3f2fa',
        marginVertical: 5,
        marginTop: 15
    },
});

export default UserTaskScreen;
