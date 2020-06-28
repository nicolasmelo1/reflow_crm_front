import React from 'react'
import styled from 'styled-components'
import { Spinner } from 'react-bootstrap'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled(Spinner)`
    color: #0dbf7e;
`
:
styled(View)``