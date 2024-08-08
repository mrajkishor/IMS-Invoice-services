import { combineReducers } from 'redux';
import authReducer from './authReducer';
import shopReducer from './shopReducer';
import invoiceReducer from './invoiceReducer';
import userReducer from './userReducer';


const rootReducer = combineReducers({
    auth: authReducer,
    shops: shopReducer,
    invoices: invoiceReducer,
    users: userReducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
