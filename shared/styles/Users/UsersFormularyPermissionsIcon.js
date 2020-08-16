import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'


export default styled(({isSelected, ...rest}) => <FontAwesomeIcon {...rest}/>)`
    color: ${props => props.isSelected ? `#0dbf7e`: `red`}
`
