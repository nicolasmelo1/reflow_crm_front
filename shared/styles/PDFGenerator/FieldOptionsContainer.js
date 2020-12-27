import React from 'react'
import styled from 'styled-components'
import { ScrollView } from 'react-native'

const calculateLeft = (left) => {
    if (window.innerWidth - left < 200) {
        return left-215
    } else {
        return left
    }
}

export default process.env['APP'] === 'web' ?
styled.div`
    width: 200px;
    background-color: #ffffff;
    overflow-y: auto;
    position: absolute;
    top: ${props => props.top}px;
    left: ${props => calculateLeft(props.left)}px;
    box-shadow: rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px;
    border: 1px solid #bfbfbf;
    padding: 5px 0;
    border-radius: 5px;
    height: 400px;
    z-index: 5;
`
:
styled(ScrollView)`
    padding: 10px;
    height: 92%;
`