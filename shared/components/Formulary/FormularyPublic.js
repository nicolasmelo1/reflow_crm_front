import React from 'react'
import { View } from 'react-native'
import axios from 'axios'
import { connect } from 'react-redux'
import actions from '../../redux/actions'
import agent from '../../utils/agent'
import { strings } from '../../utils/constants'
import dynamicImport from '../../utils/dynamicImport'
import { Formulary, Error404 } from '../'
import { Formularies } from '../../styles/Formulary'

const Spinner = dynamicImport('react-bootstrap', 'Spinner')

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
class FormularyPublic extends React.Component {
    constructor(props) {
        super(props)
        this.cancelToken = axios.CancelToken
        this.source = null
        this.state = {
            isLoading: true,
            hasSubmittedForm: false,
            formLabelName: '',
            isToShowSubmitAnotherResponseButton: false,
            greetingsMessage: null,
            description: null
        }
    }
    // ------------------------------------------------------------------------------------------
    setHasSubmittedForm = (hasSubmittedForm) => {
        this.setState(state => ({
            ...state,
            hasSubmittedForm: hasSubmittedForm
        }))
    }
    // ------------------------------------------------------------------------------------------
    setIsLoading = (isLoading) => {
        this.setState(state => ({
            ...state,
            isLoading: isLoading
        }))
    }
    // ------------------------------------------------------------------------------------------
    setOptionsForPublicFormulary = (formLabelName, isToShowSubmitAnotherResponseButton, greetingsMessage, description) => {
        this.setState(state => ({
            ...state,
            formLabelName: formLabelName,
            isToShowSubmitAnotherResponseButton: isToShowSubmitAnotherResponseButton,
            greetingsMessage: greetingsMessage,
            description: description
        }))
    }
    // ------------------------------------------------------------------------------------------
    /**
     * When the user saves the formulary we show the user a message thanking for filling the formulary.
     */
    onSaveFormulary = () => {
        this.setHasSubmittedForm(true)
    }
    // ------------------------------------------------------------------------------------------
    /////////////////////////////////////////////////////////////////////////////////////////////
    componentDidMount = () => {
        this.source = this.cancelToken.source()
        agent.http.FORMULARY.getPublicFormularyData(this.source, this.props.formName).then(response => {
            if (response && response.status === 200) {
                this.setOptionsForPublicFormulary(
                    response.data.data.form_label_name,
                    response.data.data.is_to_submit_another_response_button,
                    response.data.data.greetings_message,
                    response.data.data.description_message,
                )
            }
            this.setIsLoading(false)
        })
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    componentWillUnmount = () => {
        if (this.source) {
            this.source.cancel()
        }
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    //########################################################################################//
    renderMobile = () => {
        return (
            <View></View>
        )
    }
    //########################################################################################//
    renderWeb = () => {
        return (
            <div>
                 {this.state.isLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                        <Spinner animation={'border'} style={{color: '#0dbf7e'}}/>
                    </div>
                ) : this.state.formLabelName === '' ? (
                    <Error404/>
                ) : this.state.hasSubmittedForm ? (
                        <Formularies.Public.GreetingsContainer>
                            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
                                <Formularies.Public.Title>
                                    {strings['pt-br']['formularyPublicGreetingsMessageTitle']}
                                </Formularies.Public.Title>
                                <Formularies.Public.Description>
                                    {this.state.greetingsMessage !== null ? this.state.greetingsMessage : ''}
                                </Formularies.Public.Description>
                                {this.state.isToShowSubmitAnotherResponseButton ? (
                                    <Formularies.Public.SubmitAnotherResponseButton 
                                    onClick={(e) => this.setHasSubmittedForm(false)}
                                    >
                                        {strings['pt-br']['formularyPublicGreetingsSubmitAnotherButton']}
                                    </Formularies.Public.SubmitAnotherResponseButton>
                                ) : ''}
                            </div>
                        </Formularies.Public.GreetingsContainer>
                ) : (
                    <Formularies.Public.Container>
                        <Formularies.Public.Description>
                            {this.state.description !== null ? this.state.description : ''}
                        </Formularies.Public.Description>
                        <Formulary 
                        display={'standalone'}
                        type='embbed'
                        onSaveFormulary={this.onSaveFormulary}
                        formName={this.props.formName} 
                        />
                    </Formularies.Public.Container>
                )}
            </div>
        )
    }
    //########################################################################################//
    render = () => {
        return process.env['APP'] === 'web' ? this.renderWeb() : this.renderMobile()
    }
}

export default FormularyPublic