import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    border: ${props => props.formIsOpen ? '#1px solid #0dbf7e' : '1px solid #17242D'};
    padding: 5px;
    background-color: ${props => props.formIsOpen ? '#0dbf7e' : 'transparent'};
    margin-top: 5px;
    min-height: 40px;
    border-radius: 4px;
    cursor: pointer;
`
:
styled(TouchableOpacity)`
    background-color: ${props => props.formIsOpen ? '#0dbf7e' : 'transparent'};
    border: ${props => props.formIsOpen ? '1px solid #0dbf7e' : '1px solid #17242D'};
    border-radius: 4px;
    padding: 5px;
    margin-top: 5px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`