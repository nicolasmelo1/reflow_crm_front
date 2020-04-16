
import React from 'react'
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { initStore } from '@shared/redux/store';
import { Text, View } from 'react-native'


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
