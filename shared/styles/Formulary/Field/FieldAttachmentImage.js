import styled from 'styled-components'

export default styled(({isInitial, isSectionConditional, ...rest}) => <img {...rest}/>)`
    max-width: 60px;
    max-height: 60px;
    padding: 0;   
    background-color: ${props => props.isInitial ? props.isSectionConditional ? 'transparent' : 'transparent' : '#fff'} ;
    filter: ${props => props.isInitial ? props.isSectionConditional ? 'invert(0%)' : 'invert(100%)' : 'invert(0%)'} ;
`