import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

const getColor = (props) => {
    if (props.isEditing && !props.isConditional) {
        return '#17242D'
    } else if (props.isEditing && props.isConditional) {
        return '#0dbf7e'
    } else {
        return '#f2f2f2'
    }
}

export default styled(React.forwardRef(({isEditing, isConditional, ...rest}, ref) => <FontAwesomeIcon {...rest} ref={ref}/>))`
    color: ${props=> getColor(props)};
    float: right;
    margin: 0 5px;
    font-size: 20px;
    cursor: pointer;
`