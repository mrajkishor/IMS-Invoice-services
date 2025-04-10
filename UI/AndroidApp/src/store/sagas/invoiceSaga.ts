import { all, call, put, takeEvery } from 'redux-saga/effects';
import {
    createInvoiceSuccess, createInvoiceFailure,
    FETCH_INVOICES_REQUEST, fetchInvoicesSuccess, fetchInvoicesFailure, CREATE_INVOICE_REQUEST, fetchInvoiceByIdSuccess, fetchInvoiceByIdFailure, FETCH_INVOICE_BY_ID_REQUEST, UPDATE_INVOICE_REQUEST,
    updateInvoiceSuccess,
    updateInvoiceFailure,
    DELETE_INVOICE_REQUEST,
    deleteInvoiceSuccess,
    deleteInvoiceFailure,
    CANCEL_INVOICE_REQUEST,
    cancelInvoiceSuccess,
    cancelInvoiceFailure,
    MARK_INVOICE_AS_PAID_REQUEST,
    markInvoiceAsPaidSuccess,
    markInvoiceAsPaidFailure,
} from '../actions/invoiceActions';
import { fetchInvoices } from '../../services/invoiceService';
import api from '../../services/api';

function* createInvoice(action: any): any {
    try {
        console.log('Creating invoice with payload:', action.payload);
        const response = yield call(api.post, '/invoices', action.payload);
        console.log('Invoice created successfully:', response.data);
        yield put(createInvoiceSuccess(response.data));
    } catch (error) {
        console.error('Error creating invoice:', error);
        if (error instanceof Error) {
            yield put(createInvoiceFailure(error.message));
        } else {
            yield put(createInvoiceFailure('An unknown error occurred'));
        }
    }
}
function* updateInvoice(action: any): Generator<any, void, any> {
    try {
        const response = yield call(api.put, `/invoices/${action.payload.invoiceId}`, action.payload.invoiceData);
        yield put(updateInvoiceSuccess(response.data)); // Ensure updated data is dispatched
    } catch (error) {
        if (error instanceof Error) {
            yield put(updateInvoiceFailure(error.message));
        } else {
            yield put(updateInvoiceFailure('An unknown error occurred'));
        }
    }
}

// Delete an invoice
function* deleteInvoice(action: any): Generator<any, void, any> {
    try {
        console.log('Deleting invoice with ID:', action.payload.invoiceId);
        yield call(api.delete, `/invoices/${action.payload.invoiceId}`, {
            data: { remarks: action.payload.remarks },
        });
        yield put(deleteInvoiceSuccess(action.payload.invoiceId));
    } catch (error) {
        console.error('Error deleting invoice:', error);
        if (error instanceof Error) {
            yield put(deleteInvoiceFailure(error.message));
        } else {
            yield put(deleteInvoiceFailure('An unknown error occurred'));
        }
    }
}

// Cancel an invoice
function* cancelInvoice(action: any): Generator<any, void, any> {
    try {
        console.log('Cancelling invoice with ID:', action.payload.invoiceId);
        const response = yield call(api.post, `/invoices/${action.payload.invoiceId}/cancel`, {
            remarks: action.payload.remarks,
        });
        yield put(cancelInvoiceSuccess(action.payload.invoiceId));
    } catch (error) {
        console.error('Error cancelling invoice:', error);
        if (error instanceof Error) {
            yield put(cancelInvoiceFailure(error.message));
        } else {
            yield put(cancelInvoiceFailure('An unknown error occurred'));
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

function* fetchInvoiceById(action: any): Generator<any, void, any> {
    try {
        const response = yield call(api.get, `/invoices/${action.payload}`);
        yield put(fetchInvoiceByIdSuccess(response.data)); // Dispatch fetched invoice
    } catch (error) {
        console.error('Error fetching invoice by ID:', error);
        if (error instanceof Error) {
            yield put(fetchInvoiceByIdFailure(error.message));
        } else {
            yield put(fetchInvoiceByIdFailure('An unknown error occurred'));
        }
    }
}


function* markInvoiceAsPaid(action: any): Generator<any, void, any> {
    try {
        console.log('Marking invoice as Paid with ID:', action.payload.invoiceId);

        // Correct API call with the invoice ID from payload
        const response = yield call(api.post, `/invoices/${action.payload.invoiceId}/markPaid`);

        // Dispatch success action and pass the updated data if needed
        yield put(markInvoiceAsPaidSuccess(action.payload.invoiceId));
        console.log('Invoice marked as Paid successfully:', response.data);

    } catch (error: any) {
        console.error('Error marking invoice as Paid:', error);

        // Dispatch failure action with a proper error message
        const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred';
        yield put(markInvoiceAsPaidFailure(errorMessage));
    }
}



// Watchers
function* watchCreateInvoice() {
    yield takeEvery(CREATE_INVOICE_REQUEST, createInvoice);
}

function* watchFetchInvoices() {
    yield takeEvery(FETCH_INVOICES_REQUEST, handleFetchInvoices);
}

function* watchFetchInvoiceById() {
    yield takeEvery(FETCH_INVOICE_BY_ID_REQUEST, fetchInvoiceById);
}

function* watchUpdateInvoice() {
    yield takeEvery(UPDATE_INVOICE_REQUEST, updateInvoice);
}

function* watchDeleteInvoice() {
    yield takeEvery(DELETE_INVOICE_REQUEST, deleteInvoice);
}

function* watchCancelInvoice() {
    yield takeEvery(CANCEL_INVOICE_REQUEST, cancelInvoice);
}

function* watchMarkInvoiceAsPaid() {
    yield takeEvery(MARK_INVOICE_AS_PAID_REQUEST, markInvoiceAsPaid);
}

export default function* invoiceSaga() {
    yield all([
        watchCreateInvoice(),
        watchFetchInvoices(),
        watchFetchInvoiceById(),
        watchUpdateInvoice(),
        watchDeleteInvoice(),
        watchCancelInvoice(),
        watchMarkInvoiceAsPaid()
    ]);
}
