import React from 'react'
import styled from 'styled-components'
import { Switch } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.input``
:
styled(Switch)`
    transform: scale(.8, .8)
`