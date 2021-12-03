import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

export default styled(React.forwardRef(({isEditing, ...rest}, ref) => <FontAwesomeIcon {...rest} ref={ref}/>))`
    color: ${props => props.isEditing ? '#0dbf7e' : '#20253F'};
    float: right;
    margin: 0 5px;
    cursor: pointer;
`