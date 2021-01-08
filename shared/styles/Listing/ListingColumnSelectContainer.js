import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components'
import dynamicImport from '../../utils/dynamicImport'

const Dropdown = dynamicImport('react-bootstrap', 'Dropdown')

export default process.env['APP'] === 'web' && Dropdown ? 
styled(Dropdown)`
    @media(max-width: 640px) {
        width: 100%;
    };
    @media(min-width: 640px) {
        float: right;
    }
`
:
styled(View)``