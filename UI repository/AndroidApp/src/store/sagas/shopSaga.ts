import { call, put, takeEvery, all } from 'redux-saga/effects';
import {
    FETCH_SHOP_REQUEST, fetchShopSuccess, fetchShopFailure,
    UPDATE_SHOP_REQUEST, updateShopSuccess, updateShopFailure,
    DELETE_SHOP_REQUEST, deleteShopSuccess, deleteShopFailure,
    FETCH_SHOPS_REQUEST, fetchShopsSuccess, fetchShopsFailure
} from '../actions/shopActions';
import api from '../../services/api';

function* handleFetchShop(action: any): Generator<any, void, any> {
    try {
        const response = yield call(api.get, `/shops/${action.payload}`);
        yield put(fetchShopSuccess(response.data));
    } catch (error) {
        if (error instanceof Error) {
            yield put(fetchShopFailure(error.message));
        } else {
            yield put(fetchShopFailure('An unknown error occurred'));
        }
    }
}

function* handleUpdateShop(action: any): Generator<any, void, any> {
    try {
        const { shopId, shop } = action.payload;
        const response = yield call(api.put, `/shops/${shopId}`, shop);
        yield put(updateShopSuccess(response.data));
    } catch (error) {
        if (error instanceof Error) {
            yield put(updateShopFailure(error.message));
        } else {
            yield put(updateShopFailure('An unknown error occurred'));
        }
    }
}

function* handleDeleteShop(action: any): Generator<any, void, any> {
    try {
        yield call(api.delete, `/shops/${action.payload}`);
        yield put(deleteShopSuccess(action.payload));
    } catch (error) {
        if (error instanceof Error) {
            yield put(deleteShopFailure(error.message));
        } else {
            yield put(deleteShopFailure('An unknown error occurred'));
        }
    }
}

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

function* watchFetchShop() {
    yield takeEvery(FETCH_SHOP_REQUEST, handleFetchShop);
}

function* watchUpdateShop() {
    yield takeEvery(UPDATE_SHOP_REQUEST, handleUpdateShop);
}

function* watchDeleteShop() {
    yield takeEvery(DELETE_SHOP_REQUEST, handleDeleteShop);
}

function* watchFetchShops() {
    yield takeEvery(FETCH_SHOPS_REQUEST, handleFetchShops);
}

export default function* shopSaga() {
    yield all([
        watchFetchShop(),
        watchUpdateShop(),
        watchDeleteShop(),
        watchFetchShops(),
    ]);
}
