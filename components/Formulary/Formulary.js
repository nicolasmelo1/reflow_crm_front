import React from 'react'
import { FormularyContainer, FormularyButton, FormularyContentContainer } from 'styles/Formulary'
import { Row, Col } from 'react-bootstrap'
import FormularySection from './FormularySection'
import actions from 'redux/actions'
import { connect } from 'react-redux'

class Formulary extends React.Component {
    constructor(props) {
        super(props)
        this.props.onGetFormulary(this.props.query.form)
        this.state = {
            isOpen: false
        }
    }
    
    setIsOpen = (e) => {
        e.preventDefault;
        this.setState(state=>{
            return {
                isOpen: !state.isOpen
            }
        })
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
                            <FormularySection sections={(this.props.formulary.loaded.depends_on_form) ? this.props.formulary.loaded.depends_on_form: []}/>
                        </FormularyContentContainer>
                    </Col>
                </Row>
            </FormularyContainer>
        )
    }
}

export default connect(state => ({ formulary: state.home.formulary }), actions)(Formulary);