// userSaga.ts

import { call, put, takeEvery, all } from 'redux-saga/effects';
import {
    FETCH_USER_REQUEST,
    fetchUserSuccess,
    fetchUserFailure,
    UPDATE_USER_REQUEST,
    updateUserSuccess,
    updateUserFailure,
    DELETE_USER_REQUEST,
    deleteUserSuccess,
    deleteUserFailure,
} from '../actions/userActions';
import api from '../../services/api';

function* handleFetchUser(action: any): Generator<any, void, any> {
    try {
        const response = yield call(api.get, `/users/${action.payload}`);
        yield put(fetchUserSuccess(response.data));
    } catch (error) {
        if (error instanceof Error) {
            yield put(fetchUserFailure(error.message));
        } else {
            yield put(fetchUserFailure('An unknown error occurred'));
        }
    }
}

function* handleUpdateUser(action: any): Generator<any, void, any> {
    try {
        const { userId, userDetails } = action.payload;
        const response = yield call(api.put, `/users/${userId}`, userDetails);
        yield put(updateUserSuccess(response.data));
    } catch (error) {
        if (error instanceof Error) {
            yield put(updateUserFailure(error.message));
        } else {
            yield put(updateUserFailure('An unknown error occurred'));
        }
    }
}

function* handleDeleteUser(action: any): Generator<any, void, any> {
    try {
        yield call(api.delete, `/users/${action.payload}`);
        yield put(deleteUserSuccess());
    } catch (error) {
        if (error instanceof Error) {
            yield put(deleteUserFailure(error.message));
        } else {
            yield put(deleteUserFailure('An unknown error occurred'));
        }
    }
}

function* watchFetchUser() {
    yield takeEvery(FETCH_USER_REQUEST, handleFetchUser);
}

function* watchUpdateUser() {
    yield takeEvery(UPDATE_USER_REQUEST, handleUpdateUser);
}

function* watchDeleteUser() {
    yield takeEvery(DELETE_USER_REQUEST, handleDeleteUser);
}

export default function* userSaga() {
    yield all([
        watchFetchUser(),
        watchUpdateUser(),
        watchDeleteUser(),
    ]);
}
