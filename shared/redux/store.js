import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducers';
import { persistReducer } from 'redux-persist'
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1'
//import hardSet from 'redux-persist/lib/stateReconciler/hardSet'


let storage = null
if (process.env['APP'] === 'web' || typeof document !== 'undefined') {
    storage = require('redux-persist/lib/storage').default
} else {
    storage = require('react-native').AsyncStorage
}


export const initStore = (initialState = {}) => {
    const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
    const enhancer = composeEnhancers(
        applyMiddleware(thunk),
    )

    const persistedReducer = persistReducer({
        key: 'primary',
        stateReconciler: autoMergeLevel1,
        storage: storage,
        whitelist: ['login']
    }, reducer)

    const store = createStore(persistedReducer, initialState, enhancer)
    return store;
};