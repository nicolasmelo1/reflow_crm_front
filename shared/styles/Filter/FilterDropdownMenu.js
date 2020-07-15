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
styled(View)`
    flex: 1;
    min-height: 36px;
    background-color: #fff;
    border-bottom-width: 1px;
    border-bottom-color: #f2f2f2;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    margin-bottom: 10px;
`