import {
    FETCH_SHOPS_REQUEST,
    FETCH_SHOPS_SUCCESS,
    FETCH_SHOPS_FAILURE,
    CREATE_SHOP_REQUEST,
    CREATE_SHOP_SUCCESS,
    CREATE_SHOP_FAILURE,
} from '../actions/shopActions';

const initialState = {
    loading: false,
    shops: [],
    error: null,
};

const shopReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case FETCH_SHOPS_REQUEST:
        case CREATE_SHOP_REQUEST:
            return { ...state, loading: true, error: null };
        case FETCH_SHOPS_SUCCESS:
            return { ...state, loading: false, shops: action.payload };
        case FETCH_SHOPS_FAILURE:
        case CREATE_SHOP_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case CREATE_SHOP_SUCCESS:
            return { ...state, loading: false, shops: [...state.shops, action.payload] };
        default:
            return state;
    }
};

export default shopReducer;
