import { 
    SET_PROJECT_TASKS, 
    ADD_PROJECT_TASK,
    USER_TASK,
    EDIT_PROJECT_TASK
} from '../actions/task';
import Task from '../../models/task';

const initialState = {
    projectsTasks: [],
    projectUsers: [],
    projectProgress: 0
};

export default (state = initialState, action) => {

    switch (action.type) {
        case SET_PROJECT_TASKS:
            return {
                projectsTasks: action.projectTasks,
                projectUsers: action.projectUsers,
                projectProgress: action.projectProgress
            };
        case ADD_PROJECT_TASK:
            const newTask = new Task(
                action.taskData['id'],
                action.taskData['task_name'],
                action.taskData['description'],
                action.taskData['project_name'],
                action.taskData['created_at'].split(" ")[0],
                action.taskData['endDate'].split(" ")[0],
                action.taskData['progress'],
                action.taskData['status'],
                action.taskData['assigned_to']
            )
            return {
                ...state,
                projectsTasks: state.projectsTasks.concat(newTask),
                projectUsers: state.projectUsers,
                projectProgress: action.project_progress
            };
        case EDIT_PROJECT_TASK:
            const taskIndex = state.projectsTasks.findIndex(
                task => task.id === action.tid
            );
            console.log(taskIndex)
            const updatedTask = new Task(
                action.tid,
                action.task_name,
                state.projectsTasks[taskIndex].description,
                state.projectsTasks[taskIndex].project_name,
                state.projectsTasks[taskIndex].created_at,
                state.projectsTasks[taskIndex].endDate,
                state.projectsTasks[taskIndex].progress,
                action.status,
                state.projectsTasks[taskIndex].assigned_to
            )
            const updateTask = [...state.projectsTasks]
            updateTask[taskIndex] = updatedTask
            return {
                ...state,
                projectsTasks: updateTask,
                projectUsers: state.projectUsers,
                projectProgress: action.project_progress
            };
        case USER_TASK:
            console.log("Action task = " + action.projectTasks[1].task_name)
            return {
                projectTasks: action.projectTasks,
                projectUsers: [],
                projectProgress: state.projectProgress
            }
        case "CLEAR":
            return initialState;

        default:
            return state;
    }
};