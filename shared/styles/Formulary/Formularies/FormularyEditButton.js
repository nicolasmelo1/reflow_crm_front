import styled from 'styled-components'

const StyledContainer = styled.div`
    padding: 15px; 
    margin-bottom: 10px;
    background-color: #17242D;
    margin: -10px -10px 10px -10px;
`

const StyledButton = styled.button`
    background-color: #0dbf7e;
    border: 0;
    border-radius: 5px;
    display: inline-block;
    margin: 0 5px;
    padding: 10px 15px;
    font-weight: bold; 
    color: #f2f2f2;
    &:hover {
        background-color: #0dbf7e90;
    }
`

const StyledParagraph = styled.p`
    display: inline-block;
    margin: 0;
    color: #f2f2f2;
    margin: 0 5px;
`
/**
 * 
 * @param {function} onClick - function to be called when user clicks button
 * @param {String} label - text to show on button
 */
const FormularyEditButton = (props) => {
    return (
        <StyledContainer>
            <StyledButton onClick={e=> {props.onClick()}}>{props.label}</StyledButton>
            <StyledParagraph>{props.description}</StyledParagraph>
        </StyledContainer>
    )
}

export default FormularyEditButton