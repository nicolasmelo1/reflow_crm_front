import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ? 
styled(React.forwardRef(({isOpen, errors, ...rest}, ref) => <div {...rest} ref={ref}/>))`
    background-color: white;
    color: #20253F;
    border: 2px solid ${props=>props.isOpen ? '#20253F': props.errors ? 'red': '#f2f2f2'};
    caret-color: #20253F;
    border-radius: .25rem;
    outline: none !important
`
:
styled(React.forwardRef(({errors, ...rest}, ref) => <View {...rest} ref={ref}/>))`
    background-color: white;
    border: 1px solid ${props=> props.errors ? 'red': '#f2f2f2'};
    border-radius: 4px;
    min-height: 30px;
`