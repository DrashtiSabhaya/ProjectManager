import React, { useState, useEffect, useCallback } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    ActivityIndicator,
    FlatList,
    Keyboard,
    Pressable
} from 'react-native';
import {
    Button,
    Text,
    Title,
    FAB,
    Portal,
    Modal,
    TextInput,
    Snackbar,
    Menu,
    Divider,
    Searchbar
} from 'react-native-paper';
import { AnimatedTabBarView } from "@gorhom/animated-tabbar";

import ProgressCircle from 'react-native-progress-circle'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from '../../constants/Color';
import ProjectCard from '../../components/ProjectCard';
import ActionCard from '../../components/ActionCard';
import { useSelector, useDispatch } from 'react-redux';
import * as projectActions from '../../store/actions/project';
import moment from 'moment';


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


const Dashboard = ({ route, navigation }) => {

    const [visible, setVisible] = useState(false);
    const [index, setIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    const [addModal, setaddVisible] = useState(false);
    const [name, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [successMsg, setSuccessMsg] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchBox, setSearchBox] = useState(false);
    const [filterData, setFilterData] = useState([]);

    const projects = useSelector(state => state.projects.availableProjects);
    const onGoing = useSelector(state => state.projects.onGoing);
    const completed = useSelector(state => state.projects.completed);
    const user = useSelector(state => state.auth.name);

    const onGoingPer = Math.round((onGoing * 100) / (onGoing + completed))
    const completedPer = Math.round((completed * 100) / (onGoing + completed))


    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Pressable onPress={() => setVisible(!visible)}>
                    <Icon name={'sort-variant'} size={25} color={'#fff'} style={{ marginLeft: 18 }} />
                </Pressable>
            ),
            headerRight: () => (
                <View style={{ flexDirection: 'row' }}>
                    <Pressable onPress={() => setSearchBox(!searchBox)}>
                        <Icon name={'magnify'} size={25} color={'#fff'} style={{ marginRight: 18 }} />
                    </Pressable>
                    <Icon name={'bell'} size={25} color={'#fff'} style={{ marginRight: 18 }} />
                </View>
            )
        });
    }, []);


    const dispatch = useDispatch();

    const loadProjects = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            await dispatch(projectActions.fetchProjects());
        } catch (err) {
            setError(err.message);
        }
        setIsRefreshing(false);
    }, [dispatch, setIsLoading, setError]);

    useEffect(() => {
        setIsLoading(true);
        loadProjects().then(() => {
            setIsLoading(false);
        });
    }, []);

    // useEffect(() => {
    //     const willFocusSub = navigation.addListener(
    //         'focus',
    //         loadProjects
    //     );
    //     return willFocusSub;
    // }, [loadProjects]);

    const addProjectHandler = async () => {
        setError(null);
        if (!name) {
            alert('Please Enter Project Name');
            return;
        }
        if (!description) {
            alert('Please Enter Project Description');
            return;
        }
        setIsLoading(true);
        try {
            await dispatch(
                projectActions.createProject(
                    name,
                    description,
                )
            );
            setIsLoading(false);
            setaddVisible(!addModal);
            setProjectName('');
            setDescription('');
            setSuccessMsg(!successMsg);
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };


    if (error) {
        console.log(error)
        return (
            <View style={styles.container}>
                <Text>An error occurred!</Text>
                <Button onPress={loadProjects}
                    mode='contained' icon={'refresh'}
                    loading={isLoading} >
                    Try again</Button>
            </View>
        );
    }


    const onChangeSearch = query => {
        setSearchQuery(query);
        let filteredData = projects.filter((item) => {
            return item.name.includes(searchQuery);
        });
        setFilterData(filteredData)
    }


    const renderProjectItem = (itemData) => {
        if (index == 0 || itemData.item.status + 1 == index) {
            return (
                <ProjectCard
                    percent={itemData.item.progress}
                    title={itemData.item.name}
                    date={itemData.item.created_at}
                    owner={itemData.item.created_by}
                    onSelect={() => {
                        navigation.navigate('ProjectDetail', {
                            projectData: itemData.item
                        });
                    }}
                />
            );
        }
    };

    return (
        <View style={styles.container}>
            {searchBox ? (<Searchbar
                placeholder="Search Project"
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
                        let filteredData = projects.filter((item) => item.created_by == user)
                        setFilterData(filteredData)
                        setVisible(!visible)
                    }} title="My Projects" />
                    <Divider />
                    <Menu.Item onPress={() => {
                        let filteredData = projects.sort((a, b) => {
                            const aDate = new Date(a.created_at)
                            const bDate = new Date(b.created_at)
                            return bDate - aDate
                        })
                        setFilterData(filteredData)
                        setVisible(!visible)
                    }} title="Newest First" />
                    <Divider />
                    <Menu.Item onPress={() => {
                        let filteredData = projects.sort((a, b) => {
                            const aDate = new Date(a.created_at)
                            const bDate = new Date(b.created_at)
                            return aDate - bDate
                        })
                        setFilterData(filteredData)
                        setVisible(!visible)
                    }} title="Oldest First" />
                    <Divider />
                    <Menu.Item onPress={() => {
                        let filteredData = projects.sort((a, b) => {
                            const aDays = moment(a.end_date).diff(moment(new Date()), 'days')
                            const bDays = moment(b.end_date).diff(moment(new Date()), 'days')
                            return aDays - bDays
                        })
                        setFilterData(filteredData)
                        setVisible(!visible)
                    }} title="Days Left" />
                    <Divider />
                    <Menu.Item onPress={() => {
                        setFilterData(projects.sort((a, b) => b.progress - a.progress))
                        setVisible(!visible)
                    }} title="Progress Order" />
                </Menu>
            </View>

            <ActionCard style={styles.cardContainer}>
                <ProgressCircle
                    percent={onGoingPer ? onGoingPer : 0}
                    radius={75}
                    borderWidth={10}
                    color={Color.primary}
                    shadowColor="#f3f2fa"
                    bgColor="#fff">
                    <ProgressCircle
                        percent={completedPer ? completedPer : 0}
                        radius={55}
                        borderWidth={10}
                        color={Color.accent}
                        shadowColor="#f3f2fa"
                        bgColor="#fff">
                        <Text>Total</Text>
                        <Title>{onGoing + completed}</Title>
                    </ProgressCircle>
                </ProgressCircle>
                <View>
                    <View style={styles.statValues}>
                        <Icon name={'square'} size={20} color={Color.primary} />
                        <Text>{isNaN(onGoingPer) ? 0 : onGoingPer}% On Going </Text>
                    </View>
                    <View style={styles.statValues}>
                        <Icon name={'square'} size={20} color={Color.accent} />
                        <Text >{isNaN(completedPer) ? 0 : completedPer}% Completed </Text>
                    </View>
                </View>
            </ActionCard>
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
                    onRefresh={loadProjects}
                    refreshing={isRefreshing}
                    data={filterData && filterData.length > 0 ? filterData : projects}
                    renderItem={renderProjectItem}
                    contentContainerStyle={{
                        flexGrow: 1,
                    }}
                />
            </SafeAreaView>
            <FAB
                style={styles.fab}
                icon="folder-plus"
                onPress={() => setaddVisible(!addModal)}
            />
            <Portal>
                <Modal
                    visible={addModal}
                    onDismiss={() => setaddVisible(!addModal)}
                    contentContainerStyle={styles.containerStyle}>
                    <Title>New Project</Title>
                    <TextInput
                        label="Project Name"
                        value={name}
                        mode="outlined"
                        onChangeText={text => setProjectName(text)}
                        style={styles.input}
                        autoCapitalize="words"
                        keyboardType='default'
                        dense={true}
                    />
                    <TextInput
                        label="Description"
                        value={description}
                        mode="outlined"
                        onChangeText={text => setDescription(text)}
                        style={styles.input}
                        keyboardType='default'
                        multiline={true}
                        numberOfLines={5}
                        onSubmitEditing={Keyboard.dismiss}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 10 }}>
                        <Button mode='outlined' icon={'close-circle-outline'} onPress={() => setaddVisible(!addModal)}>Cancel</Button>
                        <Button mode='contained' icon={'check-circle-outline'} loading={isLoading} onPress={addProjectHandler}>Save</Button>
                    </View>
                </Modal>
            </Portal>
            <Snackbar
                visible={successMsg}
                duration={2000}
                onDismiss={() => setSuccessMsg(!successMsg)}>
                Your Project is Saved!.
            </Snackbar>
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
        marginVertical: 5
    },
    fab: {
        position: 'absolute',
        margin: 15,
        right: 0,
        bottom: 0,
        backgroundColor: Color.primary
    },
    containerStyle: {
        backgroundColor: 'white',
        padding: 20,
        margin: 25,
        borderRadius: 10
    },
    input: {
        fontSize: 14,
        marginVertical: 5
    }
});

export default Dashboard;
