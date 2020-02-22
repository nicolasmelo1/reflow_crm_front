import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default styled(React.forwardRef(({isOpen, isConditional, ...rest}, ref) => <FontAwesomeIcon {...rest} ref={ref}/>))`
    color: ${props=> props.isOpen || props.isConditional ? '#0dbf7e' : '#f2f2f2'};
`