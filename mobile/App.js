
import React from 'react'
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { initStore } from '@shared/redux/store';
import  Layout from '@shared/components/Layout'


const App = (props) => {
    //const { Component, pageProps, store } = this.props
    const store = initStore()
    return (
        <Provider store={store}>
            <PersistGate persistor={persistStore(store)}>
                <Layout/>
            </PersistGate>
        </Provider>
    )
}


export default App
