import React from 'react'
import { FormularyContainer, FormularyButton, FormularyContentContainer } from 'styles/Formulary'
import { Row, Col } from 'react-bootstrap'
import FormularySection from './FormularySection'
import actions from 'redux/actions'
import { connect } from 'react-redux'

/**
 * You might want to read the README to understand how this and all of it's components work.
 * */
class Formulary extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: false
        }
    }

    setIsOpen = (e) => {
        e.preventDefault();
        this.setState(state => {
            return {
                isOpen: !state.isOpen
            }
        })
    }

    setData = (sectionsData) => {
        this.props.onChangeFormularyData({
            depends_on_dynamic_form: sectionsData
        })
    }

    onSubmit = () => {
        if (this.props.formularyId) {
            this.props.onUpdateFormularyData(this.props.formulary.filled_data, this.props.query.form, this.props.formularyId)
        } else {
            this.props.onCreateFormularyData(this.props.formulary.filled_data, this.props.query.form)
        }
        this.props.setFormularyId(null)
       // this.props.onGetBuildFormulary(this.props.query.form)
    }

    componentDidMount = () => {
        this.props.onGetBuildFormulary(this.props.query.form)
        if (this.props.formularyId) {
            this.props.onGetFormularyData(this.props.query.form, this.props.formularyId)
        } 
    }

    render() {
        return (
            <FormularyContainer>
                <Row>
                    <Col>
                        <FormularyButton onClick={e=>{this.setIsOpen(e)}}>Adicionar</FormularyButton>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormularyContentContainer isOpen={this.state.isOpen}>
                            <FormularySection 
                            data={this.props.formulary.filled_data}
                            setData={this.setData}
                            formularyId={(this.props.formularyId !== null) ? this.props.formularyId : null}
                            sections={this.props.formulary.loaded.depends_on_form}
                            />
                            <button onClick={e=> {this.onSubmit()}}>Salvar</button>
                        </FormularyContentContainer>
                    </Col>
                </Row>  
            </FormularyContainer>
        )
    }
}

export default connect(state => ({ formulary: state.home.formulary }), actions)(Formulary);