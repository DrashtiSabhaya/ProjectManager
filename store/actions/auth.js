import AsyncStorage from '@react-native-community/async-storage'

import apiUrl from './apiUrl';
export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const AUTHENTICATE = 'AUTHENTICATE';

let timer;


export const authenticate = (access_token, refresh_token, user_id, username, name, expiryTime) => {

    return dispatch => {
        dispatch(setLogoutTimer(expiryTime));
        dispatch({
            type: AUTHENTICATE,
            access_token: access_token,
            refresh_token: refresh_token,
            user_id: user_id,
            username: username,
            name: name
        });
    };
};


export const signup = (name, email, password) => {
    return async dispatch => {

        const response = await fetch(
            `${apiUrl.url}/register`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    username: email,
                    password: password,
                })
            }
        );

        if (!response.ok) {
            const errorResData = await response.json();
            let message = 'Something went wrong!';
            if (errorResData.message)
                message = errorResData.message
            throw new Error(message);
        }

        const resData = await response.json();
        const expirationDate = new Date(
            new Date().getTime() + (96000 * 1000)
        );
        dispatch(
            authenticate(
                resData.access_token,
                resData.refresh_token,
                resData.user_id,
                resData.username,
                resData.name,
                96000 * 1000
            )
        );
        saveDataToStorage(
            resData.access_token,
            resData.refresh_token,
            resData.user_id,
            resData.username,
            resData.name,
            expirationDate
        );
    };
};

export const login = (email, password) => {
    return async dispatch => {

        const response = await fetch(
            `${apiUrl.url}/login`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: email,
                    password: password,
                })
            }
        );

        if (!response.ok) {
            const errorResData = await response.json();
            let message = 'Something went wrong!';
            if (errorResData.message)
                message = errorResData.message
            throw new Error(message);
        }

        const resData = await response.json();

        dispatch(
            authenticate(
                resData.access_token,
                resData.refresh_token,
                resData.user_id,
                resData.username,
                resData.name,
                96000 * 1000
            )
        );

        const expirationDate = new Date(
            new Date().getTime() + (691200 * 1000)
        );
        saveDataToStorage(
            resData.access_token,
            resData.refresh_token,
            resData.user_id,
            resData.username,
            resData.name,
            expirationDate
        );
    };
};


export const logout = () => {
    clearLogoutTimer();
    AsyncStorage.removeItem('userData');
    return { type: LOGOUT };
};

const clearLogoutTimer = () => {
    if (timer) {
        clearTimeout(timer);
    }
};

const setLogoutTimer = expirationTime => {
    return dispatch => {
        timer = setTimeout(() => {
            dispatch(logout());
        }, expirationTime);
    };
};


const saveDataToStorage = (access_token, refresh_token, user_id, username, name, expirationDate) => {
    AsyncStorage.setItem(
        'userData',
        JSON.stringify({
            access_token: access_token,
            refresh_token: refresh_token,
            user_id: user_id,
            username: username,
            name:name,
            expiryDate: expirationDate.toISOString()
        })
    );
};
