import {
    SET_SUB_TASKS,
    ADD_SUB_TASK,
    EDIT_SUB_TASK,
    DELETE_SUB_TASK
} from '../actions/subtask';
import SubTask from '../../models/subtask';

const initialState = {
    subTasks: [],
    task_progress: 0
};

export default (state = initialState, action) => {

    switch (action.type) {
        case SET_SUB_TASKS:
            return {
                subTasks: action.subtask,
                task_progress: action.task_progress
            };
        case ADD_SUB_TASK:
            const newTask = new SubTask(
                action.taskData['id'],
                action.taskData['task_name'],
                action.taskData['description'],
                action.taskData['task_id'],
                action.taskData['created_at'].split(" ")[0],
                action.taskData['user_id'],
                action.taskData['created_by'],
                action.taskData['status']
            )
            return {
                ...state,
                subTasks: state.subTasks.concat(newTask),
                task_progress: action.task_progress
            };
        case EDIT_SUB_TASK:
            const taskIndex = state.subTasks.findIndex(
                task => task.id == action.tid
            );
            console.log(taskIndex)
            const updatedTask = new SubTask(
                action.tid,
                state.subTasks[taskIndex].task_name,
                state.subTasks[taskIndex].description,
                state.subTasks[taskIndex].task_id,
                state.subTasks[taskIndex].created_at,
                state.subTasks[taskIndex].user_id,
                state.subTasks[taskIndex].created_by,
                action.status
            )
            updateSubTask = [...state.subTasks]
            updateSubTask[taskIndex] = updatedTask
            return {
                ...state,
                subTasks: updateSubTask,
                task_progress: action.task_progress
            };
        case DELETE_SUB_TASK:
            return {
                ...state,
                subTasks: state.subTasks.filter(
                    task => task.id != action.tid
                ),
                task_progress: action.task_progress
            };
        case "CLEAR":
            return initialState;
        default:
            return state;
    }

};