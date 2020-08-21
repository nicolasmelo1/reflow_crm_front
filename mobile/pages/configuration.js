import React from 'react'
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import { Layout } from '@shared/components'
import { withAuthenticationContext } from '../contexts'
import { Linking } from 'expo'
import { paths } from '@shared/utils/constants'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
class ConfigurationPage extends React.Component {
    constructor(props) {
        super(props)
    }

    render = () => {
        return (
            <Layout setIsAuthenticated={this.props.authenticationContext.setIsAuthenticated}>
                <SafeAreaView>
                    <TouchableOpacity 
                    style={{ width: '100%', textAlign:'center', backgroundColor:'#0dbf7e', padding: 10}} 
                    onPress={e => this.props.navigation.navigate('users')}
                    >
                        <Text>
                            Usuários
                        </Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </Layout>
        )
    }
}

export default withAuthenticationContext(ConfigurationPage)