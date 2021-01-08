import styled from 'styled-components'

export default styled(({isInitial, ...rest}) => <p {...rest}/>)`
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
    white-space: ${props=> props.isInitial ? 'normal': 'nowrap'};
    filter: ${props=> props.isInitial ? 'invert(100%)': 'invert(0%)'};
`