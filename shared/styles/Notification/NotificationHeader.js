import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div``
:
styled(View)`
    flex-direction: row;
    align-items: center;
    direction: ${props => props.isEditing ? 'rtl': 'inherit'};
    width: 100%;
    border-bottom-width: 1px;
    border-bottom-color: #f2f2f2; 
    padding: 10px;
`