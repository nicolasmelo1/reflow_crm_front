import React from 'react'
import styled from 'styled-components'
import { Button } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    color: #444;
    font-size: 20px;
    background-color: transparent;
    border: 0;
    
    &:hover {
        color: #0dbf7e;
    }
`
:
styled(React.forwardRef(({...props}, ref) => <Button {...props} ref={ref}/>))`
    align-self: flex-start
`