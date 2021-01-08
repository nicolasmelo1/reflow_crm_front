import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'
import dynamicImport from '../../utils/dynamicImport'

const Spinner = dynamicImport('react-bootstrap', 'Spinner')

export default process.env['APP'] === 'web' ?
styled(Spinner)`
    color: #0dbf7e;
`
:
styled(View)``