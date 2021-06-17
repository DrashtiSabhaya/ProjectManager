import { PROJECT_USER } from '../actions/shareProject';

const initialState = {
    projectUsers: [],
};

export default (state = initialState, action) => {

    switch (action.type) {
        case PROJECT_USER:
            return {
                projectUsers: action.projectUsers,
            };

        default:
            return state;
    }

};