import React from 'react'
import styled from 'styled-components'
import { Button } from 'react-bootstrap'

const StyledButton = styled(Button)`
    background-color: #0dbf7e;
    color: black;
    border: 0;
    border-radius: 5px 0 0 5px;
    &:hover {
        background-color: #fff;
        color: black;
    }
    &:active{
        background-color: #fff !important;
        color: black !important;
    }
`
export default React.forwardRef(({ children, onClick }, ref) => (
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