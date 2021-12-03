import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity, View, Text } from 'react-native'

const StyledContainer = 
process.env['APP'] === 'web' ?
styled.div`
    padding: 15px; 
    margin-bottom: 10px;
    background-color: #20253F;
    margin: -10px -10px 10px -10px;
`
:
styled(View)``

const StyledButton = process.env['APP'] === 'web' ?
styled.button`
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
:
styled(TouchableOpacity)``

const StyledParagraph = process.env['APP'] === 'web' ?
styled.p`
    display: inline-block;
    margin: 0;
    color: #f2f2f2;
    margin: 0 5px;
`
:
styled(Text)``

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