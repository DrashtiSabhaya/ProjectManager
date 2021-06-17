import apiUrl from './apiUrl';
import User from '../../models/user';

export const SET_USERS = 'SET_USERS';
export const CHANGE_USER_STATUS = 'CHANGE_USER_STATUS';

export const fetchUsers = () => {

    return async (dispatch, getState) => {
        const token = getState().auth.access_token;
        const username = getState().auth.username;

        const response = await fetch(
            `${apiUrl.url}/users`,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            const errorResData = await response.json();
            console.log(errorResData);
            let message = 'Something went wrong!';
            if (errorResData.message)
                message = errorResData.message
            throw new Error(message);
        }

        const resData = await response.json();

        const loadedUsers = [];
        for (const key in resData.users) {

            if (username != resData.users[key]['username'] && "admin@pmanager.com" != resData.users[key]['username']) {
                loadedUsers.push(
                    new User(
                        resData.users[key]['id'],
                        resData.users[key]['name'],
                        resData.users[key]['username'],
                        resData.users[key]['active_status'],
                    )
                );
            }
        }

        dispatch({
            type: SET_USERS,
            users: loadedUsers
        });

    };
};

export const changeStatus = (id) => {
    return async (dispatch, getState) => {
        const token = getState().auth.access_token;
        const username = getState().auth.username;

        const response = await fetch(
            `${apiUrl.url}/changestatus/${id}`,
            {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            const errorResData = await response.json();
            console.log(errorResData);
            let message = 'Something went wrong!';
            if (errorResData.message)
                message = errorResData.message
            throw new Error(message);
        }

        const resData = await response.json();

        console.log(resData);

        dispatch({
            type: CHANGE_USER_STATUS,
        });
    }
}