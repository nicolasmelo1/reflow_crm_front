import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default styled(React.forwardRef(({isEditing, isConditional, ...rest}, ref) => <FontAwesomeIcon {...rest} ref={ref}/>))`
    color: ${props=> props.isEditing || props.isConditional ? '#444' : '#f2f2f2'};
    float: right;
    margin: 0 5px;
    font-size: 20px;
    cursor: pointer;
`