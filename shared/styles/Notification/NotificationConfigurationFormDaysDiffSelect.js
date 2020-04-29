import React from 'react'
import styled from 'styled-components'
import NativePicker from '../../components/Utils/NativePicker'

export default process.env['APP'] === 'web' ?
styled.div``
:
styled(NativePicker)`
    background-color: white;
    border: 1px solid #0dbf7e;
    border-radius: 4px;
    padding: 5px;
`