import { SET_USERS } from '../actions/user';

const initialState = {
    usersData: [],
};

export default (state = initialState, action) => {

    switch (action.type) {
        case SET_USERS:
            return {
                usersData: action.users,
            };

        default:
            return state;
    }

};