import React from 'react'
import styled from 'styled-components'
import { Switch } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.input`
`
:
styled(Switch)`
    margin-right: 10px;
    margin-bottom: 10px;
    margin-top: 10px
`