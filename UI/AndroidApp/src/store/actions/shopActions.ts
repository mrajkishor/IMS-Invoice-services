export const FETCH_SHOPS_REQUEST = 'FETCH_SHOPS_REQUEST';
export const FETCH_SHOPS_SUCCESS = 'FETCH_SHOPS_SUCCESS';
export const FETCH_SHOPS_FAILURE = 'FETCH_SHOPS_FAILURE';

export const CREATE_SHOP_REQUEST = 'CREATE_SHOP_REQUEST';
export const CREATE_SHOP_SUCCESS = 'CREATE_SHOP_SUCCESS';
export const CREATE_SHOP_FAILURE = 'CREATE_SHOP_FAILURE';

export const fetchShopsRequest = (userId: string) => ({
    type: FETCH_SHOPS_REQUEST,
    payload: userId,
});

export const fetchShopsSuccess = (shops: any[]) => ({
    type: FETCH_SHOPS_SUCCESS,
    payload: shops,
});

export const fetchShopsFailure = (error: string) => ({
    type: FETCH_SHOPS_FAILURE,
    payload: error,
});

export const createShopRequest = (shop: any) => ({
    type: CREATE_SHOP_REQUEST,
    payload: shop,
});

export const createShopSuccess = (shop: any) => ({
    type: CREATE_SHOP_SUCCESS,
    payload: shop,
});

export const createShopFailure = (error: string) => ({
    type: CREATE_SHOP_FAILURE,
    payload: error,
});
