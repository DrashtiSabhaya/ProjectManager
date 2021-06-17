import {
    SET_PROJECTS,
    ADD_PROJECT,
    RENAME_PROJECT,
    CHANGE_START_DATE,
    CHANGE_END_DATE,
    DELETE_PROJECT,
    CHANGE_DESCRIPTION,
    CHANGE_PROJECT_PROGRESS
} from '../actions/project';
import Project from '../../models/project'


const initialState = {
    availableProjects: [],
    onGoing: 0,
    completed: 0
};

export default (state = initialState, action) => {

    switch (action.type) {
        case SET_PROJECTS:
            return {
                availableProjects: action.projects,
                onGoing: action.onGoing,
                completed: action.completed
            };

        case ADD_PROJECT:
            const productData = action.productData
            const project = new Project(
                productData['id'],
                productData['name'],
                productData['description'],
                productData['created_at'].split(" ")[0],
                productData['end_date'].split(" ")[0],
                productData['created_by'],
                productData['ownerid'],
                productData['status'],
                productData['progress'],
                productData['tasks'].length,
                productData['users'].length
            )
            return {
                ...state,
                availableProjects: state.availableProjects.concat(project),
                onGoing: state.onGoing + 1,
                completed: state.completed
            };

        case RENAME_PROJECT:
            let projectIndex = state.availableProjects.findIndex(
                proj => proj.id === action.pid
            );
            let updatedProject = new Project(
                action.pid,
                action.projectName,
                state.availableProjects[projectIndex].description,
                state.availableProjects[projectIndex].created_at,
                state.availableProjects[projectIndex].end_date,
                state.availableProjects[projectIndex].created_by,
                state.availableProjects[projectIndex].ownerid,
                state.availableProjects[projectIndex].status,
                state.availableProjects[projectIndex].progress,
                state.availableProjects[projectIndex].total_tasks,
                state.availableProjects[projectIndex].project_users
            )
            let updateAvailableProject = [...state.availableProjects]
            updateAvailableProject[projectIndex] = updatedProject
            return {
                ...state,
                availableProjects: updateAvailableProject,
                onGoing: state.onGoing,
                completed: state.completed
            };

        case CHANGE_START_DATE:
            projectIndex = state.availableProjects.findIndex(
                proj => proj.id === action.pid
            );
            updatedProject = new Project(
                action.pid,
                state.availableProjects[projectIndex].name,
                state.availableProjects[projectIndex].description,
                action.startDate,
                state.availableProjects[projectIndex].end_date,
                state.availableProjects[projectIndex].created_by,
                state.availableProjects[projectIndex].ownerid,
                state.availableProjects[projectIndex].status,
                state.availableProjects[projectIndex].progress,
                state.availableProjects[projectIndex].total_tasks,
                state.availableProjects[projectIndex].project_users
            )
            updateAvailableProject = [...state.availableProjects]
            updateAvailableProject[projectIndex] = updatedProject
            return {
                ...state,
                availableProjects: updateAvailableProject,
                onGoing: state.onGoing,
                completed: state.completed
            };

        case CHANGE_END_DATE:
            projectIndex = state.availableProjects.findIndex(
                proj => proj.id === action.pid
            );
            updatedProject = new Project(
                action.pid,
                state.availableProjects[projectIndex].name,
                state.availableProjects[projectIndex].description,
                state.availableProjects[projectIndex].created_at,
                action.endDate,
                state.availableProjects[projectIndex].created_by,
                state.availableProjects[projectIndex].ownerid,
                state.availableProjects[projectIndex].status,
                state.availableProjects[projectIndex].progress,
                state.availableProjects[projectIndex].total_tasks,
                state.availableProjects[projectIndex].project_users
            )
            updateAvailableProject = [...state.availableProjects]
            updateAvailableProject[projectIndex] = updatedProject
            return {
                ...state,
                availableProjects: updateAvailableProject,
                onGoing: state.onGoing,
                completed: state.completed
            };

        case CHANGE_DESCRIPTION:
            projectIndex = state.availableProjects.findIndex(
                proj => proj.id === action.pid
            );
            updatedProject = new Project(
                action.pid,
                state.availableProjects[projectIndex].name,
                action.description,
                state.availableProjects[projectIndex].created_at,
                state.availableProjects[projectIndex].end_date,
                state.availableProjects[projectIndex].created_by,
                state.availableProjects[projectIndex].ownerid,
                state.availableProjects[projectIndex].status,
                state.availableProjects[projectIndex].progress,
                state.availableProjects[projectIndex].total_tasks,
                state.availableProjects[projectIndex].project_users
            )
            updateAvailableProject = [...state.availableProjects]
            updateAvailableProject[projectIndex] = updatedProject
            return {
                ...state,
                availableProjects: updateAvailableProject,
                onGoing: state.onGoing,
                completed: state.completed
            };

        case DELETE_PROJECT:
            return {
                ...state,
                availableProjects: state.availableProjects.filter(
                    project => project.id != action.pid
                ),
                onGoing: state.onGoing - 1,
                completed: state.completed
            };

        case CHANGE_PROJECT_PROGRESS:
            projectIndex = state.availableProjects.findIndex(
                proj => proj.id === action.pid
            );
            updatedProject = new Project(
                action.pid,
                state.availableProjects[projectIndex].name,
                state.availableProjects[projectIndex].description,
                state.availableProjects[projectIndex].created_at,
                state.availableProjects[projectIndex].end_date,
                state.availableProjects[projectIndex].created_by,
                state.availableProjects[projectIndex].ownerid,
                state.availableProjects[projectIndex].status,
                action.progress,
                state.availableProjects[projectIndex].total_tasks,
                state.availableProjects[projectIndex].project_users
            )
            updateAvailableProject = [...state.availableProjects]
            updateAvailableProject[projectIndex] = updatedProject
            return {
                ...state,
                availableProjects: updateAvailableProject,
                onGoing: state.onGoing,
                completed: state.completed
            };

        default:
            return state;
    }

};