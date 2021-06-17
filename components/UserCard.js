import React from 'react';
import {
    View,
    StyleSheet,
    Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Color from '../constants/Color';

const UserCard = (props) => {
    return (
        <View style={styles.container}>
            <View style={styles.cardContainer}>
                <View style={styles.identityContainer}>
                    <Icon name={'person'} size={25} color={Color.primary} />
                    <Text style={styles.nameContainer}>{props.name}</Text>
                </View>
                <View style={styles.identityContainer}>
                    <Icon name={'person-circle'} size={20} color={Color.primary} />
                    <Text style={styles.usernmContainer}>{props.username}</Text>
                </View>
            </View>
            <View style={styles.iconContainer}>
                <Icon
                    name={props.activeStatus ? 'checkmark-circle' : 'close-circle'}
                    size={35}
                    color={props.activeStatus ? 'green' : 'red'} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: 10,
        borderLeftWidth: 3,
        borderLeftColor: Color.primary,
        elevation: 5,
        padding: 20,
        backgroundColor: "#fff",
        justifyContent: 'space-between',
        margin: 8,
        alignItems: 'center',
    },
    identityContainer: {
        flexDirection: 'row',
    },
    nameContainer: {
        marginBottom: 12,
        marginLeft: 10,
        fontSize: 20,
        color: Color.primary
    },
    usernmContainer: {
        marginLeft: 10,
        color: Color.primary
    }
});

export default UserCard;