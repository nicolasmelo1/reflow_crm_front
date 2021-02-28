import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components'
import dynamicImport from '../../utils/dynamicImport'

const Dropdown = dynamicImport('react-bootstrap', 'Dropdown')

export default process.env['APP'] === 'web' && Dropdown ? 
styled(Dropdown.Menu)`
    width: 100%;
    padding: 0 !important;
    overflow: auto;

    @media(max-width: 640px) {
        max-height: calc(var(--app-height) - 231px);
    };

    @media(min-width: 640px) {
        max-height: calc(var(--app-height) - 191px);
    };

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