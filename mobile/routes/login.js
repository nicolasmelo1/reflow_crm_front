import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from '../pages/login'
import ChangePasswordPage from '../pages/changepassword'
import OnboardingPage from '../pages/onboarding'


const LoginRoutes = (props) => {
    const Stack = createStackNavigator()

    

    return (
        <Stack.Navigator>
            <Stack.Screen name={'login'} component={LoginPage} options={{headerShown: false, title: 'Login'}}/>
            <Stack.Screen name={'changepassword'} component={ChangePasswordPage} options={{headerShown: false}}/>
            <Stack.Screen name={'onboarding'} component={OnboardingPage} options={{headerTintColor: '#0dbf7e',  title: 'Onboarding'}}/>
        </Stack.Navigator>
    )
}

export default LoginRoutes