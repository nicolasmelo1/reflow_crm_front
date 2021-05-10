import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

export default styled(React.forwardRef(({isEditing, ...rest}, ref) => <FontAwesomeIcon {...rest} ref={ref}/>))`
    margin: 0 10px 0 0;
    cursor: pointer;
    color: ${props => props.isEditing ? '#0dbf7e' : '#bfbfbf'};
`