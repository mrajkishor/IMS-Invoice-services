import { call, put, takeEvery, CallEffect, PutEffect } from 'redux-saga/effects';
import {
    LOGIN_REQUEST,
    loginSuccess,
    loginFailure,
    LoginRequestAction,
} from '../actions/authActions';
import { login } from '../../services/authService';

// Define the types for the generator function
function* handleLogin(
    action: LoginRequestAction
): Generator<CallEffect | PutEffect<any>, void, any> {
    try {
        const user = yield call(login, action.payload.email, action.payload.password);
        yield put(loginSuccess(user));
    } catch (error) {
        if (error instanceof Error) {
            yield put(loginFailure(error.message));
        } else {
            // Handle unexpected errors that are not instances of Error
            yield put(loginFailure('An unknown error occurred'));
        }
    }
}

function* watchAuth(): Generator<ReturnType<typeof takeEvery>, void, unknown> {
    yield takeEvery(LOGIN_REQUEST, handleLogin);
}

export default watchAuth;
