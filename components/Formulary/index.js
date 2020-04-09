import React from 'react'
import { Formularies } from 'styles/Formulary'
import { Row, Col } from 'react-bootstrap'
import FormularySections from './FormularySections'
import FormularySectionsEdit from './FormularySectionsEdit'
import actions from 'redux/actions'
import { connect } from 'react-redux'
import { strings } from 'utils/constants'

/**
 * You might want to read the README to understand how this and all of it's components work.
 * */
class Formulary extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            markToUpdate: false,
            isEditing: false,
            errors: {},
            files: {},
            isLoading: false,
            isLoadingEditing: false,
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

    setIsLoading = (data) => {
        this.setState(state => {
            return {
                ...state,
                isLoading: data
            }
        })
    } 

    setIsOpen = () => {
        // when user closes we reset the states on the formulary
        this.setMarkToUpdate(true)
        this.props.onOpenOrCloseFormulary(!this.props.formulary.isOpen)
    }

    setAuxOriginalInitial = () => {
        this.setState(state => {
            return {
                ...state,
                auxOriginalInitial: {
                    buildData: {...this.props.formulary.buildData},
                    filled: {...this.props.formulary.filled}
                } 
            }
        })
    }

    setIsEditing = () => {
        if (!this.state.isEditing) {
            this.props.onGetFormularySettings(this.props.formulary.buildData.id)
        } else {
            this.buildFormulary(this.props.query.form, this.props.formularyId)
        }
        this.setState(state => {
            return {
                ...state,
                isEditing: !state.isEditing
            }
        })
    }

    setData = (sectionsData) => {
        this.props.onChangeFormularyDataState({
            depends_on_dynamic_form: sectionsData
        })
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
        let response = null
        if (this.props.formularyId) {
            response = this.props.onUpdateFormularyData(this.props.formulary.filled.data, this.props.formulary.filled.files, this.props.query.form, this.props.formularyId)
        } else {
            response = this.props.onCreateFormularyData(this.props.formulary.filled.data, this.props.formulary.filled.files,this.props.query.form)
        }
        
        if (response) {
            response.then(response=> {
                if (response.status !== 200) {
                    this.setErrors(response.data.error)
                } else {
                    this.props.setFormularyHasBeenUpdated()
                    this.setIsOpen()
                }
            })
        }
    }

    buildFormulary = (formName, formId=null) => {
        this.setIsLoading(true)
        this.props.onGetBuildFormulary(formName).then(_ => {
            this.setIsLoading(false)
        })
        if (formId) {
            this.props.onGetFormularyData(formName, formId)
        } 
    }

    getFormularyButtonTitle = () => {
        if (this.props.formulary.isOpen && this.state.isLoading){
            return 'Carregando...'
        } else if (this.props.formulary.isOpen) {
            const formName = (this.props.formulary.buildData && this.props.formulary.buildData.label_name) ? this.props.formulary.buildData.label_name : ''
            return 'Fechar ' + formName 
        } else {
            return strings['pt-br']['formularyOpenButtonLabel']
        }
    }

    onChangeFormulary = (formName, formId=null) => {
        this.setAuxOriginalInitial()
        this.props.onFullResetFormularyState()
        this.buildFormulary(formName, formId)
    }

    componentDidMount = () => {
        this.buildFormulary(this.props.query.form, this.props.formularyId)
    }

    componentDidUpdate(oldProps) {
        const newProps = this.props
        // We use the markToUpdate to update the formulary before the formulary has been open or has been closed
        // we use this for a more smooth ui animation
        if (oldProps.query.form !== newProps.query.form) {
            this.buildFormulary(this.props.query.form, null)
        } else {
            if(oldProps.formularyId !== newProps.formularyId && newProps.formularyId) {
                this.setMarkToUpdate(true)
            }
            if (this.state.markToUpdate) {
                if (this.props.formulary.isOpen && newProps.formularyId) {
                    setTimeout(() => this.props.onGetFormularyData(this.props.query.form, newProps.formularyId, newProps.formularyDefaultData), 500)
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
                }
                this.setMarkToUpdate(false)
            }
            if (this.state.isEditing && oldProps.formulary.buildData.id !== newProps.formulary.buildData.id) {
                this.props.onGetFormularySettings(this.props.formulary.buildData.id)
            }
        }
    }

    render() {
        const sections = (this.props.formulary.buildData && this.props.formulary.buildData.depends_on_form) ? this.props.formulary.buildData.depends_on_form : []
        return (
            <Formularies.Container>
                <Row>
                    <Col>
                        <Formularies.Button onClick={e=>{this.setIsOpen()}}>
                            {this.getFormularyButtonTitle()}
                        </Formularies.Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
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
                                            {(this.props.formulary.buildData && this.props.formulary.buildData.form_name !== this.props.query.form) ? (
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
                                                <Formularies.SaveButton onClick={e=> {this.onSubmit()}}>{strings['pt-br']['formularySaveButtonLabel']}</Formularies.SaveButton>
                                            ) : ''}
                                            
                                        </div> 
                                    )}
                                </div>
                            )}
                        </Formularies.ContentContainer>
                    </Col>
                </Row>
            </Formularies.Container>
        )
    }
}

export default connect(state => ({ formulary: state.home.formulary, types: state.login.types }), actions)(Formulary);