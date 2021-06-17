import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    StyleSheet,
    TextInput as TextIn,
    Pressable,
    FlatList,
    Button as NativeButton,
    SafeAreaView,
    Keyboard
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
    Menu,
    Divider,
    Provider,
    Dialog
} from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import * as Progress from 'react-native-progress';
import Color from '../../constants/Color';
import ActionCard from '../../components/ActionCard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';
import * as subTaskAction from '../../store/actions/subtask';
import * as projectTaskActions from '../../store/actions/task';
import SubTaskCard from '../../components/SubTaskCard';


const TaskDetailScreen = ({ route, navigation }) => {
    const { taskData } = route.params;

    const [visible, setVisible] = useState(false);
    const [isDisplay, setDisplay] = useState(true);
    const [addModal, setaddVisible] = useState(false);
    const [name, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    const [successMsg, setSuccessMsg] = useState(false);
    const [isEnabled, setIsEnabled] = useState([]);
    const [renameModal, setRenameModal] = useState(false);
    const [taskName, setMainTaskName] = useState(taskData.task_name);
    const [deletConfirm, setDeletConfirm] = useState(false);

    const tasks = useSelector(state => state.subtask.subTasks);
    let task_progress = useSelector(state => state.subtask.task_progress);

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

    const loadSubTasks = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            await dispatch(subTaskAction.fetchSubTask(taskData.id));
        } catch (err) {
            setError(err.message);
        }
        setIsRefreshing(false);
    }, [dispatch, setIsLoading, setError]);

    useEffect(() => {
        const willFocusSub = navigation.addListener(
            'focus',
            loadSubTasks
        );

        return () => {
            willFocusSub;
        };
    }, [dispatch, loadSubTasks]);

    const clearTasks = async () => {
        try {
            await dispatch(subTaskAction.clearData());
        } catch (err) {
            console.log(err.message);
        }
    }

    if (error) {
        alert(error)
        console.log(error)
        return (
            <View style={styles.container}>
                <Text>An error occurred!</Text>
                <NativeButton
                    title="Try again"
                    onPress={loadSubTasks}
                    color={Color.accent} />
            </View>
        );
    }

    const addSubTaskHandler = async () => {
        setError(null);
        if (!name) {
            alert('Please Enter Task Name');
            return;
        }
        if (!description) {
            alert('Please Enter Task Description');
            return;
        }
        setIsLoading(true);
        try {
            await dispatch(
                subTaskAction.createSubTask(
                    name,
                    taskData.id,
                    description
                )
            );
            setSuccessMsg(true);
            //loadSubTasks()
            setIsLoading(false);
            setaddVisible(!addModal);
            setTaskName('')
            setDescription('')
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    const editSubTaskHandler = async (item) => {
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(
                subTaskAction.editSubTask(
                    item.id,
                    item.task_name,
                    taskData.id,
                    (item.status == 0 ? 1 : 0)
                )
            )
            //loadSubTasks()
            setIsLoading(false);
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
                    taskData.id,
                    taskName,
                    (task_progress == 100 ? 1 : 0)
                )
            )
            setIsLoading(false);
            setRenameModal(false);
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    const deleteProjectTask = async () => {
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(
                projectTaskActions.deleteTask(
                    taskName,
                    taskData.id,
                )
            );
            setIsLoading(false);
            navigation.goBack()
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    const deleteSubTask = async (item) => {
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(
                subTaskAction.deleteTask(
                    item.task_name,
                    item.id,
                )
            );
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
        editSubTaskHandler(item)
    };

    const renderSubTask = (itemData) => {
        isEnabled.push({ state: itemData.item.status == 0 ? false : true, item: itemData.item.id })

        return (
            <SubTaskCard
                title={itemData.item.task_name}
                date={itemData.item.created_at}
                owner={itemData.item.created_by}
                description={itemData.item.description}
                toggleSwitch={() => toggleState(itemData.item)}
                isEnabled={(isEnabled.filter(item => itemData.item.id == item.item))[0].state}
                deleteSubTask={() => deleteSubTask(itemData.item)}
            />
        );
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
                    <Menu.Item icon="rename-box" onPress={() => setRenameModal(!renameModal)} title="Rename" />
                    <Divider />
                    <Menu.Item icon="trash-can-outline" onPress={() => setDeletConfirm(!deletConfirm)} title="Delete" />
                    <Divider />
                    <Menu.Item icon="refresh" onPress={loadSubTasks} title="Refresh" />
                </Menu>
            </View>
            <Portal>
                <Dialog visible={deletConfirm} onDismiss={() => setDeletConfirm(!deletConfirm)}>
                    <Dialog.Title>Delete Project</Dialog.Title>
                    <Dialog.Content>
                        <Text>Are you sure, Do you want to Delete this Task?</Text>
                    </Dialog.Content>
                    <Dialog.Actions >
                        <Button onPress={() => setDeletConfirm(!deletConfirm)}>Cancel</Button>
                        <Button onPress={deleteProjectTask} style={{ marginRight: 10 }}>Yes</Button>
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
                            <Title style={{ fontSize: 27 }}>{task_progress}% </Title>
                            <Text style={{ fontSize: 16 }}> completed</Text>
                        </View>
                        <Progress.Bar progress={task_progress / 100} borderRadius={3} color={Color.primary} height={8} width={330} />
                    </CollapseHeader>
                    <CollapseBody>
                        <View style={styles.detailContainer}>
                            <View style={{ ...styles.details, ...{ alignItems: 'center' } }}>
                                <Icon name={'label-variant'} size={26} color={Color.primary} />
                                <Title> {taskName}</Title>
                            </View>
                            <View style={{ ...styles.details, ...{ alignItems: 'center' } }}>
                                <Icon name={'home-analytics'} size={26} color={Color.primary} />
                                <Text> {taskData.project_name}</Text>
                            </View>
                            <View style={styles.details}>
                                <Icon name={'account-outline'} size={26} color={Color.primary} />
                                <Text> Assign to: {taskData ? taskData.assigned_to : "Owner"}</Text>
                            </View>
                            <View style={styles.details}>
                                <Icon name={'calendar-month'} size={26} color={Color.primary} />
                                <TextIn style={styles.calInput} value={moment(taskData.created_at).format('YYYY-MM-DD')} editable={false} />
                                <Icon name={'chevron-double-right'} style={{ fontWeight: '900' }} size={26} color={Color.primary} />
                                <TextIn style={styles.calInput} editable={false} value={moment(taskData.endDate).format('YYYY-MM-DD')} />
                            </View>
                            <View style={styles.details}>
                                <Icon name={'timer-outline'} size={26} color={Color.primary} />
                                <Text> Days Left: {(moment(taskData.endDate).diff(moment(new Date()), 'days') > 0) ? moment(taskData.endDate).diff(moment(new Date()), 'days') : 0} </Text>
                            </View>
                            <View style={{ ...styles.details, alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                                <Icon name={'text-box-outline'} size={26} color={Color.primary} />
                                <TextIn
                                    style={{ ...styles.calInput, ...{ width: '90%', textAlignVertical: 'top' } }}
                                    editable={false}
                                    multiline={true}
                                    numberOfLines={4}
                                    value={taskData.description}
                                />
                            </View>
                        </View>
                    </CollapseBody>
                </Collapse>
            </ActionCard >

            <SafeAreaView style={{ flex: 1 }}>
                <FlatList
                    onRefresh={loadSubTasks}
                    refreshing={isRefreshing}
                    data={tasks}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderSubTask}
                    contentContainerStyle={{
                        flexGrow: 1,
                    }}
                />
            </SafeAreaView>
            <FAB
                style={styles.fab}
                icon="file-plus-outline"
                onPress={() => setaddVisible(!addModal)}
            />
            <Portal>
                <Modal
                    visible={addModal}
                    onDismiss={() => setaddVisible(!addModal)}
                    contentContainerStyle={styles.containerStyle}>
                    <Title>Sub Task</Title>
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
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 20, zIndex: 1 }}>
                        <Button mode='outlined' icon={'close-circle-outline'} onPress={() => setaddVisible(!addModal)}>Cancel</Button>
                        <Button mode='contained' icon={'check-circle-outline'} loading={isLoading} onPress={addSubTaskHandler}>Save</Button>
                    </View>
                </Modal>
            </Portal>
            <Portal>
                <Modal
                    visible={renameModal}
                    onDismiss={() => setRenameModal(!renameModal)}
                    contentContainerStyle={styles.containerStyle}>
                    <Title>Rename Task</Title>
                    <TextInput
                        label="Task Name"
                        value={taskName}
                        mode="outlined"
                        onChangeText={text => setMainTaskName(text)}
                        style={styles.input}
                        autoCapitalize="words"
                        keyboardType='default'
                        dense={true}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 20, zIndex: 1 }}>
                        <Button mode='outlined' icon={'close-circle-outline'} onPress={() => setRenameModal(!renameModal)}>Cancel</Button>
                        <Button mode='contained' icon={'check-circle-outline'} loading={isLoading} onPress={editTaskHandler}>Save</Button>
                    </View>
                </Modal>
            </Portal>
            <Snackbar
                visible={successMsg}
                duration={2000}
                onDismiss={() => setSuccessMsg(!successMsg)}>
                Your Subtask is Saved!
            </Snackbar>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff'
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
        margin: 16,
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

export default TaskDetailScreen;