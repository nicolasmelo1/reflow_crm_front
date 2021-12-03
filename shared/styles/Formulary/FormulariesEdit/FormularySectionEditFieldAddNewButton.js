import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity, Text } from 'react-native'


const StyledButtonContainer = process.env['APP'] === 'web' ?
styled.button`
    text-align: center;
    border: 0;
    background-color: #fff;
    border-radius: 0 0 7px 7px;
    padding: 5px;
    width: 100%;

    &:hover {
        background-color: #0dbf7e;
    }
`
:
styled(TouchableOpacity)

const StyledButtonText = process.env['APP'] === 'web' ? 
styled.p`
    margin: 0;
    padding: 0;
    color: #20253F
`
:
styled(Text)``

const StyledPlusIcon = process.env['APP'] === 'web' ?
styled.svg`
    fill: #20253F
`
:
null

const FormularySectionEditFieldAddNewButton = (props) => {
    const renderMobile = () => (
        <View></View>
    )

    const renderWeb = () => (
        <StyledButtonContainer onClick={props.onClick}>
            <StyledButtonText>{props.text}</StyledButtonText>
            <div>
                <StyledPlusIcon width="15" height="15" viewBox="0 0 52 52">
                    <path d="M26 0C11.664 0 0 11.663 0 26s11.664 26 26 26 26-11.663 26-26S40.336 0 26 0zm0 50C12.767 50 2 39.233 2 26S12.767 2 26 2s24 10.767 24 24-10.767 24-24 24z"></path>
                    <path d="M38.5 25H27V14c0-.553-.448-1-1-1s-1 .447-1 1v11H13.5c-.552 0-1 .447-1 1s.448 1 1 1H25v12c0 .553.448 1 1 1s1-.447 1-1V27h11.5c.552 0 1-.447 1-1s-.448-1-1-1z"></path>
                </StyledPlusIcon>
            </div>
        </StyledButtonContainer>
    )

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default FormularySectionEditFieldAddNewButton