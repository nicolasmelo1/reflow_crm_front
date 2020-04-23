import React from 'react'
import axios from 'axios'
import { Row, Col, Spinner } from 'react-bootstrap'
import { connect } from 'react-redux'

import FormularySections from './FormularySections'
import FormularySectionsEdit from './FormularySectionsEdit'
import actions from '../../redux/actions'
import { strings } from '../../utils/constants'
import { Formularies } from '../../styles/Formulary'

/**
 * You might want to read the README to understand how this and all of it's components work.
 * */
class Formulary extends React.Component {
    constructor(props) {
        super(props)
        this.CancelToken = axios.CancelToken
        this.source = null
        this.height = document.body.clientHeight
        this.state = {
            markToUpdate: false,
            isEditing: false,
            errors: {},
            isLoading: false,
            isLoadingEditing: false,
            isSubmitting: false,
            auxOriginalInitial: {}
        }
    }
    
    setMarkToUpdate = (data) => {
        this.setState(state => {
            return {
                ...state,
                markToUpdate: data
            }
        })
    }

    setIsSubmitting = (data) => {
        this.setState(state => {
            return {
                ...state,
                isSubmitting: data
            }
        })
    }

    setIsLoading = (data) => {
        if (this._ismounted) {
            this.setState(state => {
                return {
                    ...state,
                    isLoading: data
                }
            })
        }
    } 

    setIsOpen = () => {
        // when user closes we reset the states on the formulary
        this.props.onOpenOrCloseFormulary(!this.props.formulary.isOpen)
        this.setMarkToUpdate(true)
    }

    setAuxOriginalInitial = () => {
        if (this._ismounted) {
            this.setState(state => {
                return {
                    ...state,
                    auxOriginalInitial: {
                        buildData: {...this.props.formulary.buildData},
                        filled: {...this.props.formulary.filled},
                    } 
                }
            })
        }
    }

    setIsEditing = () => {
        if (!this.state.isEditing) {
            this.source = this.CancelToken.source()
            this.props.onGetFormularySettings(this.source, this.props.formulary.buildData.id)
        } else {
            this.props.setFormularySettingsHasBeenUpdated()
            this.buildFormulary(this.props.router.form, this.props.formularyId)
        }
        this.setState(state => {
            return {
                ...state,
                isEditing: !state.isEditing
            }
        })
    }

    setData = (sectionsData) => {
        let data = {
            depends_on_dynamic_form: sectionsData
        }
        if (this.props.formulary.filled.data.id) data.id = this.props.formulary.filled.data.id
        this.props.onChangeFormularyDataState(data)
    }

    setErrors = (errors) => {
        this.setState(state => {
            return {
                ...state,
                errors: errors
            }
        })
    }

    onSubmit = () => {
        this.setIsSubmitting(true)
        let response = null
        if (this.props.formulary.filled.data.id) {
            response = this.props.onUpdateFormularyData(this.props.formulary.filled.data, this.props.formulary.filled.files, this.props.formulary.buildData.form_name, this.props.formulary.filled.data.id)
        } else {
            response = this.props.onCreateFormularyData(this.props.formulary.filled.data, this.props.formulary.filled.files,this.props.formulary.buildData.form_name)
        }
        
        if (response) {
            response.then(response=> {
                this.setIsSubmitting(false)
                if (response.status !== 200) {
                    this.setErrors(response.data.error)
                } else if (this.props.formulary.buildData.form_name !== this.props.router.form) {
                    this.props.onFullResetFormularyState(this.state.auxOriginalInitial.filled.data, this.state.auxOriginalInitial.filled.files, this.state.auxOriginalInitial.buildData)
                } else {
                    this.props.setFormularyHasBeenUpdated()
                    this.setIsOpen()
                }
            })
        }
    }

    buildFormulary = (formName, formId=null) => {
        this.setIsLoading(true)
        this.source = this.CancelToken.source()
        this.props.onGetBuildFormulary(this.source, formName).then(_ => {
            this.setIsLoading(false)
        })
        if (formId) {
            this.props.onGetFormularyData(this.source, formName, formId)
        } 
    }

    getFormularyButtonTitle = () => {
        if (this.state.isLoading){
            return strings['pt-br']['formularyLoadingButtonLabel']
        } else if (this.props.formulary.isOpen) {
            const formName = (this.props.formulary.buildData && this.props.formulary.buildData.label_name) ? this.props.formulary.buildData.label_name : ''
            return 'Fechar ' + formName 
        } else {
            return strings['pt-br']['formularyOpenButtonLabel']
        }
    }


    /**
     * When the user clicks "add new" or "edit" on the connection field, a new form is loaded in this component without losing 
     * the data of the previous form component loaded
     */
    onChangeFormulary = (formName, formId=null) => { 
        this.setAuxOriginalInitial()
        this.props.onFullResetFormularyState()
        this.buildFormulary(formName, formId)
    }

    componentDidMount = () => {
        this._ismounted = true
        this.buildFormulary(this.props.router.form, this.props.formularyId)
    }


    componentWillUnmount = () => {
        this._ismounted = false
        if (this.source) {
            this.source.cancel()
        }
    }

