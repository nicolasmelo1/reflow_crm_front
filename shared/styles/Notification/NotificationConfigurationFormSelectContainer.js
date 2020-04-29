import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ? 
styled(React.forwardRef(({isOpen, errors, ...rest}, ref) => <div {...rest} ref={ref}/>))`
    background-color: white;
    color: #444;
    border: 1px solid ${props=>props.isOpen ? '#444': props.errors ? 'red': '#0dbf7e'};
    caret-color: #444;
    border-radius: .25rem;
    outline: none !important
`
:
styled(React.forwardRef(({errors, ...rest}, ref) => <View {...rest} ref={ref}/>))`
    background-color: white;
    border: 1px solid ${props=> props.errors ? 'red': '#0dbf7e'};
    border-radius: 4px;
    min-height: 30px;
`