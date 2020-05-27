import React from 'react'
import styled from 'styled-components'
import { Dropdown } from 'react-bootstrap'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled(Dropdown.Menu)`
    overflow-y: auto;
    max-height: calc(calc(var(--app-height) - 50px) / 2);
`
:
styled(View)``