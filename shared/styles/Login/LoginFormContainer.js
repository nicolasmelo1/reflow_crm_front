import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    background-color: #f2f2f2;
    border-radius: 20px;
    padding: 20px;
    display: flex;
    align-items: center;
    flex-direction: column;
    opacity: ${props => props.showForm ? '1': '0'};
    transition: opacity 1s ease-in-out;
`
:
styled(View)``