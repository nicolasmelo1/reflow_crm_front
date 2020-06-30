import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    width: 150px;
    height: 150px;
    margin: 5px;
    top: 0;
    vertical-align:top;
    right: 0;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 3px 6px #17242D;
    display: inline-block;
`
:
styled(View)``