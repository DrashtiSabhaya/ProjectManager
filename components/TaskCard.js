import React from 'react';
import {
    View,
    StyleSheet,
    TouchableHighlight,
    Switch
} from 'react-native';
import ProgressCircle from 'react-native-progress-circle'
import Color from '../constants/Color';
import { Text, Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TaskCard = (props) => {
    return (
        <TouchableHighlight
            activeOpacity={0.9}
            underlayColor="#f3f2fa"
            onPress={props.onSelect}>
            <View style={styles.cardContainer}>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <ProgressCircle
                        percent={props.percent}
                        radius={28}
                        borderWidth={5}
                        color={props.percent == 100 ? Color.accent : Color.primary}
                        shadowColor="#f3f2fa"
                        bgColor="#fff">
                        {props.percent == 100 ? (<Icon name='check-bold' size={25} color={Color.accent} />) : (<Text>{props.percent}%</Text>)}
                    </ProgressCircle>
                </View>
                <View style={styles.dataContainer}>
                    <Text style={{ fontSize: 16, marginVertical: 5 }}>{props.title}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Icon name={'calendar-month-outline'} size={15} />
                            <Text style={{ fontSize: 12, fontFamily: 'poppins-light' }}> {props.date}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Icon name={'account-outline'} size={15} />
                            <Text style={{ fontSize: 12, fontFamily: 'poppins-light' }}> {props.owner}</Text>
                        </View>
                    </View>
                </View>
                <Switch
                    trackColor={{ false: "#767577", true: Color.accent }}
                    thumbColor={props.isEnabled ? Color.primary : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={props.toggleSwitch}
                    value={props.isEnabled}
                />
            </View>
        </TouchableHighlight>
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

export default TaskCard;