// Action Types
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

// Action Creators
export const loginRequest = (email: string, password: string) => ({
    type: LOGIN_REQUEST,
    payload: { email, password },
});

export const loginSuccess = (user: any) => ({
    type: LOGIN_SUCCESS,
    payload: { user },
});

export const loginFailure = (error: string) => ({
    type: LOGIN_FAILURE,
    payload: error,
});

export const logoutRequest = () => ({
    type: LOGOUT_REQUEST,
});

export const logoutSuccess = () => ({
    type: LOGOUT_SUCCESS,
});

// Define and export action types
export interface LoginRequestAction {
    type: typeof LOGIN_REQUEST;
    payload: {
        email: string;
        password: string;
    };
}

export interface LoginSuccessAction {
    type: typeof LOGIN_SUCCESS;
    payload: any;
}

export interface LoginFailureAction {
    type: typeof LOGIN_FAILURE;
    payload: string;
}

export interface LogoutRequestAction {
    type: typeof LOGOUT_REQUEST;
}
export interface LogoutSuccessAction {
    type: typeof LOGOUT_SUCCESS;
}

export type AuthActionTypes =
    | LoginRequestAction
    | LoginSuccessAction
    | LoginFailureAction
    | LogoutRequestAction
    | LogoutSuccessAction;