    componentDidUpdate = (oldProps) => {
        // We use the markToUpdate to update the formulary before the formulary has been open or has been closed
        // we use this for a more smooth ui animation
        if (oldProps.router.form !== this.props.router.form) {
            if (this.source) {
                this.source.cancel()
            }
            this.buildFormulary(this.props.router.form, null)
        } else {
            if(oldProps.formularyId !== this.props.formularyId && this.props.formularyId) {
                this.setMarkToUpdate(true)
            }
            if (this.state.markToUpdate) {
                if (this.props.formulary.isOpen && this.props.formularyId) {
                    this.source = this.CancelToken.source()
                    setTimeout(() => this.props.onGetFormularyData(this.source, this.props.router.form, this.props.formularyId, this.props.formularyDefaultData), 500)
                } else if (!this.props.formulary.isOpen) {
                    if (this.state.auxOriginalInitial.filled && this.state.auxOriginalInitial.buildData) {
                        this.props.onFullResetFormularyState({}, [], this.state.auxOriginalInitial.buildData)
                    } else {
                        this.props.setFormularyId(null)
                        this.props.setFormularyDefaultData([])
                        this.props.onChangeFormularyDataState({})
                        this.props.onChangeFormularyFilesState([])
                    }
                    this.setErrors({})
                    this.setIsSubmitting(false)
                    if (this.source) {
                        this.source.cancel()
                    }
                }
                this.setMarkToUpdate(false)
            }
            if (this.state.isEditing && oldProps.formulary.buildData.id !== this.props.formulary.buildData.id) {
                this.source = this.CancelToken.source()
                this.props.onGetFormularySettings(this.source, this.props.formulary.buildData.id)
            }
        }
    }

    render() {
        const sections = (this.props.formulary.buildData && this.props.formulary.buildData.depends_on_form) ? this.props.formulary.buildData.depends_on_form : []
        return (
            <Formularies.Container>
                <Formularies.Button onClick={e=>{this.setIsOpen()}} isOpen={this.props.formulary.isOpen} disabled={this.state.isLoading}>
                    {this.getFormularyButtonTitle()}
                </Formularies.Button>
                <Formularies.ContentContainer isOpen={this.props.formulary.isOpen}>
                    {(this.state.isEditing) ? (
                        <div>
                            <FormularySectionsEdit
                            onRemoveFormularySettingsField={this.props.onRemoveFormularySettingsField}
                            onUpdateFormularySettingsField={this.props.onUpdateFormularySettingsField}
                            onCreateFormularySettingsField={this.props.onCreateFormularySettingsField}
                            onRemoveFormularySettingsSection={this.props.onRemoveFormularySettingsSection}
                            onUpdateFormularySettingsSection={this.props.onUpdateFormularySettingsSection}
                            onCreateFormularySettingsSection={this.props.onCreateFormularySettingsSection}
                            onChangeFormularySettingsState={this.props.onChangeFormularySettingsState}
                            formId={this.props.formulary.buildData.id}
                            types={this.props.types}
                            setIsEditing={this.setIsEditing}
                            data={this.props.formulary.update}
                            />
                        </div>
                    ): (
                        <div>
                            {this.state.isLoading ? '' : (
                                <div>
                                    {(this.props.formulary.buildData && this.props.formulary.buildData.group_id && this.props.formulary.buildData.id) ? (
                                        <Formularies.EditButton onClick={this.setIsEditing} label={strings['pt-br']['formularyEditButtonLabel']} description={strings['pt-br']['formularyEditButtonDescription']}/>
                                    ) : ''}
                                    {(this.props.formulary.buildData && this.props.formulary.buildData.form_name !== this.props.router.form) ? (
                                        <Formularies.Navigator 
                                        onClick={e => {this.props.onFullResetFormularyState(this.state.auxOriginalInitial.filled.data, this.state.auxOriginalInitial.filled.files, this.state.auxOriginalInitial.buildData)}}
                                        >
                                            &lt;&nbsp;{(this.state.auxOriginalInitial.buildData) ? this.state.auxOriginalInitial.buildData.label_name : ''}
                                        </Formularies.Navigator>
                                    ) : ''}   
                                    <FormularySections 
                                    errors={this.state.errors}
                                    types={this.props.types}
                                    onChangeFormulary={this.onChangeFormulary}
                                    data={this.props.formulary.filled.data}
                                    files={this.props.formulary.filled.files}
                                    onChangeFormularyFilesState={this.props.onChangeFormularyFilesState}
                                    setData={this.setData}
                                    sections={sections}
                                    />
                                    {sections.length > 0 ? (
                                        <Formularies.SaveButton disabled={this.state.isSubmitting} onClick={e=> {this.onSubmit()}}>
                                            {this.state.isSubmitting ? (<Spinner animation="border" />) : strings['pt-br']['formularySaveButtonLabel']}
                                        </Formularies.SaveButton>
                                    ) : ''}
                                    
                                </div> 
                            )}
                        </div>
                    )}
                </Formularies.ContentContainer>
            </Formularies.Container>
        )
    }
}

export default connect(state => ({ formulary: state.home.formulary, types: state.login.types }), actions)(Formulary);