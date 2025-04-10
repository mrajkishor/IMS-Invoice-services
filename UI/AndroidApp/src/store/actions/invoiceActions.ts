export const FETCH_INVOICES_REQUEST = 'FETCH_INVOICES_REQUEST';
export const FETCH_INVOICES_SUCCESS = 'FETCH_INVOICES_SUCCESS';
export const FETCH_INVOICES_FAILURE = 'FETCH_INVOICES_FAILURE';

export const FETCH_INVOICE_BY_ID_REQUEST = 'FETCH_INVOICE_BY_ID_REQUEST';
export const FETCH_INVOICE_BY_ID_SUCCESS = 'FETCH_INVOICE_BY_ID_SUCCESS';
export const FETCH_INVOICE_BY_ID_FAILURE = 'FETCH_INVOICE_BY_ID_FAILURE';


export const CREATE_INVOICE_REQUEST = 'CREATE_INVOICE_REQUEST';
export const CREATE_INVOICE_SUCCESS = 'CREATE_INVOICE_SUCCESS';
export const CREATE_INVOICE_FAILURE = 'CREATE_INVOICE_FAILURE';

export const UPDATE_INVOICE_REQUEST = 'UPDATE_INVOICE_REQUEST';
export const UPDATE_INVOICE_SUCCESS = 'UPDATE_INVOICE_SUCCESS';
export const UPDATE_INVOICE_FAILURE = 'UPDATE_INVOICE_FAILURE';


export const DELETE_INVOICE_REQUEST = 'DELETE_INVOICE_REQUEST';
export const DELETE_INVOICE_SUCCESS = 'DELETE_INVOICE_SUCCESS';
export const DELETE_INVOICE_FAILURE = 'DELETE_INVOICE_FAILURE';

export const CANCEL_INVOICE_REQUEST = 'CANCEL_INVOICE_REQUEST';
export const CANCEL_INVOICE_SUCCESS = 'CANCEL_INVOICE_SUCCESS';
export const CANCEL_INVOICE_FAILURE = 'CANCEL_INVOICE_FAILURE';

export const MARK_INVOICE_AS_PAID_REQUEST = 'MARK_INVOICE_AS_PAID_REQUEST';
export const MARK_INVOICE_AS_PAID_SUCCESS = 'MARK_INVOICE_AS_PAID_SUCCESS';
export const MARK_INVOICE_AS_PAID_FAILURE = 'MARK_INVOICE_AS_PAID_FAILURE';



//fetch all invoices for a shop
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



// Fetch a specific invoice by ID
export const fetchInvoiceByIdRequest = (invoiceId: string) => ({
    type: FETCH_INVOICE_BY_ID_REQUEST,
    payload: invoiceId,
});

export const fetchInvoiceByIdSuccess = (invoice: any) => ({
    type: FETCH_INVOICE_BY_ID_SUCCESS,
    payload: invoice,
});

export const fetchInvoiceByIdFailure = (error: string) => ({
    type: FETCH_INVOICE_BY_ID_FAILURE,
    payload: error,
});


// Create a new invoice
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

// update invoice details
export const updateInvoiceRequest = (invoiceId: string, invoiceData: any) => ({
    type: UPDATE_INVOICE_REQUEST,
    payload: { invoiceId, invoiceData },
});

export const updateInvoiceSuccess = (invoice: any) => ({
    type: UPDATE_INVOICE_SUCCESS,
    payload: invoice,
});

export const updateInvoiceFailure = (error: string) => ({
    type: UPDATE_INVOICE_FAILURE,
    payload: error,
});


// Delete an invoice
export const deleteInvoiceRequest = (invoiceId: string, remarks: string) => ({
    type: DELETE_INVOICE_REQUEST,
    payload: { invoiceId, remarks },
});

export const deleteInvoiceSuccess = (invoiceId: string) => ({
    type: DELETE_INVOICE_SUCCESS,
    payload: invoiceId,
});

export const deleteInvoiceFailure = (error: string) => ({
    type: DELETE_INVOICE_FAILURE,
    payload: error,
});

// Cancel an invoice
export const cancelInvoiceRequest = (invoiceId: string, remarks: string) => ({
    type: CANCEL_INVOICE_REQUEST,
    payload: { invoiceId, remarks },
});

export const cancelInvoiceSuccess = (invoiceId: string) => ({
    type: CANCEL_INVOICE_SUCCESS,
    payload: invoiceId,
});

export const cancelInvoiceFailure = (error: string) => ({
    type: CANCEL_INVOICE_FAILURE,
    payload: error,
});

// Mark an invoice as Paid
export const markInvoiceAsPaidRequest = (invoiceId: string) => ({
    type: MARK_INVOICE_AS_PAID_REQUEST,
    payload: invoiceId,
});

export const markInvoiceAsPaidSuccess = (invoiceId: string) => ({
    type: MARK_INVOICE_AS_PAID_SUCCESS,
    payload: invoiceId,
});

export const markInvoiceAsPaidFailure = (error: string) => ({
    type: MARK_INVOICE_AS_PAID_FAILURE,
    payload: error,
});
