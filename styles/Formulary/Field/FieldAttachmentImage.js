import styled from 'styled-components'

export default styled(({isInitial, ...rest}) => <img {...rest}/>)`
    max-width: 70px;
    max-height: 70px;
    filter: ${props=> props.isInitial ? 'invert(100%)': 'invert(0%)'};
`