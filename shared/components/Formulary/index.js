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
        this.formularyId = null
        this.state = {
            buildData: {},
            filled: {
                hasBuiltInitial: false,
                data: {
                    id: null,
                    depends_on_dynamic_form: []
                },
                files: []
            },
            //markToUpdate: false,
            isEditing: false,
            errors: {},
            isLoading: false,
            isLoadingEditing: false,
            isSubmitting: false,
            auxOriginalInitial: {}
        }
    }

    //setMarkToUpdate = (data) => this.setState(state => state.markToUpdate = data)

    setIsSubmitting = (data) => this.setState(state => state.isSubmitting = data)

    setIsLoading = (data) => (this._ismounted) ? this.setState(state => state.isLoading = data): null

    setErrors = (errors) => this.setState(state => state.errors = errors)

    setBuildData = (data) => this.setState(state => state.buildData = data)

    setFilledHasBuiltInitial = (data) => this.setState(state => state.filled.hasBuiltInitial = data)

    setFilledFiles = (data) => this.setState(state => state.filled.files = data)

    setFilledData = (id, sectionsData) => this.setState(state => 
        state.filled.data = {
            id: id,
            depends_on_dynamic_form: [...sectionsData]
        })

    setAuxOriginalInitial = () => (this._ismounted) ? this.setState(state => {
        state.auxOriginalInitial = {
            buildData: JSON.parse(JSON.stringify(this.state.buildData)),
            filled: JSON.parse(JSON.stringify(this.state.filled)),
        }
    }) : null
    

    setIsOpen = () => {
        // when user closes we reset the states on the formulary
        this.props.onOpenOrCloseFormulary(!this.props.formulary.isOpen)
        //this.setMarkToUpdate(true)
    }


    setIsEditing = () => {
        if (!this.state.isEditing) {
            this.source = this.CancelToken.source()
            this.props.onGetFormularySettings(this.source, this.state.buildData.id)
        } else {
            this.props.setFormularySettingsHasBeenUpdated()
            this.onLoadFormulary(this.props.formName, this.props.formularyId)
        }
        this.setState(state => {
            return {
                ...state,
                isEditing: !state.isEditing
            }
        })
    }


    onSubmit = () => {
        this.setIsSubmitting(true)
        let response = null
        if (this.state.filled.data.id) {
            response = this.props.onUpdateFormularyData(this.state.filled.data, this.state.filled.files, this.state.buildData.form_name, this.state.filled.data.id)
        } else {
            response = this.props.onCreateFormularyData(this.state.filled.data, this.state.filled.files,this.state.buildData.form_name)
        }
        
        if (response) {
            response.then(response=> {
                this.setIsSubmitting(false)
                if (response.status !== 200) {
                    this.setErrors(response.data.error)
                } else if (this.state.buildData.form_name !== this.props.formName) {
                    this.onFullResetFormulary(this.state.auxOriginalInitial.filled, this.state.auxOriginalInitial.buildData)
                } else {
                    this.props.setFormularyHasBeenUpdated()
                    this.setIsOpen()
                }
            })
        }
    }

    onFullResetFormulary = (filled, buildData) => {
        this.setFilledData(filled.data.id, filled.data.depends_on_dynamic_form)
        this.setFilledFiles(filled.files)
        this.setBuildData(buildData)
    }

    onLoadFormulary = async (formName, formId=null) => {
        this.setFilledHasBuiltInitial(false)
        this.source = this.CancelToken.source()
        // you can build the data outside of the formulary, so you can use this to render other formularies (like themes for example)
        if (this.props.buildData) {
            this.setBuildData(this.props.buildData)
        } else {
            this.setIsLoading(true)
            this.props.onGetBuildFormulary(this.source, formName).then(data => {
                this.setIsLoading(false)
                this.setBuildData(data)
            })
        }
        if (formId) {
            this.props.onGetFormularyData(this.source, formName, formId).then(data=> {
                const id = data.id ? data.id : null
                const sectionsData = data.depends_on_dynamic_form ? data.depends_on_dynamic_form : []
                this.setFilledData(id, sectionsData)
            })
        } 
    }

    /**
     * When the user clicks "add new" or "edit" on the connection field, a new form is loaded in this component without losing 
     * the data of the previous form component loaded
     */
    onChangeFormulary = (formName, formId=null) => { 
        this.setAuxOriginalInitial()
        this.setBuildData({})
        this.onLoadFormulary(formName, formId)
    }

    getFormularyButtonTitle = () => {
        if (this.state.isLoading){
            return strings['pt-br']['formularyLoadingButtonLabel']
        } else if (this.props.formulary.isOpen) {
            const formName = (this.state.buildData && this.state.buildData.label_name) ? this.state.buildData.label_name : ''
            return 'Fechar ' + formName 
        } else {
            return strings['pt-br']['formularyOpenButtonLabel']
        }
    }

    componentDidMount = () => {
        this._ismounted = true
        this.onLoadFormulary(this.props.formName, this.props.formularyId)
    }


    componentWillUnmount = () => {
        this._ismounted = false
        if (this.source) {
            this.source.cancel()
        }
    }


    componentDidUpdate = (oldProps) => {
        if (oldProps.formName !== this.props.formName) {
            if (this.source) {
                this.source.cancel()
            }
            this.setBuildData({})
            this.onLoadFormulary(this.props.formName, null)
        } 
        if (oldProps.formularyId !== this.props.formularyId && this.props.formularyId) {
            if (this.source) {
                this.source.cancel()
            }
            this.source = this.CancelToken.source()
            this.props.onGetFormularyData(this.source, this.props.formName, this.props.formularyId).then(data=> {
                const id = data.id ? data.id : null
                const sectionsData = data.depends_on_dynamic_form ? data.depends_on_dynamic_form : []
                this.setFilledData(id, sectionsData)
            })
        }

        if (oldProps.formulary.isOpen !== this.props.formulary.isOpen && oldProps.formulary.isOpen) {
            if (this.state.auxOriginalInitial.filled && this.state.auxOriginalInitial.buildData) {
                this.onFullResetFormulary(this.state.auxOriginalInitial.filled, this.state.auxOriginalInitial.buildData)
            } else {
                this.setFilledData(null, [])
                this.setFilledHasBuiltInitial(false)
            }
            this.props.setFormularyId(null)
        }
    }

    render() {
        const sections = (this.state.buildData && this.state.buildData.depends_on_form) ? this.state.buildData.depends_on_form : []
        return (
            <div styles={this.props.styles ? this.props.styles : {}}>
                {this.props.buildData ? (
                    <FormularySections 
                    errors={this.state.errors}
                    types={this.props.types}
                    onChangeFormulary={this.onChangeFormulary}
                    data={this.state.filled.data}
                    files={this.state.filled.files}
                    hasBuiltInitial={this.state.filled.hasBuiltInitial}
                    setFilledHasBuiltInitial={this.setFilledHasBuiltInitial}
                    setFilledFiles={this.setFilledFiles}
                    setFilledData={this.setFilledData}
                    sections={sections}
                    />
                ) : (
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
                                    formId={this.state.buildData.id}
                                    types={this.props.types}
                                    setIsEditing={this.setIsEditing}
                                    data={this.props.formulary.update}
                                    />
                                </div>
                            ): (
                                <div>
                                    {this.state.isLoading ? '' : (
                                        <div>
                                            {(this.state.buildData && this.state.buildData.group_id && this.state.buildData.id) ? (
                                                <Formularies.EditButton onClick={this.setIsEditing} label={strings['pt-br']['formularyEditButtonLabel']} description={strings['pt-br']['formularyEditButtonDescription']}/>
                                            ) : ''}
                                            {(this.state.buildData && this.state.buildData.form_name !== this.props.formName) ? (
                                                <Formularies.Navigator 
                                                onClick={e => {this.onFullResetFormulary(this.state.auxOriginalInitial.filled, this.state.auxOriginalInitial.buildData)}}
                                                >
                                                    &lt;&nbsp;{(this.state.auxOriginalInitial.buildData) ? this.state.auxOriginalInitial.buildData.label_name : ''}
                                                </Formularies.Navigator>
                                            ) : ''}   
                                            <FormularySections 
                                            errors={this.state.errors}
                                            types={this.props.types}
                                            onChangeFormulary={this.onChangeFormulary}
                                            data={this.state.filled.data}
                                            files={this.state.filled.files}
                                            hasBuiltInitial={this.state.filled.hasBuiltInitial}
                                            setFilledHasBuiltInitial={this.setFilledHasBuiltInitial}
                                            setFilledFiles={this.setFilledFiles}
                                            setFilledData={this.setFilledData}
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
                )}
            </div>
        )
    }
}

export default connect(state => ({ formulary: state.home.formulary, types: state.login.types }), actions)(Formulary);