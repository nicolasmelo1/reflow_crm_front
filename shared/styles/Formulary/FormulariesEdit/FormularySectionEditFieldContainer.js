import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    ${props => props.isEditing ? `
        border-left: 5px solid #17242D;
    `: ''}
    border-bottom: 1px dashed #bfbfbf;
    padding: 5px
`
:
styled(View)``