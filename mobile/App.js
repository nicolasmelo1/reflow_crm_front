
import React, { useState, useEffect } from 'react'
import { Provider } from 'react-redux'
import Main from './pages/_main'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { initStore } from '@shared/redux/store'
import { NavigationContainer } from '@react-navigation/native'
import { loadAsync } from 'expo-font';

const App = (props) => {
    //const { Component, pageProps, store } = this.props
    const store = initStore()
    //const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [fontIsLoaded, setFontIsLoaded] = useState(false)

    useEffect(() => {
        loadAsync({
            'Roboto-Black': require('./assets/font/Roboto-Black.ttf'),
            'Roboto-BlackItalic': require('./assets/font/Roboto-BlackItalic.ttf'),
            'Roboto-Bold': require('./assets/font/Roboto-Bold.ttf'),
            'Roboto-BoldItalic': require('./assets/font/Roboto-BoldItalic.ttf'),
            'Roboto-Italic': require('./assets/font/Roboto-Italic.ttf'),
            'Roboto-Light': require('./assets/font/Roboto-Light.ttf'),
            'Roboto-LightItalic': require('./assets/font/Roboto-LightItalic.ttf'),
            'Roboto-Medium': require('./assets/font/Roboto-Medium.ttf'),
            'Roboto-MediumItalic': require('./assets/font/Roboto-MediumItalic.ttf'),
            'Roboto-Regular': require('./assets/font/Roboto-Regular.ttf'),
            'Roboto-Thin': require('./assets/font/Roboto-Thin.ttf'),
            'Roboto-ThinItalic': require('./assets/font/Roboto-ThinItalic.ttf'),
        }).then(success=> {
            setFontIsLoaded(true)
        })
    }, [])

    return (
        <Provider store={store}>
            <PersistGate persistor={persistStore(store)}>
                {fontIsLoaded ? (
                    <NavigationContainer>
                        <Main/>
                    </NavigationContainer>
                ) : null}
            </PersistGate>
        </Provider>
    )
}


export default App