import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    padding: 0 0 10px 0;
`
:
styled(View)`
    padding: 0 0 10px 0;
`