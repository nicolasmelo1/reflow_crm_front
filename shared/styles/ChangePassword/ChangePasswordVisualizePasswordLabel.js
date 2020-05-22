import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.label`
    user-select: none;
    font-size: 13px;;
    margin-bottom: 20px;
`
:
styled(TouchableOpacity)`
    align-self: center;
    align-items: center;
    flex-direction: row;
    margin-bottom: 20px;
`