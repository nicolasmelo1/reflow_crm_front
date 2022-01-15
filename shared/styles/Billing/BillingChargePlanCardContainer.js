import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    min-width: 260px;
    border: 0;
    text-align: left;
    background-color: ${props => props.isSelected ? '#f2f2f2' : '#fff'};
    border-radius: 10px;
    box-shadow: 2px 2px 16px rgba(190, 205, 226, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.1);
    margin: 10px;
    padding: 5px;
    width: calc(100% / ${props => `${props.numberOfPlans}`}),
`
:
styled(View)``