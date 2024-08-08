import { all, call, put, takeEvery } from 'redux-saga/effects';
import { FETCH_INVOICES_REQUEST, fetchInvoicesSuccess, fetchInvoicesFailure, CREATE_INVOICE_REQUEST } from '../actions/invoiceActions';
import { fetchInvoices } from '../../services/invoiceService';
import { createInvoiceSuccess, createInvoiceFailure } from '../actions/invoiceActions';
import api from '../../services/api';

function* createInvoice(action: any): any {
    try {
        const response = yield call(api.post, '/invoices', action.payload);
        yield put(createInvoiceSuccess(response.data));
    } catch (error) {
        if (error instanceof Error) {
            yield put(createInvoiceFailure(error.message));;
        } else {
            yield put(createInvoiceFailure('An unknown error occurred'));
        }
    }
}


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

function* watchCreateInvoice() {
    yield takeEvery(CREATE_INVOICE_REQUEST, createInvoice);
}

function* watchFetchInvoices() {
    yield takeEvery(FETCH_INVOICES_REQUEST, handleFetchInvoices);
}

export default function* invoiceSaga() {
    yield all([
        watchCreateInvoice(),
        watchFetchInvoices()
    ]);
}
