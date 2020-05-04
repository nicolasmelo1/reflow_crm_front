import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from '../pages/login'

const LoginRoutes = (props) => {
    const Stack = createStackNavigator()
    return (
        <Stack.Navigator>
            <Stack.Screen name={'Login'} component={LoginPage} options={{headerShown: false}}/>
        </Stack.Navigator>
    )
}

export default LoginRoutes