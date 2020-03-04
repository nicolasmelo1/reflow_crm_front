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
            isEditing: false,
            errors: {},
            auxOriginalInitial: {}
        }
    }

    setIsOpen = (e) => {
        if (e) {
            e.preventDefault();
        }
        
        // when user closes we reset the states on the formulary
        if (this.props.formulary.isOpen) {
            this.props.setFormularyId(null)
            if (this.state.auxOriginalInitial.filledData && this.state.auxOriginalInitial.buildData) {
                this.props.onFullResetFormulary({}, this.state.auxOriginalInitial.buildData)
            } else {
                this.props.onChangeFormularyData({})
            }
            this.setErrors({})
        }
        
        this.props.onOpenOrCloseFormulary(!this.props.formulary.isOpen)
    }

    setAuxOriginalInitial = () => {
        this.setState(state => {
            return {
                ...state,
                auxOriginalInitial: {
                    buildData: {...this.props.formulary.buildData},
                    filledData: {...this.props.formulary.filledData}
                } 
            }
        })
    }

    setIsEditing = () => {
        if (!this.state.isEditing) {
            this.props.onGetFormularySettings(this.props.formulary.buildData.id)
        }
        this.setState(state => {
            return {
                ...state,
                isEditing: !state.isEditing
            }
        })
    }

    setData = (sectionsData) => {
        this.props.onChangeFormularyData({
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
            response = this.props.onUpdateFormularyData(this.props.formulary.filledData, this.props.query.form, this.props.formularyId)
        } else {
            response = this.props.onCreateFormularyData(this.props.formulary.filledData, this.props.query.form)
        }
        
        if (response) {
            response.then(response=> {
                if (response.status !== 200) {
                    this.setErrors(response.data.error)
                }
            })
        }
    }

    buildFormulary = (formName, formId=null) => {
        this.props.onGetBuildFormulary(formName)
        if (formId) {
            this.props.onGetFormularyData(formName, formId)
        } 
    }

    onChangeFormulary = (formName, formId=null) => {
        this.setAuxOriginalInitial()
        this.props.onFullResetFormulary()
        this.buildFormulary(formName, formId)
    }

    componentDidMount = () => {
        this.buildFormulary(this.props.query.form, this.props.formularyId)
    }

    
    render() {
        return (
            <Formularies.Container>
                <Row>
                    <Col>
                        <Formularies.Button onClick={e=>{this.setIsOpen(e)}}>{strings['pt-br']['formularyOpenButtonLabel']}</Formularies.Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Formularies.ContentContainer isOpen={this.props.formulary.isOpen}>
                            {(this.state.isEditing) ? (
                                <div>
                                    <FormularySectionsEdit
                                    onUpdateFormularySettings={this.props.onUpdateFormularySettings}
                                    types={this.props.types}
                                    setIsEditing={this.setIsEditing}
                                    data={this.props.formulary.update}
                                    formulariesOptions={this.props.sidebar.initial}
                                    />
                                </div>
                            ): (
                                <div>
                                    {(this.props.formulary.buildData && this.props.formulary.buildData.group_id && this.props.formulary.buildData.id) ? (
                                        <button onClick={e=> {this.setIsEditing()}}>Editar campos</button>
                                    ) : ''}
                                    {(this.props.formulary.buildData && this.props.formulary.buildData.form_name !== this.props.query.form) ? (
                                        <Formularies.Navigator onClick={e => {this.props.onFullResetFormulary(this.state.auxOriginalInitial.filledData, this.state.auxOriginalInitial.buildData)}}>&lt;&nbsp;Voltar</Formularies.Navigator>
                                    ) : ''}
                                    <FormularySections 
                                    errors={this.state.errors}
                                    types={this.props.types}
                                    onChangeFormulary={this.onChangeFormulary}
                                    loadData={this.loadData}
                                    data={this.props.formulary.filledData}
                                    setData={this.setData}
                                    sections={(this.props.formulary.buildData && this.props.formulary.buildData.depends_on_form) ? this.props.formulary.buildData.depends_on_form : []}
                                    />
                                    <button onClick={e=> {this.onSubmit()}}>Salvar</button>
                                </div> 
                            )}
                        </Formularies.ContentContainer>
                    </Col>
                </Row>  
            </Formularies.Container>
        )
    }
}

export default connect(state => ({ formulary: state.home.formulary, sidebar: state.home.sidebar, types: state.login.types }), actions)(Formulary);