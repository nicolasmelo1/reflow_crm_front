import React from 'react'
import styled from 'styled-components'
import { Popover } from 'react-bootstrap'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled(Popover.Content)`
    overflow: auto;
    max-height: calc(var(--app-height) - 50px)
`
:
styled(View)``