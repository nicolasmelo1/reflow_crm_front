import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled(React.forwardRef(({isConditional, ...rest}, ref) => <h2 {...rest} ref={ref}/>))`
    color: ${props => props.isConditional ? '#f2f2f2' : '#20253F'}; 
    margin-top: 10px;
    font-weight: normal;
    letter-spacing: 0.5px;
    text-shadow: -1px -1px 0 #20253F, 1px -1px 0 #20253F, -1px 1px 0 #20253F, 1px 1px 0 #20253F;
    border-bottom: 1px solid #f2f2f2;
`
:
styled(Text)``
