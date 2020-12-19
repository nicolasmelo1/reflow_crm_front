import React, { useEffect } from 'react'
import Layout from '@shared/components/Layout'
import { Button, Modal, View, SafeAreaView, TouchableOpacity, Text } from 'react-native'
import { connect } from 'react-redux'
import actions from '@shared/redux/actions'
import { withAuthenticationContext, withHomeToolsMenuContext } from '../contexts'
import Dashboard from '@shared/components/Dashboard'
import { paths } from '@shared/utils/constants'

import * as Linking from 'expo-linking'

class Data extends React.Component {
    constructor (props) {
        super(props)
        this.unsubscribeFocus = null
    }
    
    componentDidMount = () => {
        this.unsubscribeFocus = this.props.navigation.addListener('focus', () => {
            this.props.onChangeNavbarIsInHomeScreen(true)
        })
        this.unsubscribeBlur = this.props.navigation.addListener('blur', () => {
            this.props.onChangeNavbarIsInHomeScreen(false)
            //this.props.
        })
    }

    componentWillUnmount = () => {
        this.unsubscribeFocus()
        this.unsubscribeBlur()
        this.props.homeToolsMenuContext.setIsHomeToolsMenuOpen(false)
    }

    render() {
        return (
            <Layout setIsAuthenticated={this.props.authenticationContext.setIsAuthenticated} showSideBar={true}>
                {this.props.homeToolsMenuContext.isHomeToolsMenuOpen ? (
                    <Modal animationType="slide">
                        <SafeAreaView>
                            <Button onPress={(e) => {
                                this.props.homeToolsMenuContext.setIsHomeToolsMenuOpen(false)
                            }} title={'Fechar'}/>
                            <TouchableOpacity onPress={(e) => {
                                this.props.homeToolsMenuContext.setIsHomeToolsMenuOpen(false)
                                this.props.navigation.navigate('pdf_generator')
                            }}>
                                <Text>
                                    PDF
                                </Text>
                            </TouchableOpacity>
                        </SafeAreaView>
                    </Modal>
                ) : (
                    <View style={{ width: '100%'}}>
                        <Button onPress={e=> {
                            this.props.onDeauthenticate().then(_ => {
                                this.props.authenticationContext.setIsAuthenticated(false)
                            })
                        }} title={'Logout'}/>
                        <Dashboard 
                        formName={'comercial123'}
                        />
                    </View>
                )}
            </Layout>
        )     
    }
}

export default connect(state => ({}), actions)(
    withHomeToolsMenuContext(
        withAuthenticationContext(Data)
    )
)