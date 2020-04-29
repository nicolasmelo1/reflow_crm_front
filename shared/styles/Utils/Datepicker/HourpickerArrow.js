import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

export default process.env['APP'] === 'web' ?  
styled(FontAwesomeIcon)`
    color: #0dbf7e;
    cursor: pointer;
`
: 
null