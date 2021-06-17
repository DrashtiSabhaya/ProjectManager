import { AUTHENTICATE, LOGOUT } from "../actions/auth";

const initialState = {
    access_token: null,
    refresh_token: null,
    user_id: null,
    username: null,
    name: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case AUTHENTICATE:
            return {
                access_token: action.access_token,
                refresh_token: action.refresh_token,
                user_id: action.user_id,
                username: action.username,
                name: action.name
            }
        case LOGOUT:
            return initialState;
        default:
            return state;
    }
};