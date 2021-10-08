import React from 'react'
import { View } from 'react-native'
import axios from 'axios'
import actions from '../../redux/actions'
import AutomationCreationForm from './AutomationCreationForm'
import dynamicImport from '../../utils/dynamicImport'
import Styled from './styles'

const connect = dynamicImport('reduxConnect', 'default')

/**
 * This is responsible for handling the automation part in reflow
 * Automtions in reflow is like a low code but a low code that we do for you instead of you
 * doing everythig by yourself.
 * 
 * @param {Type} props - {go in detail about every prop it recieves}
 */
class Automation extends React.Component {
    constructor(props) {
        super(props)
        this.source = null
        this.state = {
            automationCreationIsOpen: false,
            isEditing: false,
            isDevelopingApp: false,
            showAppDetailFromAppId: null
        }
    }

    /**
     * Opens the automation creation formulary so users can create their own automations.
     * 
     * @param {Boolean} isOpen - Opens the the automation creation formulary.
     */
    setAutomationCreationIsOpen = (isOpen) => {
        this.setState(state => ({
            ...state,
            automationCreationIsOpen: isOpen
        }))
    }

    /**
     * Retrieve the app data by it's id, this is used when the user selects an app in the automation showroom, will probably
     * be deprecated in the near future.
     * 
     * @param {BigInt} appId - An automation app instance id. This is the app selected by the user.
     * 
     * @returns {Object} - Returns the object data of this app, cointaining stuff like the name, the description and all of it's triggers and actions.
     */
    getAppDataByAppId = (appId) => {
        const availableApps = this.props.automation.availableApps
        for(let i =0; i< availableApps.length; i++) {
            if (availableApps[i].id === appId) {
                return availableApps[i]
            }
        }
        return {}
    }

    componentDidMount = () => {
        this.source = axios.CancelToken.source()
        this.props.onGetAutomationApps(this.source)
    }

    componentWillUnmount = () => {
        if (this.source) {
            this.source.cancel()
        }
    }

    renderMobile = () => {
        return (
            <View></View>
        )
    }

    renderWeb = () => {
        return (
            <div>
                <Styled.AutomationCreationModal isOpen={this.state.automationCreationIsOpen}>
                    <AutomationCreationForm 
                    types={this.props.types}
                    onGetInputFormulary={this.props.onGetInputFormulary}
                    availableApps={this.props.automation.availableApps}
                    setAutomationCreationIsOpen={this.setAutomationCreationIsOpen}
                    />
                </Styled.AutomationCreationModal>
                <div>
                    <h2>{'Automações'}</h2>
                    {this.props.automation.availableApps.map(app => (
                        <Styled.AppButton 
                        key={app.id}
                        onClick={(e) => this.setAutomationCreationIsOpen(true)}
                        >
                            {app.name}
                        </Styled.AppButton>
                    ))}
                </div>
            </div>
        )
    }

    render = () => {
        return process.env['APP'] === 'web' ? this.renderWeb() : this.renderMobile()
    }
}

export default connect(state => ({ automation: state.home.automation, types: state.login.types }), actions)(Automation)