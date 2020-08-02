import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    position: sticky;
    left: 0;
    top: 0;
    box-sizing : border-box;
    height: 50px;
`
:
styled(View)``