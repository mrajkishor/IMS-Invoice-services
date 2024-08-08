// userReducer.ts

import {
    FETCH_USER_REQUEST,
    FETCH_USER_SUCCESS,
    FETCH_USER_FAILURE,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAILURE,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,
    DELETE_USER_FAILURE,
} from '../actions/userActions';

interface UserState {
    loading: boolean;
    user: any | null;
    error: string | null;
}

const initialState: UserState = {
    loading: false,
    user: null,
    error: null,
};

const userReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case FETCH_USER_REQUEST:
        case UPDATE_USER_REQUEST:
        case DELETE_USER_REQUEST:
            return { ...state, loading: true };
        case FETCH_USER_SUCCESS:
        case UPDATE_USER_SUCCESS:
            return { ...state, loading: false, user: action.payload, error: null };
        case FETCH_USER_FAILURE:
        case UPDATE_USER_FAILURE:
        case DELETE_USER_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case DELETE_USER_SUCCESS:
            return { ...state, loading: false, user: null, error: null };
        default:
            return state;
    }
};

export default userReducer;
