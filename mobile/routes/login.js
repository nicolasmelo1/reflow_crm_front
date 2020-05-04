import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from '../pages/login'

const LoginRoutes = (props) => {
    const Stack = createStackNavigator()
    console.log(props.setIsAuthenticated)
    return (
        <Stack.Navigator>
            <Stack.Screen name={'Login'} component={LoginPage}/>
        </Stack.Navigator>
    )
}

export default LoginRoutes