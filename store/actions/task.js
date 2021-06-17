import Task from '../../models/task';
import apiUrl from './apiUrl';
import ProjectUser from '../../models/projectUser'
import * as projectActions from '../../store/actions/project';

export const SET_PROJECT_TASKS = 'SET_PROJECT_TASKS';
export const ADD_PROJECT_TASK = 'ADD_PROJECT_TASK';
export const EDIT_PROJECT_TASK = 'EDIT_PROJECT_TASK';
export const DELETE_TASK = 'DELETE_TASK';
export const USER_TASK = 'USER_TASK';

export const fetchProjectTask = (projectname) => {

    const controller = new AbortController();
    const signal = controller.signal;

    return async (dispatch, getState) => {
        const token = getState().auth.access_token;
        const user_id = getState().auth.name;

        const response = await fetch(
            `${apiUrl.url}/project/tasks/${projectname}`,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
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
        const loadedProjectTasks = [];

        for (const key in resData.project.tasks) {
            if (resData.project['created_by'] == user_id || resData.project.tasks[key]['assigned_to'] === user_id) {
                loadedProjectTasks.push(
                    new Task(
                        resData.project.tasks[key]['id'],
                        resData.project.tasks[key]['task_name'],
                        resData.project.tasks[key]['description'],
                        resData.project.tasks[key]['project_name'],
                        resData.project.tasks[key]['created_at'].split(" ")[0],
                        resData.project.tasks[key]['endDate'].split(" ")[0],
                        resData.project.tasks[key]['progress'],
                        resData.project.tasks[key]['status'],
                        resData.project.tasks[key]['assigned_to']
                    )
                );
            }
        }

        const loadedProjectUsers = [];

        for (const key in resData.project.users) {
            loadedProjectUsers.push(
                new ProjectUser(
                    resData.project.users[key]['project_id'],
                    resData.project.users[key]['project_name'],
                    resData.project.users[key]['owner'],
                    resData.project.users[key]['shared_with'],
                    resData.project.users[key]['shared_userid'],
                    resData.project.users[key]['shared_with_username'],
                    resData.project.users[key]['permission'],
                )
            );
        }

        // console.log(resData.project_progress)
        // console.log(resData.project.tasks)
        dispatch({
            type: SET_PROJECT_TASKS,
            projectTasks: loadedProjectTasks,
            projectUsers: loadedProjectUsers,
            projectProgress: resData.project_progress
        });

    };
};

export const createProjectTask = (task_name, description, project_name, userid, endDate) => {
    return async (dispatch, getState) => {

        const token = getState().auth.access_token;

        const response = await fetch(
            `${apiUrl.url}/task/${task_name}`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    description: description,
                    project_id: project_name,
                    user_id: userid,
                    endDate: endDate
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

        dispatch(projectActions.changeProgress(project_name, resData.project_progress))

        dispatch({
            type: ADD_PROJECT_TASK,
            taskData: resData.task,
            project_progress: resData.project_progress
        });

    };
};

export const editProjectTask = (task_id, task_name, status) => {
    return async (dispatch, getState) => {

        const token = getState().auth.access_token;
        const response = await fetch(
            `${apiUrl.url}/task/${task_name}`,
            {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    task_id: task_id,
                    task_name: task_name,
                    status: status
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
            type: EDIT_PROJECT_TASK,
            tid: task_id,
            task_name: task_name,
            status: status
        });

    };
};

export const deleteTask = (name, task_id) => {
    return async (dispatch, getState) => {
        const token = getState().auth.access_token;

        const response = await fetch(
            `${apiUrl.url}/task/${name}`,
            {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    task_id: task_id,
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
            type: DELETE_TASK,
        });

    };
};

export const userTask = () => {
    const controller = new AbortController();
    const signal = controller.signal;

    return async (dispatch, getState) => {
        const token = getState().auth.access_token;
        const user_id = getState().auth.name;

        const response = await fetch(
            `${apiUrl.url}/tasks`,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
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

        //console.log(resData.tasks[0]['id']);

        const loadedProjectTasks = [];

        for (const key in resData.tasks) {

            if (resData.tasks[key]['assigned_to'] === user_id) {
                let id = resData.tasks[key]['id']
                let name = resData.tasks[key]['task_name']
                let desc = resData.tasks[key]['description']
                let project = resData.tasks[key]['project_name']
                let create = resData.tasks[key]['created_at'].split(" ")[0]
                let end = resData.tasks[key]['endDate'].split(" ")[0]
                let progress = resData.tasks[key]['progress']
                let status = resData.tasks[key]['status']
                let assign = resData.tasks[key]['assigned_to']
                loadedProjectTasks.push(
                    new Task(
                        id, name, desc, project, create, end,
                        progress, status, assign
                    )
                );
            }
        }

        //console.log("Loaded Task = " + loadedProjectTasks)
        dispatch({
            type: SET_PROJECT_TASKS,
            peoject: null,
            projectTasks: loadedProjectTasks.length > 0 ? loadedProjectTasks : [],
            projectUsers: [],
            projectProgress: 0
        });

    };
}

export const clearData = () => {
    return {
        type: "CLEAR"
    };
};