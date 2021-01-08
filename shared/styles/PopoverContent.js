import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'
import dynamicImport from '../utils/dynamicImport'

const Popover = dynamicImport('react-bootstrap', 'Popover')

export default process.env['APP'] === 'web' && Popover ?
styled(Popover.Content)`
    overflow: auto;
    max-height: calc(var(--app-height) - 50px)
`
:
styled(View)``