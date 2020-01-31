import React from 'react'
import { FormularyContainer, FormularyButton, FormularyContentContainer } from 'styles/Formulary'
import { Row, Col } from 'react-bootstrap'
import FormularySection from './FormularySection'
import actions from 'redux/actions'
import { connect } from 'react-redux'

/**
 * Okay, so now the important part, exist two types of data that our front
 */
class Formulary extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,
            data: {
                depends_on_form: []
            }
        }
    }
    
    setIsOpen = (e) => {
        e.preventDefault();
        this.setState(state=>{
            return {
                isOpen: !state.isOpen
            }
        })
    }

    setData = (data) => {
        this.setState(state=>{
            return {
                data: {...state.data}
            }
        })
    }

    componentDidMount = () => {
        this.props.onGetFormulary(this.props.query.form)
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.formulary.loaded !== this.props.formulary.loaded) {
            this.state.data.depends_on_form = this.props.formulary.loaded.depends_on_form.map(section=> {
                return {
                    id: null,
                    form_id: section.id,
                    dynamic_form_value: []
                }
            })
            this.setData(this.state.data)
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
                            data={this.state.data}
                            setData={this.setData}
                            sections={this.props.formulary.loaded.depends_on_form}
                            />
                        </FormularyContentContainer>
                    </Col>
                </Row>
            </FormularyContainer>
        )
    }
}

export default connect(state => ({ formulary: state.home.formulary }), actions)(Formulary);