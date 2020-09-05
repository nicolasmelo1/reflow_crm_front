import React from 'react'
import styled from 'styled-components'

export default styled.img`
    position: absolute;
    display: block;
    width: 200px;
    opacity: ${props => props.showLogo ? '1 !important': '0 !important'};
    transition: opacity 0.9s ease-in-out;
`