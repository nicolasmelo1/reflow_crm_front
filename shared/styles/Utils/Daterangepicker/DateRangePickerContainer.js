import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ?  
styled.div`
    position: absolute;
    background-color: #f2f2f2;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 4px 20px 0 black;
    ${props => props.maximumHeight ? `height: ${props.maximumHeight}px;` : ''}
    overflow: auto;
    text-align: center;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;

    @media(min-width: 564px) {
        width: 462px;
    }
`
:
null