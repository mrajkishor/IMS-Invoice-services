import { combineReducers } from 'redux';
import authReducer from './authReducer';
import shopReducer from './shopReducer';
import invoiceReducer from './invoiceReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    shops: shopReducer,
    invoices: invoiceReducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
