import { call, put, takeEvery, CallEffect, PutEffect } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    LOGIN_REQUEST,
    loginSuccess,
    loginFailure,
    LoginRequestAction,
    LOGOUT_REQUEST,
    logoutSuccess,
} from '../actions/authActions';
import { login } from '../../services/authService';
import { jwtDecode } from 'jwt-decode';


interface JwtPayload {
    sub: string; // Subject, typically the user ID
    exp: number; // Expiration time
    // Add other fields if needed
}
// Define the types for the generator function
function* handleLogin(
    action: LoginRequestAction
): Generator<CallEffect | PutEffect<any>, void, any> {
    try {
        const { user, token, refreshToken } = yield call(login, action.payload.email, action.payload.password);

        // Save tokens in AsyncStorage
        yield call(AsyncStorage.setItem, 'accessToken', token);
        yield call(AsyncStorage.setItem, 'refreshToken', refreshToken);

        // Decode the token to get the user ID
        const decoded: JwtPayload = jwtDecode(token);
        const userId = decoded.sub;
        yield call(AsyncStorage.setItem, 'userId', userId);

        yield put(loginSuccess(token, refreshToken, { userId }));
    } catch (error) {
        if (error instanceof Error) {
            yield put(loginFailure(error.message));
        } else {
            // Handle unexpected errors that are not instances of Error
            yield put(loginFailure('An unknown error occurred: authSaga.ts'));
        }
    }
}

function* handleLogout() {
    try {
        yield call(AsyncStorage.removeItem, 'accessToken');
        yield call(AsyncStorage.removeItem, 'refreshToken');
        yield put(logoutSuccess());
    } catch (error) {
        console.error('Logout error:', error);
    }
}

function* watchAuth(): Generator<ReturnType<typeof takeEvery>, void, unknown> {
    yield takeEvery(LOGIN_REQUEST, handleLogin);
    yield takeEvery(LOGOUT_REQUEST, handleLogout);
}

export default watchAuth;
