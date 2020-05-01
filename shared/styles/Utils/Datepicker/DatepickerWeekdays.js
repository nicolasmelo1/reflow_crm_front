import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ? 
styled.th`
    padding: 2px;
    color: ${props => props.isDarkBackground ? '#f2f2f2': '#17242D'};
    font-size: 14px;
    width: 14.2857142857%;
    text-align: center
`
:
null