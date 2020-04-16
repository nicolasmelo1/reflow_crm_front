
import React from 'react'
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import reducer from '@shared/redux/reducers';
import { AsyncStorage } from 'react-native'
import { Text, View } from 'react-native'

const initStore = (initialState = {}) => {
    const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
    const enhancer = composeEnhancers(
        applyMiddleware(thunk),
    )
    const persistedReducer = persistReducer({
        key: 'primary',
        storage: AsyncStorage,
        whitelist: ['login']
    }, reducer)

    const store = createStore(persistedReducer, initialState, enhancer)
    return store
}


const App = (props) => {
    //const { Component, pageProps, store } = this.props
    const store = initStore()
    return (
        <Provider store={store}>
            <PersistGate persistor={persistStore(store)}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                    <Text>teste</Text>
                </View>
            </PersistGate>
        </Provider>
    )
    
}


export default App
