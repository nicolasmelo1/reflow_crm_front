import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button``
:
styled(TouchableOpacity)`
    background-color: #0dbf7e;
    border-radius: 5px;
    margin: 5px 0;
    padding: 5px;
`