import { call, put, takeEvery, CallEffect, PutEffect, fork, delay, ForkEffect } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    LOGIN_REQUEST,
    loginSuccess,
    loginFailure,
    LoginRequestAction,
    LOGOUT_REQUEST,
    logoutSuccess,
    logoutFailure,
    RegisterRequestAction,
    registerSuccess,
    registerFailure,
    REGISTER_REQUEST,
    loginRequest,
    logoutRequest,
    VALIDATE_TOKEN_REQUEST,
    validateTokenFailure,
    validateTokenSuccess
} from '../actions/authActions';
import { login, register, refreshTokenService } from '../../services/authService';
import { jwtDecode } from 'jwt-decode';
import api from '../../services/api';


interface JwtPayload {
    sub: string; // Subject, typically the user ID
    exp: number; // Expiration time
    // Add other fields if needed
}
// Define the types for the generator function
function* handleLogin(
    action: LoginRequestAction
): Generator<CallEffect | PutEffect<any> | ForkEffect<void>, void, any> {
    try {
        const { user, token, refreshToken } = yield call(login, action.payload.identifier, action.payload.password);

        // Save tokens in AsyncStorage
        yield call(AsyncStorage.setItem, 'accessToken', token);
        yield call(AsyncStorage.setItem, 'refreshToken', refreshToken);

        // Decode the token to get the user ID
        const decoded: JwtPayload = jwtDecode(token);
        const userId = decoded.sub;

        yield call(AsyncStorage.setItem, 'userId', userId);

        // Dispatch login success
        yield put(loginSuccess(token, refreshToken, { userId }));

        // Start the token refresh task
        yield fork(startTokenRefreshTask, decoded.exp, refreshToken);
    } catch (error) {
        if (error instanceof Error) {
            // yield put(loginFailure(error.message)); // this msg should n't be printed to UI. Send it as Log instead.
            yield put(loginFailure('We are getting error with this username / password.'));
        } else {
            // Handle unexpected errors that are not instances of Error
            yield put(loginFailure('An unknown error occurred: authSaga.ts'));
        }
    }
}

// Handle registration
function* handleRegister(
    action: RegisterRequestAction
): Generator<CallEffect | PutEffect<any>, void, any> {
    try {
        const user = yield call(register, action.payload.email, action.payload.username, action.payload.password);

        yield put(registerSuccess(user));


        // Auto-login the user after successful registration
        yield put(loginRequest(action.payload.email, action.payload.password));
    } catch (error) {
        if (error instanceof Error) {
            yield put(registerFailure(error.message));
        } else {
            yield put(registerFailure('An unknown error occurred: authSaga.ts'));
        }
    }
}


// Handle logout
function* handleLogout(): Generator<CallEffect | PutEffect<any>, void, any> {
    try {
        yield call(AsyncStorage.removeItem, 'accessToken');
        yield call(AsyncStorage.removeItem, 'refreshToken');
        yield call(AsyncStorage.removeItem, 'userId');
        yield put(logoutSuccess());
    } catch (error) {
        if (error instanceof Error) {
            yield put(logoutFailure(error.message));
        } else {
            yield put(logoutFailure('An unknown error occurred: authSaga.ts'));
        }
    }
}


// Token refresh task
function* startTokenRefreshTask(exp: number, refreshToken: string): Generator<CallEffect | PutEffect<any> | ForkEffect<void>, void, any> {
    try {
        // Calculate the delay until token expiration, minus a buffer (e.g., 5 minutes)
        const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
        const delayTime = exp * 1000 - Date.now() - bufferTime;

        // Wait until the token is close to expiring
        if (delayTime > 0) {
            yield delay(delayTime);
        }

        // Call the refresh token service
        const { token: newToken, refreshToken: newRefreshToken } = yield call(refreshTokenService, refreshToken);

        // Validate new tokens
        if (!newToken || !newRefreshToken) {
            console.error('Failed to get valid tokens from API');
            yield put(logoutRequest());
            return;
        }

        // Save the new tokens
        yield call(AsyncStorage.setItem, 'accessToken', newToken);
        yield call(AsyncStorage.setItem, 'refreshToken', newRefreshToken);

        // Decode the new token to get the new expiration time
        const decoded: JwtPayload = jwtDecode(newToken);

        // Restart the token refresh task with the new expiration time
        yield fork(startTokenRefreshTask, decoded.exp, newRefreshToken);

        yield put(loginSuccess(newToken, newRefreshToken, { userId: decoded.sub }));

    } catch (error) {
        console.error('Failed to refresh token:', error);

        // Optionally, log out the user if refreshing fails
        yield put(logoutRequest());
    }
}

function* handleValidateToken(action: any): Generator<CallEffect | PutEffect<any>, void, any> {
    try {
        const { token } = action.payload;

        // Call validateToken endpoint
        const response = yield call(api.post, '/auth/validate', {}, { headers: { Authorization: `Bearer ${token}` } });
        const userId = response.data.userId;

        // Dispatch success action
        yield put(validateTokenSuccess({ userId }));

        // Save user info to AsyncStorage if needed
        yield call(AsyncStorage.setItem, 'userId', userId);
    } catch (error) {
        // Dispatch failure action
        yield put(validateTokenFailure('Invalid or expired token.'));
        yield call(AsyncStorage.removeItem, 'accessToken');
    }
}

function* watchValidateToken(): Generator<ReturnType<typeof takeEvery>, void, unknown> {
    yield takeEvery(VALIDATE_TOKEN_REQUEST, handleValidateToken);
}



function* watchAuth(): Generator<ReturnType<typeof takeEvery>, void, unknown> {
    yield takeEvery(LOGIN_REQUEST, handleLogin);
    yield takeEvery(REGISTER_REQUEST, handleRegister);
    yield takeEvery(LOGOUT_REQUEST, handleLogout);
    yield takeEvery(VALIDATE_TOKEN_REQUEST, handleValidateToken);
}

export default watchAuth;
