import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'
import dynamicImport from '../utils/dynamicImport'

const Popover = dynamicImport('react-bootstrap', 'Popover')

export default process.env['APP'] === 'web' && Popover ?
styled(Popover.Content)`
    overflow: auto;
    max-height: calc(var(--app-height) - 50px);
    scrollbar-color: #bfbfbf transparent;
    scrollbar-width: thin;

    scrollbar-color: #bfbfbf transparent;
    scrollbar-width: thin;
    
    &::-webkit-scrollbar-thumb {
        background: #bfbfbf;
        border-radius: 5px;
    }

    &::-webkit-scrollbar {
        -webkit-appearance: none;
        width: 8px;
        height: 8px;
        background-color: transparent;
    }
`
:
styled(View)``