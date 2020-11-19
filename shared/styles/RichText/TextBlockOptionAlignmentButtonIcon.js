import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

export default styled(React.forwardRef(({isSelected, ...rest}, ref) => <FontAwesomeIcon {...rest} ref={ref}/>))`
    ${props => props.isSelected ? 'color: #0dbf7e' : ''} 
`