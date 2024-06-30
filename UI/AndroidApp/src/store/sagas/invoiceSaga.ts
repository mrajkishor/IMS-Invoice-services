import { call, put, takeEvery } from 'redux-saga/effects';
import { FETCH_INVOICES_REQUEST, fetchInvoicesSuccess, fetchInvoicesFailure } from '../actions/invoiceActions';
import { fetchInvoices } from '../../services/invoiceService';

function* handleFetchInvoices(action: any): Generator<any, void, any> {
    try {
        const invoices = yield call(fetchInvoices, action.payload);
        yield put(fetchInvoicesSuccess(invoices));
    } catch (error) {
        if (error instanceof Error) {
            yield put(fetchInvoicesFailure(error.message));
        } else {
            yield put(fetchInvoicesFailure('An unknown error occurred'));
        }
    }
}

function* watchFetchInvoices() {
    yield takeEvery(FETCH_INVOICES_REQUEST, handleFetchInvoices);
}

export default watchFetchInvoices;
