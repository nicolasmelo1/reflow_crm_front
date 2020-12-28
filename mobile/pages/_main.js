import React, { useState } from 'react'
import { AuthenticationContext } from '../contexts'
import { askAsync, getAsync, NOTIFICATIONS } from 'expo-permissions'
import Constants from 'expo-constants'
import { AsyncStorage, Platform, Vibration, StatusBar } from 'react-native'
import * as Notifications from 'expo-notifications'
import { handleNavigation } from './_navigation.js'
import * as Linking from 'expo-linking'
import { LoginRoutes, MainRoutes } from '../routes'
import { useEffect } from 'react'


const Main = (props) => {
    const [isAuthenticated, _setIsAuthenticated] = useState(false)
    const isAuthenticatedRef = React.useRef(false)

    const setIsAuthenticated = data => {
        isAuthenticatedRef.current = data
        _setIsAuthenticated(data)
    }

    const registerForPushNotificationsAsync = async () => {
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
        if (notification !== null) {
            Vibration.vibrate()
        }
    }
    
    const getComponent = () => {
        if (!isAuthenticated) {
            return <LoginRoutes />
        } else {
            return <MainRoutes/>
        }
    }
    
    AsyncStorage.getItem('token').then(token=> {
        if (!token || token === '') {
            setIsAuthenticated(false)
        } else {
            setIsAuthenticated(true)
            if (Constants.isDevice) {
                registerForPushNotificationsAsync()
                Notifications.setNotificationHandler(handleNotification);
            }
        }
    })

    useEffect(() => {
        Linking.addEventListener('url', (e) => {
            handleNavigation(e.url, isAuthenticatedRef.current)
        })
        Linking.getInitialURL().then(response => {
            handleNavigation(response, isAuthenticatedRef.current)
        })
        return () => {
            Linking.removeEventListener('url')
        }
    }, [])
    
    return (
        <AuthenticationContext.Provider value={{
            isAuthenticated: isAuthenticated,
            setIsAuthenticated: setIsAuthenticated
        }}>
            <StatusBar
            barStyle={'dark-content'}
            />
            {getComponent()}
        </AuthenticationContext.Provider>
    )
}

export default Main
