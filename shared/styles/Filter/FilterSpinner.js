import React from 'react'
import styled from 'styled-components'
import { Spinner } from 'react-bootstrap'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled(Spinner)`
    height: 20px;
    width: 20px
`
:
styled(View)``