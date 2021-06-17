import ProjectUser from '../../models/projectUser'
import apiUrl from './apiUrl';

export const SET_SHARED_PROJECT = 'SET_SHARED_PROJECT';
export const SHARE_PROJECT = 'SHARE_PROJECT';
export const PROJECT_USER = 'PROJECT_USER';


export const shareProject = (name, user_id, permission) => {
    return async (dispatch, getState) => {
        const token = getState().auth.access_token;

        const response = await fetch(
            `${apiUrl.url}/project/share`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    project_id: name,
                    user_ids: user_id,
                    permissions: permission
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
        console.log(resData);

        dispatch({
            type: SHARE_PROJECT,
        });

    };
};

export const projectUser = (name) => {
    return async (dispatch, getState) => {
        const token = getState().auth.access_token;

        const response = await fetch(
            `${apiUrl.url}/shared_project/${name}`,
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
            let message = 'Something went wrong!';
            if (errorResData.message)
                message = errorResData.message
            throw new Error(message);
        }

        const resData = await response.json();
        
        const loadedProjectUsers = [];

        for (const key in resData.project_users) {
            loadedProjectUsers.push(
                new ProjectUser(
                    resData.project_users[key]['project_id'],
                    resData.project_users[key]['project_name'],
                    resData.project_users[key]['owner'],
                    resData.project_users[key]['shared_with'],
                    resData.project_users[key]['shared_userid'],
                    resData.project_users[key]['shared_with_username'],
                    resData.project_users[key]['permission'],
                )
            );
        }

        dispatch({
            type: PROJECT_USER,
            projectUsers: loadedProjectUsers
        });

    };
};
