import { AuthState } from '../types';
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_REQUEST, LOGOUT_SUCCESS } from '../actions/authActions';

const initialState: AuthState = {
    isAuthenticated: false,
    loading: false,
    error: null,
    user: null,
    token: null,
    refreshToken: null,
};

const authReducer = (state = initialState, action: any): AuthState => {
    switch (action.type) {
        case LOGIN_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token,
                refreshToken: action.payload.refreshToken,
            };
        case LOGIN_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case LOGOUT_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case LOGOUT_SUCCESS:
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                user: null,
                token: null,
                refreshToken: null,
            };
        default:
            return state;
    }
};

export default authReducer;
