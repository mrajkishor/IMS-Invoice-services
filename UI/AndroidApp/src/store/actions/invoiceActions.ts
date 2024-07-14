export const FETCH_INVOICES_REQUEST = 'FETCH_INVOICES_REQUEST';
export const FETCH_INVOICES_SUCCESS = 'FETCH_INVOICES_SUCCESS';
export const FETCH_INVOICES_FAILURE = 'FETCH_INVOICES_FAILURE';


export const CREATE_INVOICE_REQUEST = 'CREATE_INVOICE_REQUEST';
export const CREATE_INVOICE_SUCCESS = 'CREATE_INVOICE_SUCCESS';
export const CREATE_INVOICE_FAILURE = 'CREATE_INVOICE_FAILURE';

export const fetchInvoicesRequest = (shopId: string) => ({
    type: FETCH_INVOICES_REQUEST,
    payload: shopId,
});

export const fetchInvoicesSuccess = (invoices: any[]) => ({
    type: FETCH_INVOICES_SUCCESS,
    payload: invoices,
});

export const fetchInvoicesFailure = (error: string) => ({
    type: FETCH_INVOICES_FAILURE,
    payload: error,
});



export const createInvoiceRequest = (payload: any) => ({
    type: CREATE_INVOICE_REQUEST,
    payload,
});

export const createInvoiceSuccess = (invoice: any) => ({
    type: CREATE_INVOICE_SUCCESS,
    invoice,
});

export const createInvoiceFailure = (error: any) => ({
    type: CREATE_INVOICE_FAILURE,
    error,
});
