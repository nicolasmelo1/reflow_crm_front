import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default styled(React.forwardRef(({isSelected, ...rest}, ref) => <FontAwesomeIcon {...rest} ref={ref}/>))`
    color: ${props => props.isSelected ? '#f2f2f2': '#444'};
`