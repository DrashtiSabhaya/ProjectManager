import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    StyleSheet,
    TextInput as TextIn,
    Pressable,
    FlatList,
    Button as NativeButton,
    SafeAreaView,
    Keyboard,
    Alert
} from 'react-native';
import {
    Text,
    Title,
    TextInput,
    FAB,
    Portal,
    Modal,
    Snackbar,
    Button,
    Chip,
    Menu,
    Divider,
    Provider,
    Dialog
} from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';
import { AnimatedTabBarView } from "@gorhom/animated-tabbar";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ActionCard from '../../components/ActionCard';
import Color from '../../constants/Color';
import * as Progress from 'react-native-progress';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import * as projectTaskActions from '../../store/actions/task';
import * as userActions from '../../store/actions/user';
import * as shareProjectActions from '../../store/actions/shareProject';
import * as projectActions from '../../store/actions/project';
import TaskCard from '../../components/TaskCard';
import DropDownPicker from 'react-native-dropdown-picker';


const tabs = {
    "All Tasks": {
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


const ProjectDetailScreen = ({ route, navigation }) => {
    const { projectData } = route.params;

    const tasks = useSelector(state => state.tasks.projectsTasks);
    const projectUsers = useSelector(state => state.tasks.projectUsers);
    const usersData = useSelector(state => state.user.usersData);
    const progress = useSelector(state => state.tasks.projectProgress);

    const [visible, setVisible] = useState(false);
    const [isDisplay, setDisplay] = useState(true)
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [projectDate, setDate] = useState(moment(projectData.created_at).format('YYYY-MM-DD'));
    const [index, setIndex] = useState(0);
    const [endDatePickerVisible, setEndDatePickerVisibile] = useState(false);
    const [endDate, setEndDate] = useState(projectData.end_date);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    const [isEnabled, setIsEnabled] = useState([]);
    const [addModal, setaddVisible] = useState(false);
    const [name, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [successMsg, setSuccessMsg] = useState(false);
    const [user, setUser] = useState([]);
    const [permission, setPermission] = useState([]);
    const [assignUser, setAssignUser] = useState();
    const [shareModal, setShareModal] = useState(false);
    const [taskEndDate, setTaskEndDate] = useState(new Date());
    const [taskDateModal, setTaskDateModal] = useState(false)
    const [projectName, setProjectName] = useState(projectData.name);
    const [projectDescription, setProjectDescription] = useState(projectData.description);
    const [renameModal, setRenameModal] = useState(false)
    const [descModal, setDescModal] = useState(false);
    const [deletConfirm, setDeletConfirm] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable onPress={() => setVisible(!visible)}>
                    <Icon name={'dots-vertical'} size={25} color={'#fff'} style={{ marginRight: 18 }} />
                </Pressable>
            ),
        },
            clearTasks());
    }, []);


    const loadProjectTasks = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            await dispatch(projectTaskActions.fetchProjectTask(projectData.id));
            if (usersData.length == 0)
                await dispatch(userActions.fetchUsers());
        } catch (err) {
            setError(err.message);
        }
        setIsRefreshing(false);
    }, [dispatch, setIsLoading, setError]);

    useEffect(() => {
        const willFocusSub = navigation.addListener(
            'focus',
            loadProjectTasks
        );

        return () => {
            willFocusSub;
        };
    }, [dispatch, loadProjectTasks]);

    const clearTasks = async () => {
        try {
            await dispatch(projectTaskActions.clearData());
        } catch (err) {
            console.log(err.message);
        }
    }

    if (error) {
        alert(error)
        return (
            <View style={styles.container}>
                <Text>An error occurred!</Text>
                <NativeButton
                    title="Try again"
                    onPress={loadProjectTasks}
                    color={Color.accent} />
            </View>
        );
    }

    const users = []
    for (const user in usersData) {
        if (usersData[user].active_status) {
            users.push({
                label: usersData[user].name + " : " + usersData[user].username,
                value: usersData[user].id,
                icon: () => <Icon name="account" size={18} color={Color.primary} />
            })
        }
    }

    const projectUser = []
    for (const user in projectUsers) {
        projectUser.push({
            label: projectUsers[user].shared_with + " : " + projectUsers[user].shared_with_username,
            value: projectUsers[user].shared_userid,
            icon: () => <Icon name="account" size={18} color={Color.primary} />
        })
    }

    const permissions = [
        { label: 'View', value: 'View', icon: () => <Icon name="eye-check-outline" size={18} color={Color.primary} /> },
        { label: 'Update', value: 'Update', icon: () => <Icon name="circle-edit-outline" size={18} color={Color.primary} /> },
        { label: 'Delete', value: 'Delete', icon: () => <Icon name="trash-can-outline" size={18} color={Color.primary} /> }
    ]

    const shareProjectHandler = async () => {
        setError(null);
        if (user.length == 0) {
            alert('Please Select a User');
            return;
        }
        if (permission.length == 0) {
            alert('Please Select Project Permission');
            return;
        }
        setIsLoading(true);
        var userIds = "";
        for (var i = 0, len = user.length; i < len; i++) {
            userIds += user[i] + ",";
        }
        var perms = "";
        for (var i = 0, len = permission.length; i < len; i++) {
            perms += permission[i] + ",";
        }
        try {
            await dispatch(
                shareProjectActions.shareProject(
                    projectData.id,
                    userIds,
                    perms
                )
            );
            setShareModal(!shareModal);
            setUser([]);
            setPermission([]);
            setSuccessMsg(true);
            setIsLoading(false);
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    const renameProject = async () => {
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(
                projectActions.renameProject(
                    projectName,
                    projectData.id
                )
            );
            setIsLoading(false);
            setRenameModal(false);
            setSuccessMsg(!successMsg);
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    const changeStartDate = async (date) => {
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(
                projectActions.changeStartDate(
                    projectName,
                    projectData.id,
                    moment(date).format('YYYY-MM-DD')
                )
            );
            setIsLoading(false);
            setSuccessMsg(!successMsg);
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    const changeEndDate = async (date) => {
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(
                projectActions.changeEndDate(
                    projectName,
                    projectData.id,
                    moment(date).format('YYYY-MM-DD')
                )
            );
            setIsLoading(false);
            setSuccessMsg(!successMsg);
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    const updateProjectData = async () => {
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(
                projectActions.editProject(
                    projectName,
                    projectDescription,
                    projectData.id,
                )
            );
            setIsLoading(false);
            setDescModal(false);
            setSuccessMsg(!successMsg);
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    const deleteProjectData = async () => {
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(
                projectActions.deleteProject(
                    projectData.id,
                )
            );
            alert("Project Data is Deleted!");
            navigation.navigate("Dashboard");
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    const addProjectTaskHandler = async () => {
        setError(null);
        if (!name) {
            alert('Please Enter Task Name');
            return;
        }
        if (!description) {
            alert('Please Enter Task Description');
            return;
        }
        if (!assignUser) {
            alert('Please Assign User to Task');
            return;
        }
        setIsLoading(true);
        try {
            await dispatch(
                projectTaskActions.createProjectTask(
                    name,
                    description,
                    projectData.id,
                    assignUser,
                    moment(taskEndDate).format('YYYY-MM-DD')
                )
            );
            setSuccessMsg(true);
            // loadProjectTasks()
            setIsLoading(false);
            setaddVisible(!addModal);
            setTaskName('')
            setDescription('')
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

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


    return (
        <View style={styles.container}>
            <View
                style={{
                    marginTop: -15,
                    position: 'absolute',
                    right: 0,
                    top: 0
                }}>
                <Menu
                    visible={visible}
                    onDismiss={() => setVisible(!visible)}
                    anchor={<Button onPress={() => setVisible(!visible)}></Button>}>
                    <Menu.Item icon="share-variant" onPress={() => {
                        setShareModal(!shareModal)
                        setVisible(!visible)
                    }} title="Share" />
                    <Divider />
                    <Menu.Item icon="rename-box" onPress={() => setRenameModal(!renameModal)} title="Rename" />
                    <Divider />
                    <Menu.Item icon="trash-can-outline" onPress={() => setDeletConfirm(!deletConfirm)} title="Delete" />
                    <Divider />
                    <Menu.Item icon="refresh" onPress={loadProjectTasks} title="Refresh" />
                </Menu>
            </View>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                date={new Date(projectDate)}
                mode="date"
                onConfirm={(date) => {
                    setDatePickerVisibility(!isDatePickerVisible)
                    setDate(date)
                    changeStartDate(date)
                }}
                onCancel={() => setDatePickerVisibility(!isDatePickerVisible)}
            />
            <DateTimePickerModal
                isVisible={endDatePickerVisible}
                mode="date"
                date={new Date(endDate)}
                minimumDate={new Date(projectDate)}
                onConfirm={(date) => {
                    setEndDatePickerVisibile(!endDatePickerVisible)
                    setEndDate(date)
                    changeEndDate(date)
                }}
                onCancel={() => setEndDatePickerVisibile(!endDatePickerVisible)}
            />
            <DateTimePickerModal
                isVisible={taskDateModal}
                mode="date"
                onConfirm={(date) => {
                    setTaskEndDate(date)
                    setTaskDateModal(!taskDateModal)
                }}
                onCancel={() => setTaskDateModal(!taskDateModal)}
            />
            <Portal>
                <Dialog visible={deletConfirm} onDismiss={() => setDeletConfirm(!deletConfirm)}>
                    <Dialog.Title>Delete Project</Dialog.Title>
                    <Dialog.Content>
                        <Text>Are you sure, Do you want to Delete this Project?</Text>
                    </Dialog.Content>
                    <Dialog.Actions >
                        <Button onPress={() => setDeletConfirm(!deletConfirm)}>Cancel</Button>
                        <Button onPress={deleteProjectData} style={{ marginRight: 10 }}>Yes</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            <ActionCard style={styles.cardContainer}>
                <Collapse isExpanded={isDisplay} onToggle={() => setDisplay(!isDisplay)} >
                    <CollapseHeader>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Icon name={isDisplay ? 'chevron-up' : 'chevron-down'} size={25} color={Color.primary} />
                        </View>
                        <View style={{ flexDirection: 'row', marginVertical: 5, alignItems: 'flex-end' }}>
                            <Title style={{ fontSize: 27 }}>{progress}% </Title>
                            <Text style={{ fontSize: 16 }}> completed</Text>
                        </View>
                        <Progress.Bar progress={progress / 100} borderRadius={3} color={Color.primary} height={8} width={330} />
                    </CollapseHeader>
                    <CollapseBody>
                        <View style={styles.detailContainer}>
                            <View style={{ ...styles.details, ...{ alignItems: 'center' } }}>
                                <Icon name={'label-variant'} size={26} color={Color.primary} />
                                <Title> {projectName}</Title>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={styles.details}>
                                    <Icon name={'account-outline'} size={26} color={Color.primary} />
                                    <Text>Owner: {projectData.created_by}</Text>
                                </View>
                                <View style={{ ...styles.details, ...{ marginLeft: 25 } }}>
                                    <Icon name={'account-multiple-outline'} size={26} color={Color.primary} />
                                    <Text> Project Users: {projectUsers.length}</Text>
                                </View>
                            </View>
                            <View style={styles.details}>
                                <Icon name={'calendar-month'} size={26} color={Color.primary} />
                                <Pressable onPress={() => setDatePickerVisibility(!isDatePickerVisible)}>
                                    <TextIn style={styles.calInput} value={moment(projectDate).format('YYYY-MM-DD')} editable={false} />
                                </Pressable>
                                <Icon name={'chevron-double-right'} style={{ fontWeight: '900' }} size={26} color={Color.primary} />
                                <Pressable onPress={() => setEndDatePickerVisibile(!endDatePickerVisible)}>
                                    <TextIn style={styles.calInput} value={moment(endDate).format('YYYY-MM-DD')} editable={false} />
                                </Pressable>
                            </View>
                            <View style={styles.details}>
                                <Icon name={'timer-outline'} size={26} color={Color.primary} />
                                <Text> Days Left: {moment(endDate).diff(moment(new Date()), 'days') > 0 ? moment(endDate).diff(moment(new Date()), 'days') : 0} </Text>
                            </View>
                            <View style={{ ...styles.details, alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                                <Icon name={'text-box-outline'} size={26} color={Color.primary} />
                                <Pressable onPress={() => setDescModal(!descModal)} style={{ flex: 1 }} >
                                    <TextIn
                                        style={{ ...styles.calInput, ...{ width: '97%', textAlignVertical: 'top' } }}
                                        editable={false}
                                        multiline={true}
                                        numberOfLines={4}
                                        value={projectDescription}
                                    />
                                </Pressable>
                            </View>
                        </View>
                    </CollapseBody>
                </Collapse>
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
                    onRefresh={loadProjectTasks}
                    refreshing={isRefreshing}
                    data={tasks}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderProjectTask}
                    contentContainerStyle={{
                        flexGrow: 1,
                    }}
                />
            </SafeAreaView>
            <FAB
                style={styles.fab}
                icon="text-box-plus"
                onPress={() => setaddVisible(!addModal)}
            />

            <Portal>
                <Modal
                    visible={addModal}
                    onDismiss={() => setaddVisible(!addModal)}
                    contentContainerStyle={styles.containerStyle}>
                    <Title>New Task</Title>
                    <TextInput
                        label="Task Name"
                        value={name}
                        mode="outlined"
                        onChangeText={text => setTaskName(text)}
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
                        numberOfLines={4}
                        onSubmitEditing={Keyboard.dismiss}
                    />
                    <DropDownPicker
                        items={projectUser}
                        placeholder="Select User to assign task"
                        defaultValue={assignUser}
                        containerStyle={{
                            height: 45,
                            marginVertical: 10,
                        }}
                        labelStyle={{ fontFamily: 'poppins-regular' }}
                        style={{
                            backgroundColor: '#fafafa',
                            borderColor: '#737373',
                            fontFamily: 'poppins-regular',
                        }}
                        itemStyle={{
                            justifyContent: 'flex-start'
                        }}
                        dropDownStyle={{ backgroundColor: '#fafafa' }}
                        onChangeItem={item => {
                            setAssignUser(item.value)
                        }}
                    />
                    <Pressable onPress={() => setTaskDateModal(!taskDateModal)}>
                        <TextInput
                            label="End Date"
                            value={moment(taskEndDate).format('YYYY-MM-DD')}
                            style={styles.input}
                            keyboardType='default'
                            dense={true}
                            mode="outlined"
                            editable={false}
                        />
                    </Pressable>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 20, zIndex: 1 }}>
                        <Button mode='outlined' icon={'close-circle-outline'} onPress={() => setaddVisible(!addModal)}>Cancel</Button>
                        <Button mode='contained' icon={'check-circle-outline'} loading={isLoading} onPress={addProjectTaskHandler}>Save</Button>
                    </View>
                </Modal>
            </Portal>

            <Portal>
                <Modal
                    visible={shareModal}
                    onDismiss={() => setShareModal(!shareModal)}
                    contentContainerStyle={styles.containerStyle}>
                    <Title>Share Project</Title>
                    <DropDownPicker
                        items={users}
                        placeholder="Select User to Share Project"
                        multiple={true}
                        multipleText="%d user(s) have been selected."
                        min={0}
                        max={10}
                        defaultValue={user}
                        containerStyle={{
                            height: 45,
                            marginVertical: 10,
                        }}
                        labelStyle={{ fontFamily: 'poppins-regular' }}
                        style={{
                            backgroundColor: '#fafafa',
                            borderColor: '#737373',
                            fontFamily: 'poppins-regular',
                        }}
                        itemStyle={{
                            justifyContent: 'flex-start'
                        }}
                        dropDownStyle={{ backgroundColor: '#fafafa' }}
                        onChangeItem={item => {
                            setUser(item)
                        }}
                    />
                    <FlatList
                        data={user}
                        keyExtractor={(item) => item.toString()}
                        renderItem={(itemData) => <Chip icon="close-circle" style={{ margin: 3 }}
                            onPress={() => setUser(user.filter(function (data) {
                                return itemData.item !== data
                            }))}>{users.filter((data) => data.value == itemData.item)[0].label}</Chip>}
                    />
                    <DropDownPicker
                        items={permissions}
                        placeholder="Select Permissions"
                        multiple={true}
                        multipleText="%d Permission(s) have been selected."
                        min={0}
                        max={10}
                        defaultValue={permission}
                        containerStyle={{
                            height: 45,
                            marginVertical: 10,
                        }}
                        labelStyle={{ fontFamily: 'poppins-regular' }}
                        style={{
                            backgroundColor: '#fafafa',
                            borderColor: '#737373',
                            fontFamily: 'poppins-regular',
                        }}
                        itemStyle={{
                            justifyContent: 'flex-start'
                        }}
                        dropDownStyle={{ backgroundColor: '#fafafa' }}
                        onChangeItem={item => {
                            setPermission(item)
                        }}
                    />
                    <FlatList
                        data={permission}
                        numColumns={3}
                        keyExtractor={(item) => item}
                        renderItem={(itemData) => <Chip icon="close-circle" style={{ margin: 3 }}
                            onPress={() => setPermission(permission.filter(function (data) {
                                return itemData.item !== data
                            }))}>{itemData.item}</Chip>}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 20, zIndex: 1 }}>
                        <Button mode='outlined' icon={'close-circle-outline'} onPress={() => setShareModal(!shareModal)}>Cancel</Button>
                        <Button mode='contained' loading={isLoading} icon={'check-circle-outline'} loading={isLoading} onPress={shareProjectHandler}>Save</Button>
                    </View>
                </Modal>
            </Portal>

            <Portal>
                <Modal
                    visible={renameModal}
                    onDismiss={() => setRenameModal(!renameModal)}
                    contentContainerStyle={styles.containerStyle}>
                    <Title>Rename Project</Title>
                    <TextInput
                        label="Project Name"
                        value={projectName}
                        mode="outlined"
                        onChangeText={text => setProjectName(text)}
                        style={styles.input}
                        autoCapitalize="words"
                        keyboardType='default'
                        dense={true}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 20, zIndex: 1 }}>
                        <Button mode='outlined' icon={'close-circle-outline'} onPress={() => setRenameModal(!renameModal)}>Cancel</Button>
                        <Button mode='contained' icon={'check-circle-outline'} loading={isLoading} onPress={renameProject}>Save</Button>
                    </View>
                </Modal>
            </Portal>

            <Portal>
                <Modal
                    visible={descModal}
                    onDismiss={() => setDescModal(!descModal)}
                    contentContainerStyle={styles.containerStyle}>
                    <Title>Change Description</Title>
                    <TextInput
                        label="Project Description"
                        value={projectDescription}
                        mode="outlined"
                        onChangeText={text => setProjectDescription(text)}
                        style={styles.input}
                        autoCapitalize="words"
                        keyboardType='default'
                        multiline={true}
                        numberOfLines={5}
                        dense={true}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 20, zIndex: 1 }}>
                        <Button mode='outlined' icon={'close-circle-outline'} onPress={() => setDescModal(!descModal)}>Cancel</Button>
                        <Button mode='contained' icon={'check-circle-outline'} loading={isLoading} onPress={updateProjectData}>Save</Button>
                    </View>
                </Modal>
            </Portal>

            <Snackbar
                visible={successMsg}
                duration={3000}
                onDismiss={() => setSuccessMsg(!successMsg)}>
                Project Data Saved!
            </Snackbar>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    tabBarContainer: {
        borderRadius: 10,
        backgroundColor: '#f3f2fa',
        marginVertical: 5
    },
    cardContainer: {
        width: '95%',
        margin: 10,
        padding: 20
    },
    detailContainer: {
        marginTop: 15,
        justifyContent: 'center'
    },
    details: {
        flexDirection: 'row',
        marginBottom: 8,
        alignItems: 'flex-end'
    },
    calInput: {
        backgroundColor: '#f3f2fa',
        width: 90,
        fontFamily: 'poppins-regular',
        borderRadius: 10,
        paddingHorizontal: 4,
        paddingTop: 3,
        marginHorizontal: 5,
        color: 'black',
        fontSize: 14
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

export default ProjectDetailScreen;