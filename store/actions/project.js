import Project from '../../models/project'
import apiUrl from './apiUrl';
import * as authActions from './auth';
import AsyncStorage from '@react-native-community/async-storage';

export const SET_PROJECTS = 'SET_PROJECTS';
export const ADD_PROJECT = 'ADD_PROJECT';
export const EDIT_PROJECT = 'EDIT_PROJECT';
export const RENAME_PROJECT = 'RENAME_PROJECT';
export const DELETE_PROJECT = 'DELETE_PROJECT';
export const CHANGE_START_DATE = 'CHANGE_START_DATE';
export const CHANGE_END_DATE = 'CHANGE_END_DATE';
export const CHANGE_DESCRIPTION = 'CHANGE_DESCRIPTION';
export const CHANGE_PROJECT_PROGRESS = 'CHANGE_PROJECT_PROGRESS';

export const fetchProjects = () => {
    const controller = new AbortController();
    const signal = controller.signal;

    return async (dispatch, getState) => {
        let user_id = getState().auth.user_id;
        let project = getState().projects.availableProjects;

        if (user_id === null) {
            AsyncStorage.getItem('userData').then(async (result) => {
                result = JSON.parse(result)
                if (result != null) {
                    user_id = result.user_id
                    await dispatch(
                        authActions.authenticate(
                            result.access_token,
                            result.refresh_token,
                            result.user_id,
                            result.username,
                            result.name,
                            96000 * 1000
                        )
                    )
                }
            })
        }

        const response = await fetch(
            `${apiUrl.url}/projects`,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                }
            },
            { signal }
        );
        controller.abort();

        if (!response.ok) {
            const errorResData = await response.json();
            console.log(errorResData);
            let message = 'Something went wrong!';
            if (errorResData.message)
                message = errorResData.message
            throw new Error(message);
        }
        const resData = await response.json();

        //console.log(resData.OnGoing)
        const loadedProjects = [];

        for (const key in resData.projects) {

            if (resData.projects[key]['ownerid'] == user_id || resData.projects[key]['users'].find(item => item.shared_userid == user_id)) {
                loadedProjects.push(
                    new Project(
                        resData.projects[key]['id'],
                        resData.projects[key]['name'],
                        resData.projects[key]['description'],
                        resData.projects[key]['created_at'].split(" ")[0],
                        resData.projects[key]['end_date'].split(" ")[0],
                        resData.projects[key]['created_by'],
                        resData.projects[key]['ownerid'],
                        resData.projects[key]['status'],
                        resData.projects[key]['progress'],
                        resData.projects[key]['tasks'].length,
                        resData.projects[key]['users'].length
                    )
                );
            }
        }


        dispatch({
            type: SET_PROJECTS,
            projects: loadedProjects,
            onGoing: loadedProjects.filter(item => item.status == 0).length,
            completed: loadedProjects.filter(item => item.status == 1).length
        });
    };
};

export const createProject = (name, description) => {
    return async (dispatch, getState) => {
        const token = getState().auth.access_token;

        const response = await fetch(
            `${apiUrl.url}/project/${name}`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: name,
                    description: description
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
        console.log(resData.message);

        dispatch({
            type: ADD_PROJECT,
            productData: resData.project
        });
    };
};

export const editProject = (name, description, project_id) => {

    return async (dispatch, getState) => {
        const token = getState().auth.access_token;

        const response = await fetch(
            `${apiUrl.url}/project/${name}`,
            {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: name,
                    description: description,
                    project_id: project_id,
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
            type: CHANGE_DESCRIPTION,
            pid: project_id,
            description: description
        });

    };
};

export const deleteProject = (name) => {
    return async (dispatch, getState) => {
        const token = getState().auth.access_token;

        const response = await fetch(
            `${apiUrl.url}/project/${name}`,
            {
                method: 'DELETE',
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
        console.log(resData);

        dispatch({
            type: DELETE_PROJECT,
            pid: name
        });

    };
};

export const renameProject = (name, project_id) => {

    return async (dispatch, getState) => {
        const token = getState().auth.access_token;

        const response = await fetch(
            `${apiUrl.url}/project/${name}`,
            {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: name,
                    project_id: project_id,
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
            type: RENAME_PROJECT,
            pid: project_id,
            projectName: name
        });

    };
};

export const changeStartDate = (name, project_id, date) => {

    return async (dispatch, getState) => {
        const token = getState().auth.access_token;

        const response = await fetch(
            `${apiUrl.url}/project/${name}`,
            {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    startDate: date,
                    project_id: project_id
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
            type: CHANGE_START_DATE,
            pid: project_id,
            startDate: date
        });

    };
};

export const changeEndDate = (name, project_id, date) => {

    return async (dispatch, getState) => {
        const token = getState().auth.access_token;

        const response = await fetch(
            `${apiUrl.url}/project/${name}`,
            {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    endDate: date,
                    project_id: project_id
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
            type: CHANGE_END_DATE,
            pid: project_id,
            endDate: date
        });

    };
};

export const changeProgress = (pid, progress) => {

    return dispatch => {
        dispatch({
            type: CHANGE_PROJECT_PROGRESS,
            pid: pid,
            progress: progress,
        });
    };
};