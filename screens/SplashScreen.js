import React, { useState, useEffect } from 'react';
import {
    ActivityIndicator,
    View,
    StyleSheet,
    Image,
    ImageBackground
} from 'react-native';
import {
    Text
} from 'react-native-paper'

import AsyncStorage from '@react-native-community/async-storage';
import Color from '../constants/Color';

const SplashScreen = ({ navigation }) => {
    const [animating, setAnimating] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setAnimating(false);
            AsyncStorage.getItem('userData').then((result) => {
                navigation.replace(result == null ? 'AuthNavigator' : 'DrawerNavigatorRoutes')
            })
        }, 3000);
    }, []);

    return (
        <View style={styles.container}>
            <Text style={{ color: Color.primary, fontSize: 38, fontFamily: 'poppins-bold', marginVertical: 10 }}>Project Manger</Text>
            <Image source={require('../images/task-image.jpg')} style={styles.imageStyle} />
            <ActivityIndicator
                animating={animating}
                color={Color.primary}
                size="large"
                style={styles.activityIndicator}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    activityIndicator: {
        alignItems: 'center',
        height: 80,
    },
    imageStyle: {
        height: 250,
        width: '100%',
        resizeMode: 'cover'
    },
});

export default SplashScreen;