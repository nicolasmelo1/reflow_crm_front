import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

const StyledButton = process.env['APP'] === 'web' ? styled.button`
    background-color: #0dbf7e;
    font-size: 13px;
    color: black;
    border: 0;
    border-radius: 0;
    
    &:hover {
        background-color: #0dbf7e50;
        color: black;
    }
    &:active{
        background-color: #fff !important;
        color: black !important;
    }
` : ''
export default process.env['APP'] === 'web' ?
React.forwardRef(({ children, onClick }, ref) => (
    <StyledButton
    ref={ref}
    onClick={e => {
        e.preventDefault();
        onClick(e);
    }}
    >
        {children}
        &nbsp;&#x25bc;
    </StyledButton>
))
:
styled(TouchableOpacity)``