
import React, { useState, useEffect } from 'react'
import { Provider } from 'react-redux'
import Main from './pages/_main'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { initStore } from '@shared/redux/store'
import { NavigationContainer } from '@react-navigation/native'
import { loadAsync } from 'expo-font';
import { navigationRef } from './pages/_navigation'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.store = initStore()
        this.state = {
            fontIsLoaded: false
        }
        this.setFontIsLoaded = (data) => this.setState(state => ({...state, fontIsLoaded: data}))

    }


    //const { Component, pageProps, store } = this.props
    //const [isAuthenticated, setIsAuthenticated] = useState(false)
    componentDidMount = () => {
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
            this.setFontIsLoaded(true)
        })
    }
    static getDerivedStateFromError(error) {   
         // Atualiza o state para que a próxima renderização mostre a UI alternativa.   
    }
    
    componentDidCatch(error, errorInfo) {    
        // Você também pode registrar o erro em um serviço de relatórios de erro    
        //logErrorToMyService(error, errorInfo);  
    }
    render() {
        return (
            <Provider store={this.store}>
                <PersistGate persistor={persistStore(this.store)}>
                    {this.state.fontIsLoaded ? (
                        <NavigationContainer ref={navigationRef}>
                            <Main/>
                        </NavigationContainer>
                    ) : null}
                </PersistGate>
            </Provider>
        )
    }
}

export default App