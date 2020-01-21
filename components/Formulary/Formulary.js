import React from 'react'
import { FormularyContainer, FormularyButton, FormularyContentContainer } from 'styles/Formulary'
import { Row, Col } from 'react-bootstrap'

class Formulary extends React.Component {
    constructor(props) {
        super(props)
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
                            
                        </FormularyContentContainer>
                    </Col>
                </Row>
            </FormularyContainer>
        )
    }
}

export default Formulary