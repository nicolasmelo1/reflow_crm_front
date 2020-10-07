import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    padding: 0;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
`
:
styled(View)``