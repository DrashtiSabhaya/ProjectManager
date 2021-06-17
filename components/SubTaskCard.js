import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableHighlight,
    Switch,
    TouchableOpacity
} from 'react-native';
import Color from '../constants/Color';
import {
    Text,
    Title,
    Button,
    Portal,
    Dialog
} from 'react-native-paper';
import {
    Menu,
    MenuTrigger,
    MenuOptions,
    MenuOption,
} from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SubTaskCard = (props) => {
    const [deletConfirm, setDeletConfirm] = useState(false);

    return (
        <View style={styles.cardContainer}>
            <Switch
                trackColor={{ false: "#767577", true: Color.accent }}
                thumbColor={props.isEnabled ? Color.primary : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={props.toggleSwitch}
                value={props.isEnabled}
            />
            <View style={styles.dataContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 16, marginVertical: 5 }}>{props.title}</Text>
                    <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                        <Icon name={'calendar-month-outline'} size={15} />
                        <Text style={{ fontSize: 12, fontFamily: 'poppins-light' }}> {props.date}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Icon name={'note-text'} size={15} />
                    <Text style={{ fontSize: 12, fontFamily: 'poppins-light' }}> {props.description}</Text>
                </View>
            </View>
            <Menu>
                <MenuTrigger customStyles={{ alignItems: 'flex-end' }}>
                    <Icon name={'dots-vertical'} size={22} />
                </MenuTrigger>
                <MenuOptions>
                    <MenuOption onSelect={() => setDeletConfirm(!deletConfirm)} value="Delete" >
                        <View style={{ flexDirection: 'row', padding: 10 }}>
                            <Icon name={'trash-can'} size={22} />
                            <Text style={{ marginHorizontal: 10, fontFamily: 'poppins-regular' }}>Delete</Text>
                        </View>
                    </MenuOption>
                </MenuOptions>
            </Menu>
            <Portal>
                <Dialog visible={deletConfirm} onDismiss={() => setDeletConfirm(!deletConfirm)}>
                    <Dialog.Title>Delete Task</Dialog.Title>
                    <Dialog.Content>
                        <Text>Are you sure, Do you want to Delete this Task?</Text>
                    </Dialog.Content>
                    <Dialog.Actions >
                        <Button onPress={() => setDeletConfirm(!deletConfirm)}>Cancel</Button>
                        <Button onPress={props.deleteSubTask} style={{ marginRight: 10 }}>Yes</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        width: '95%',
        /** IOS Shadow Properties */
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.6,
        shadowRadius: 6,
        /** Android Shadow Property */
        padding: 15,
        elevation: 5,
        backgroundColor: 'white',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 10
    },
    dataContainer: {
        flex: 1,
        marginHorizontal: 8,
        width: '75%'
    }
});

export default SubTaskCard;