import React from 'react'
import styled from 'styled-components'
import { ScrollView } from 'react-native'

export default process.env['APP'] === 'web' ? 
styled(React.forwardRef(({optionBackgroundColor, optionColor, ...rest}, ref) => <div {...rest} ref={ref}/>))`
    width: 100%; 
    background-color: ${props => props.optionBackgroundColor ? props.optionBackgroundColor: '#17242D'};
    color: ${props => props.optionColor ? props.optionColor: '#f2f2f2'};
    overflow-y: auto;
    
    @media(max-width: 420px) {
        height: 100vh;
        float: bottom;
    }
    @media(min-width: 420px) {
        max-height: 300px;
        position: absolute;
        z-index: 5;
    }
`
:
styled(React.forwardRef(({optionBackgroundColor, optionColor, ...rest}, ref) => <ScrollView {...rest} ref={ref}/>))`
    width: 100%; 
    background-color: ${props => props.optionBackgroundColor ? props.optionBackgroundColor: '#17242D'};
    color: ${props => props.optionColor ? props.optionColor: '#f2f2f2'};
    height: 100%;
`
