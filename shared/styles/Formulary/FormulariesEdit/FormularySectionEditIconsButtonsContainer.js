import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components'
import dynamicImport from '../../../utils/dynamicImport'

const Row = dynamicImport('react-bootstrap', 'Row')

export default process.env['APP'] === 'web' && Row ? 
styled(Row)`
    margin-right: 0;
    margin-left: 0;
`
:
styled(View)``