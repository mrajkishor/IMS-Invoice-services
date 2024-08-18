// userActions.ts

export const FETCH_USER_REQUEST = 'FETCH_USER_REQUEST';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';

export const UPDATE_USER_REQUEST = 'UPDATE_USER_REQUEST';
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';
export const UPDATE_USER_FAILURE = 'UPDATE_USER_FAILURE';

export const DELETE_USER_REQUEST = 'DELETE_USER_REQUEST';
export const DELETE_USER_SUCCESS = 'DELETE_USER_SUCCESS';
export const DELETE_USER_FAILURE = 'DELETE_USER_FAILURE';

export const fetchUserRequest = (userId: string) => ({
    type: FETCH_USER_REQUEST,
    payload: userId,
});

export const fetchUserSuccess = (user: any) => ({
    type: FETCH_USER_SUCCESS,
    payload: user,
});

export const fetchUserFailure = (error: string) => ({
    type: FETCH_USER_FAILURE,
    payload: error,
});

export const updateUserRequest = (userId: string, userDetails: any) => ({
    type: UPDATE_USER_REQUEST,
    payload: { userId, userDetails },
});

export const updateUserSuccess = (user: any) => ({
    type: UPDATE_USER_SUCCESS,
    payload: user,
});

export const updateUserFailure = (error: string) => ({
    type: UPDATE_USER_FAILURE,
    payload: error,
});

export const deleteUserRequest = (userId: string) => ({
    type: DELETE_USER_REQUEST,
    payload: userId,
});

export const deleteUserSuccess = () => ({
    type: DELETE_USER_SUCCESS,
});

export const deleteUserFailure = (error: string) => ({
    type: DELETE_USER_FAILURE,
    payload: error,
});
