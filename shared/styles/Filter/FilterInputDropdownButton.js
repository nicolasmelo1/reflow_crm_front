import React from 'react'
import styled from 'styled-components'
import { Button } from 'react-bootstrap'
import { TouchableOpacity } from 'react-native'

const StyledButton = styled(Button)`
    background-color: #0dbf7e;
    color: black;
    border: 0;
    border-radius: 0;
    &:hover {
        background-color: #fff;
        color: black;
    }
    &:active{
        background-color: #fff !important;
        color: black !important;
    }
`
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