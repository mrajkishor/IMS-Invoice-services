import { all, call, put, takeEvery } from 'redux-saga/effects';
import { FETCH_SHOPS_REQUEST, fetchShopsSuccess, fetchShopsFailure, CREATE_SHOP_REQUEST, createShopSuccess, createShopFailure } from '../actions/shopActions';
import api from '../../services/api';

function* handleFetchShops(action: any): Generator<any, void, any> {
    try {
        const response = yield call(api.get, `/users/${action.payload}/shops`);
        yield put(fetchShopsSuccess(response.data));
    } catch (error) {
        if (error instanceof Error) {
            yield put(fetchShopsFailure(error.message));
        } else {
            yield put(fetchShopsFailure('An unknown error occurred'));
        }
    }
}

function* handleCreateShop(action: any): Generator<any, void, any> {
    try {
        const response = yield call(api.post, '/shops', action.payload);
        yield put(createShopSuccess(response.data));
    } catch (error) {
        if (error instanceof Error) {
            yield put(createShopFailure(error.message));
        } else {
            yield put(createShopFailure('An unknown error occurred'));
        }
    }
}

function* watchFetchShops() {
    yield takeEvery(FETCH_SHOPS_REQUEST, handleFetchShops);
}

function* watchCreateShop() {
    yield takeEvery(CREATE_SHOP_REQUEST, handleCreateShop);
}

export default function* shopSaga() {
    yield all([
        watchFetchShops(),
        watchCreateShop(),
    ]);
}
