import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    border: 0;
    background-color: transparent;
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;
    align-items: center;
    position: relative;
    transform: scale(${props => props.sizeRelativeToView})
`
:
styled(TouchableOpacity)`
    margin: 5px;
`