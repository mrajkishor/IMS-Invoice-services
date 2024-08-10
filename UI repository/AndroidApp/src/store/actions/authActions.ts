// Action Types
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';
export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';

// Action Creators
export const loginRequest = (email: string, password: string) => ({
    type: LOGIN_REQUEST,
    payload: { email, password },
});

export const loginSuccess = (token: string, refreshToken: string, user: any) => ({
    type: LOGIN_SUCCESS,
    payload: { token, refreshToken, user },
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

export const logoutFailure = (message: string) => ({
    type: LOGOUT_FAILURE,
});




export const registerRequest = (email: string, username: string, password: string) => ({
    type: REGISTER_REQUEST,
    payload: { email, username, password },
});

export const registerSuccess = (user: any) => ({
    type: REGISTER_SUCCESS,
    payload: user,
});

export const registerFailure = (error: string) => ({
    type: REGISTER_FAILURE,
    payload: error,
});



export interface RegisterRequestAction {
    type: typeof REGISTER_REQUEST;
    payload: {
        email: string;
        username: string;
        password: string;
    };
}

export interface RegisterSuccessAction {
    type: typeof REGISTER_SUCCESS;
    payload: any;
}

export interface RegisterFailureAction {
    type: typeof REGISTER_FAILURE;
    payload: string;
}



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

export interface LogoutFailureAction {
    type: typeof LOGOUT_FAILURE;
}

export type AuthActionTypes =
    | LoginRequestAction
    | LoginSuccessAction
    | LoginFailureAction
    | LogoutRequestAction
    | LogoutSuccessAction
    | LogoutFailureAction
    | RegisterRequestAction
    | RegisterSuccessAction
    | RegisterFailureAction;
