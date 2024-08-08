export const FETCH_SHOPS_REQUEST = 'FETCH_SHOPS_REQUEST';
export const FETCH_SHOPS_SUCCESS = 'FETCH_SHOPS_SUCCESS';
export const FETCH_SHOPS_FAILURE = 'FETCH_SHOPS_FAILURE';

export const FETCH_SHOP_REQUEST = 'FETCH_SHOP_REQUEST';
export const FETCH_SHOP_SUCCESS = 'FETCH_SHOP_SUCCESS';
export const FETCH_SHOP_FAILURE = 'FETCH_SHOP_FAILURE';

export const CREATE_SHOP_REQUEST = 'CREATE_SHOP_REQUEST';
export const CREATE_SHOP_SUCCESS = 'CREATE_SHOP_SUCCESS';
export const CREATE_SHOP_FAILURE = 'CREATE_SHOP_FAILURE';

export const UPDATE_SHOP_REQUEST = 'UPDATE_SHOP_REQUEST';
export const UPDATE_SHOP_SUCCESS = 'UPDATE_SHOP_SUCCESS';
export const UPDATE_SHOP_FAILURE = 'UPDATE_SHOP_FAILURE';

export const DELETE_SHOP_REQUEST = 'DELETE_SHOP_REQUEST';
export const DELETE_SHOP_SUCCESS = 'DELETE_SHOP_SUCCESS';
export const DELETE_SHOP_FAILURE = 'DELETE_SHOP_FAILURE';


export const fetchShopRequest = (shopId: string) => ({
    type: FETCH_SHOP_REQUEST,
    payload: shopId,
});

export const fetchShopSuccess = (shop: any) => ({
    type: FETCH_SHOP_SUCCESS,
    payload: shop,
});

export const fetchShopFailure = (error: any) => ({
    type: FETCH_SHOP_FAILURE,
    payload: error,
});

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


export const updateShopRequest = (shopId: string, shop: any) => ({
    type: UPDATE_SHOP_REQUEST,
    payload: { shopId, shop },
});

export const updateShopSuccess = (shop: any) => ({
    type: UPDATE_SHOP_SUCCESS,
    payload: shop,
});

export const updateShopFailure = (error: any) => ({
    type: UPDATE_SHOP_FAILURE,
    payload: error,
});

export const deleteShopRequest = (shopId: string) => ({
    type: DELETE_SHOP_REQUEST,
    payload: shopId,
});

export const deleteShopSuccess = (shopId: string) => ({
    type: DELETE_SHOP_SUCCESS,
    payload: shopId,
});

export const deleteShopFailure = (error: any) => ({
    type: DELETE_SHOP_FAILURE,
    payload: error,
});
