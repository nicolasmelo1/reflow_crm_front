import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducers';
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import('redux-persist/lib/storage').then(storage => {

})
//import { AsyncStorage } from 'react-native'
console.log(storage)

export const initStore = (initialState = {}) => {
    const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
    const enhancer = composeEnhancers(
        applyMiddleware(thunk),
    )
    const persistedReducer = persistReducer({
        key: 'primary',
        storage: storage,
        whitelist: ['login']
    }, reducer)

    const store = createStore(persistedReducer, initialState, enhancer)
    return store;
};