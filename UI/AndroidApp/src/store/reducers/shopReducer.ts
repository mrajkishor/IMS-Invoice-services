import {
    FETCH_SHOPS_REQUEST,
    FETCH_SHOPS_SUCCESS,
    FETCH_SHOPS_FAILURE,
    FETCH_SHOP_REQUEST,
    FETCH_SHOP_SUCCESS,
    FETCH_SHOP_FAILURE,
    CREATE_SHOP_REQUEST,
    CREATE_SHOP_SUCCESS,
    CREATE_SHOP_FAILURE,
    UPDATE_SHOP_REQUEST,
    UPDATE_SHOP_SUCCESS,
    UPDATE_SHOP_FAILURE,
    DELETE_SHOP_REQUEST,
    DELETE_SHOP_SUCCESS,
    DELETE_SHOP_FAILURE,
} from '../actions/shopActions';
interface ShopState {
    loading: boolean;
    shops: any[];
    shop: any | null;
    error: any;
}
const initialState: ShopState = {
    loading: false,
    shops: [],
    shop: null,
    error: null,
};

const shopReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case FETCH_SHOP_REQUEST:
        case FETCH_SHOP_SUCCESS:
            return {
                ...state,
                loading: false,
                shop: action.payload,
                error: null,
            };
        case FETCH_SHOP_FAILURE:
        case FETCH_SHOPS_REQUEST:
        case UPDATE_SHOP_REQUEST:
        case DELETE_SHOP_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case CREATE_SHOP_REQUEST:
            return { ...state, loading: true, error: null };
        case FETCH_SHOPS_SUCCESS:
            return { ...state, loading: false, shops: action.payload };
        case FETCH_SHOPS_FAILURE:
        case CREATE_SHOP_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case CREATE_SHOP_SUCCESS:
            return { ...state, loading: false, shops: [...state.shops, action.payload] };
        case UPDATE_SHOP_SUCCESS:
            return {
                ...state,
                loading: false,
                shop: action.payload,
                error: null,
            };
        case DELETE_SHOP_SUCCESS:
            return {
                ...state,
                loading: false,
                shop: null,
                error: null,
            };
        case UPDATE_SHOP_FAILURE:
        case DELETE_SHOP_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default shopReducer;
