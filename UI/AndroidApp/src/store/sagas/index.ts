import { all } from 'redux-saga/effects';
import authSaga from './authSaga';
import invoiceSaga from './invoiceSaga';

export default function* rootSaga() {
    yield all([authSaga(), invoiceSaga()]);
}