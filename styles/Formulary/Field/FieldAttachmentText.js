import styled from 'styled-components'
import { Col } from 'react-bootstrap'

export default styled(({isInitial, ...rest}) => <p {...rest}/>)`
    filter: ${props=> props.isInitial ? 'invert(100%)': 'invert(0%)'};
`