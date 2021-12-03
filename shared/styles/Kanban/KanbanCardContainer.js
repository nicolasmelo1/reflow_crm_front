import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    box-shadow: 4px 4px 12px rgba(56, 66, 95, 0.08);
    border: 0;
    border-radius: 4px;
    padding: 10px;
    width: 250px;
    margin: 10px;
    cursor: pointer;
    color: #20253F;
    background-color: #fff;
`
:
styled(View)``