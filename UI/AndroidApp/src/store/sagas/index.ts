import { all } from 'redux-saga/effects';
import authSaga from './authSaga';
import shopSaga from './shopSaga';
import invoiceSaga from './invoiceSaga';
import userSaga from './userSaga';

export default function* rootSaga() {
    yield all([authSaga(), shopSaga(), invoiceSaga(), userSaga()]);
}