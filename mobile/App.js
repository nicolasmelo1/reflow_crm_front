
import React, { useState, useEffect } from 'react'
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { initStore } from '@shared/redux/store'
import { NavigationContainer } from '@react-navigation/native'
import { AsyncStorage, Platform, Vibration, View, Text } from 'react-native'
import { Notifications } from 'expo'
import { loadAsync } from 'expo-font';
import { getAsync, NOTIFICATIONS } from 'expo-permissions'
import Constants from 'expo-constants';
import { LoginRoutes, MainRoutes } from './routes'


const App = (props) => {
    //const { Component, pageProps, store } = this.props
    const store = initStore()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [fontIsLoaded, setFontIsLoaded] = useState(false)

    registerForPushNotificationsAsync = async () => {
        const { status: existingStatus } = await getAsync(NOTIFICATIONS)
        let finalStatus = existingStatus
        if (existingStatus !== 'granted') {
            const { status } = await askAsync(NOTIFICATIONS)
            finalStatus = status
        }
        if (finalStatus !== 'granted') {
            if (__DEV__) {
                console.log('Failed to get push token for push notification!')
            }
            return
        }
    
        if (Platform.OS === 'android') {
            Notifications.createChannelAndroidAsync('default', {
                name: 'default',
                sound: true,
                priority: 'max',
                vibrate: [0, 250, 250, 250],
            })
        }
        Notifications.getExpoPushTokenAsync().then(token => {
            if (token) {
            }
        }).catch(() => {})
    }
    
    const handleNotification = notification => {
        Vibration.vibrate()
    }
    
    const getComponent = () => {
        if (isAuthenticated) {
            return <LoginRoutes setIsAuthenticated={setIsAuthenticated}/>
        } else {
            return <MainRoutes setIsAuthenticated={setIsAuthenticated}/>
        }
    }
    
    AsyncStorage.getItem('token').then(token=> {
        if (token === '') {
            setIsAuthenticated(false)
        } else {
            setIsAuthenticated(true)
            if (Constants.isDevice) {
                registerForPushNotificationsAsync()
                Notifications.addListener(handleNotification);
            }
        }
    })

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
            {fontIsLoaded ? (
                <NavigationContainer>
                    {getComponent()}
                </NavigationContainer>
            ) : null}    
        </Provider>
    )
}


export default App