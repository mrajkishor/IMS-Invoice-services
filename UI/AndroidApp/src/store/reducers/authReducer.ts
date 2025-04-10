import { AuthState } from '@store/types';
import {
    LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE,
    LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_FAILURE,
    REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAILURE,
    VALIDATE_TOKEN_FAILURE, VALIDATE_TOKEN_REQUEST, VALIDATE_TOKEN_SUCCESS
} from '../actions/authActions';

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
        case REGISTER_REQUEST:
        case VALIDATE_TOKEN_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case VALIDATE_TOKEN_SUCCESS:
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: action.payload,
            };
        case VALIDATE_TOKEN_FAILURE:
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                error: action.payload,
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
        case REGISTER_SUCCESS:
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                user: action.payload,
            };
        case LOGIN_FAILURE:
        case REGISTER_FAILURE:
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
        case LOGOUT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default authReducer;
