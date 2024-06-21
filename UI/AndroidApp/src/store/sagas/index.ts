import { all } from 'redux-saga/effects';
import watchAuth from './authSaga';
// Import other sagas here

export default function* rootSaga() {
    yield all([
        watchAuth(),
        // Add other sagas here
    ]);
}
