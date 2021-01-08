import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components'
import dynamicImport from '../../../utils/dynamicImport'

const Col = dynamicImport('react-bootstrap', 'Col')

export default process.env['APP'] === 'web' && Col ? 
styled(Col)`
    margin: 5px
`
:
styled(View)``