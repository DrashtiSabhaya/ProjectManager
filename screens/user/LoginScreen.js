import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ImageBackground
} from 'react-native';
import {
    TextInput,
    Button,
    Title,
    Text
} from 'react-native-paper';
import ErrorAlert from '../../components/ErrorAlert';
import { useDispatch } from 'react-redux';
import * as authActions from '../../store/actions/auth';
import ActionCard from '../../components/ActionCard';
import Color from '../../constants/Color';

const LoginScreen = ({ navigation }) => {

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [modalvisible, setModalVisible] = useState(false);
    const [errMessage, setErrMessage] = useState('');
    const [passwordView, changeView] = useState(true);

    const dispatch = useDispatch();

    useEffect(() => {
        if (error) {
            setErrMessage(error);
            setModalVisible(!modalvisible);
        }
    }, [error]);

    const validateInputs = () => {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!username) {
            setErrMessage('Email Address field Can\'t be Blank');
            setModalVisible(!modalvisible);
            return false;
        }
        if (!emailRegex.test(username.toLowerCase())) {
            setErrMessage('Please Enter Valid Email address');
            setModalVisible(!modalvisible);
            return false;
        }
        if (!password) {
            setErrMessage('Password field can\'t be blank');
            setModalVisible(!modalvisible);
            return false;
        }
        if (password.length < 6) {
            setErrMessage('Password must be 6 character Long');
            setModalVisible(!modalvisible);
            return false;
        }
        return true;
    }

    const loginHandler = async () => {
        setError(null);
        if (!validateInputs())
            return;
        setIsLoading(true);
        try {
            await dispatch(
                authActions.login(
                    username,
                    password
                )
            );
            navigation.replace('DrawerNavigatorRoutes');
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    return (
        <ImageBackground source={require('../../images/purpule-bg1.jpg')} style={styles.imageBackground} >
            <View style={styles.container}>
                <ErrorAlert
                    modalView={modalvisible}
                    toggleModal={() => setModalVisible(!modalvisible)}
                    errorMessage={errMessage}
                />
                <ActionCard style={styles.cardContainer}>
                    <Title style={styles.titleStyle}>LOG IN</Title>
                    <TextInput
                        label="Enter Email"
                        value={username}
                        left={<TextInput.Icon name="email" color={Color.primary} />}
                        mode="flat"
                        dense={true}
                        onChangeText={text => setUsername(text)}
                        style={styles.input}
                        autoCapitalize="none"
                        keyboardType='email-address'
                    />
                    <TextInput
                        label="Enter Password"
                        left={<TextInput.Icon name="key" color={Color.primary} />}
                        right={<TextInput.Icon name={passwordView ? "eye" : "eye-off"} color={Color.primary} onPress={() => changeView(!passwordView)} />}
                        value={password}
                        mode="flat"
                        dense={true}
                        onChangeText={text => setPassword(text)}
                        secureTextEntry={passwordView}
                        style={styles.input}
                        autoCapitalize="none"
                        keyboardType='default'
                    />
                    <Button mode='contained' loading={isLoading} onPress={loginHandler} style={styles.button} icon={'location-enter'}>Login</Button>
                    <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')} style={{ alignItems: 'center' }} >
                        <Text>Don't have an account? Signup </Text>
                    </TouchableOpacity>
                </ActionCard>
            </View>
        </ImageBackground >

    );
};

const styles = StyleSheet.create({
    container: {
        margin: 15,
        alignItems: 'center'
    },
    imageBackground: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: 'center'
    },
    cardContainer: {
        width: '95%',
        margin: 10,
        padding: 25,
        justifyContent: 'center',
    },
    input: {
        marginVertical: 8,
        backgroundColor: '#fafafa',
        borderBottomColor: Color.primary
    },
    button: {
        marginVertical: 10
    },
    titleStyle: {
        fontSize: 28,
        color: Color.primary,
        marginVertical: 15,
        alignSelf: 'center'
    }
});

export default LoginScreen;
