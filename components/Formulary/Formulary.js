import React from 'react'
import { FormularyContainer, FormularyButton, FormularyContentContainer, FormularyNavigatorButton } from 'styles/Formulary'
import { Row, Col } from 'react-bootstrap'
import FormularySection from './FormularySection'
import FormularySectionEdit from './FormularySectionEdit'
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
            isEditing: true,
            errors: {},
            auxOriginalInitial: {}
        }
    }

    setIsOpen = (e) => {
        if (e) {
            e.preventDefault();
        }
        
        // when user closes we reset the states on the formulary
        if (this.state.isOpen) {
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
            <FormularyContainer>
                <Row>
                    <Col>
                        <FormularyButton onClick={e=>{this.setIsOpen(e)}}>{strings['pt-br']['formularyOpenButtonLabel']}</FormularyButton>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormularyContentContainer isOpen={this.props.formulary.isOpen}>
                            {(this.state.isEditing) ? (
                                <div>
                                    <FormularySectionEdit/>
                                </div>
                            ): (
                                <div>
                                    {(this.props.formulary.buildData && this.props.formulary.buildData.form_name !== this.props.query.form) ? (
                                        <FormularyNavigatorButton onClick={e => {this.props.onFullResetFormulary(this.state.auxOriginalInitial.filledData, this.state.auxOriginalInitial.buildData)}}>&lt;&nbsp;Voltar</FormularyNavigatorButton>
                                    ) : ''}
                                    <FormularySection 
                                    errors={this.state.errors}
                                    onChangeFormulary={this.onChangeFormulary}
                                    loadData={this.loadData}
                                    data={this.props.formulary.filledData}
                                    setData={this.setData}
                                    sections={(this.props.formulary.buildData && this.props.formulary.buildData.depends_on_form) ? this.props.formulary.buildData.depends_on_form : []}
                                    />
                                    <button onClick={e=> {this.onSubmit()}}>Salvar</button>
                                </div> 
                            )}
                        </FormularyContentContainer>
                    </Col>
                </Row>  
            </FormularyContainer>
        )
    }
}

export default connect(state => ({ formulary: state.home.formulary }), actions)(Formulary);