import apiUrl from './apiUrl';
import SubTask from '../../models/subtask';
import * as projectActions from '../../store/actions/project';

export const SET_SUB_TASKS = 'SET_SUB_TASKS';
export const ADD_SUB_TASK = 'ADD_SUB_TASK';
export const EDIT_SUB_TASK = 'EDIT_SUB_TASK';
export const DELETE_SUB_TASK = 'DELETE_SUB_TASK';

export const fetchSubTask = (task_id) => {

    const controller = new AbortController();
    const signal = controller.signal;

    return async (dispatch, getState) => {
        const token = getState().auth.access_token;

        const response = await fetch(
            `${apiUrl.url}/task/subtasks/${task_id}`,
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

        for (const key in resData.sub_task) {
            loadedProjectTasks.push(
                new SubTask(
                    resData.sub_task[key]['id'],
                    resData.sub_task[key]['task_name'],
                    resData.sub_task[key]['description'],
                    resData.sub_task[key]['task_id'],
                    resData.sub_task[key]['created_at'].split(" ")[0],
                    resData.sub_task[key]['user_id'],
                    resData.sub_task[key]['created_by'],
                    resData.sub_task[key]['status']
                )
            );
        }

        // console.log(loadedProjectTasks)

        dispatch({
            type: SET_SUB_TASKS,
            subtask: loadedProjectTasks,
            task_progress: resData.task_progress
        });

    };
};

export const createSubTask = (task_name, task_id, description) => {
    return async (dispatch, getState) => {

        const token = getState().auth.access_token;

        const response = await fetch(
            `${apiUrl.url}/subtask/${task_name}`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    description: description,
                    task_id: task_id
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
        dispatch(projectActions.changeProgress(resData.project_id, resData.project_progress))

        dispatch({
            type: ADD_SUB_TASK,
            taskData: resData.task,
            task_progress: resData.task_progress
        });
    };
};

export const editSubTask = (id, task_name, task_id, status) => {
    return async (dispatch, getState) => {

        const token = getState().auth.access_token;
        const response = await fetch(
            `${apiUrl.url}/subtask/${task_name}`,
            {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: id,
                    task_id: task_id,
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
        console.log(resData.message);
        dispatch(projectActions.changeProgress(resData.project_id, resData.project_progress))

        dispatch({
            type: EDIT_SUB_TASK,
            tid: id,
            status: status,
            task_progress: resData.task_progress
        });

    };
};

export const deleteTask = (name, task_id) => {
    return async (dispatch, getState) => {
        const token = getState().auth.access_token;

        const response = await fetch(
            `${apiUrl.url}/subtask/${name}`,
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
        console.log(resData.message);
        dispatch(projectActions.changeProgress(resData.project_id, resData.project_progress))

        dispatch({
            type: DELETE_SUB_TASK,
            task_progress: resData.task_progress,
            tid: task_id
        });

    };
};

export const clearData = () => {
    return {
        type: "CLEAR"
    };
};

