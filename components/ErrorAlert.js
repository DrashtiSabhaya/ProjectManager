import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    Pressable,
    Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

const ErrorAlert = (props) => {
    const modalvisible = props.modalView;
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalvisible}
            onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                props.toggleModal;
            }}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Icon name='closecircleo' size={45} color='#b20000' />
                    <Text style={styles.modalText}>{props.errorMessage}</Text>
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={props.toggleModal}>
                        <Text style={styles.textStyle}>Okay</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(52, 52, 52, 0.8)'
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 25,
        width: '85%',
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 40,
        elevation: 50,
    },
    button: {
        borderRadius: 2,
        paddingHorizontal: 20,
        paddingVertical: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#b20000",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginVertical: 15,
        textAlign: "center",
        fontSize: 16
    }
});

export default ErrorAlert;