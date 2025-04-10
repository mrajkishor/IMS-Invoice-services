import {
    FETCH_INVOICES_REQUEST, FETCH_INVOICES_SUCCESS, FETCH_INVOICES_FAILURE, CREATE_INVOICE_REQUEST,
    CREATE_INVOICE_SUCCESS,
    CREATE_INVOICE_FAILURE,
    FETCH_INVOICE_BY_ID_REQUEST,
    FETCH_INVOICE_BY_ID_SUCCESS,
    FETCH_INVOICE_BY_ID_FAILURE,
    UPDATE_INVOICE_REQUEST,
    UPDATE_INVOICE_SUCCESS,
    UPDATE_INVOICE_FAILURE,
    DELETE_INVOICE_REQUEST,
    DELETE_INVOICE_SUCCESS,
    DELETE_INVOICE_FAILURE,
    CANCEL_INVOICE_REQUEST,
    CANCEL_INVOICE_SUCCESS,
    CANCEL_INVOICE_FAILURE,
    MARK_INVOICE_AS_PAID_REQUEST,
    MARK_INVOICE_AS_PAID_SUCCESS,
    MARK_INVOICE_AS_PAID_FAILURE,
} from '../actions/invoiceActions';

const initialState = {
    loading: false,
    invoices: [],
    invoice: null,
    error: null,
};

const invoiceReducer = (state = initialState, action: any) => {
    switch (action.type) {
        // Common loading state for all requests
        case FETCH_INVOICE_BY_ID_REQUEST:
        case FETCH_INVOICES_REQUEST:
        case CREATE_INVOICE_REQUEST:
        case UPDATE_INVOICE_REQUEST:
        case DELETE_INVOICE_REQUEST:
        case CANCEL_INVOICE_REQUEST:
        case MARK_INVOICE_AS_PAID_REQUEST:
            return { ...state, loading: true, error: null };


        // Fetch multiple invoices
        case FETCH_INVOICES_SUCCESS:
            return { ...state, loading: false, invoices: action.payload };


        // Create a new invoice
        case CREATE_INVOICE_SUCCESS:
            return {
                ...state,
                loading: false,
                invoices: [...state.invoices, action.invoice],
            };

        // Fetch a specific invoice by ID
        case FETCH_INVOICE_BY_ID_SUCCESS:
            return { ...state, loading: false, invoice: action.payload };

        // Update an invoice
        case UPDATE_INVOICE_SUCCESS:
            return {
                ...state,
                loading: false,
                invoices: state.invoices.map((inv) =>
                    inv.invoiceId === action.payload.invoiceId ? action.payload : inv
                ),
            };
        // Delete an invoice
        case DELETE_INVOICE_SUCCESS:
            return {
                ...state,
                loading: false,
                invoices: state.invoices.filter(
                    (inv) => inv.invoiceId !== action.payload // Remove the deleted invoice
                ),
            };
        // Cancel an invoice
        case CANCEL_INVOICE_SUCCESS:
            return {
                ...state,
                loading: false,
                invoices: state.invoices.map((inv) =>
                    inv.invoiceId === action.payload
                        ? { ...inv, status: 'Cancelled' } // Update the status to 'Cancelled'
                        : inv
                ),
            };

        // Mark an invoice as Paid
        case MARK_INVOICE_AS_PAID_SUCCESS:
            return {
                ...state,
                loading: false,
                invoices: state.invoices.map((inv) =>
                    inv.invoiceId === action.payload
                        ? { ...inv, status: 'Paid' }
                        : inv
                ),
            };

        // Handle errors for all failure cases
        case FETCH_INVOICES_FAILURE:
        case CREATE_INVOICE_FAILURE:
        case FETCH_INVOICE_BY_ID_FAILURE:
        case UPDATE_INVOICE_FAILURE:
        case DELETE_INVOICE_FAILURE:
        case CANCEL_INVOICE_FAILURE:
        case MARK_INVOICE_AS_PAID_FAILURE:
            return { ...state, loading: false, error: action.payload };

        // Default case to return state
        default:
            return state;
    }
};

export default invoiceReducer;
