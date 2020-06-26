import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    border: 1px solid  ${props => props.isOpen ? '#0dbf7e' : '#17242D'};
    padding: 5px;
    background-color: ${props => props.isOpen ? '#0dbf7e': 'transparent'};
    margin: 5px;
    height: 250px;
    width: 250px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`
:
styled(View)``