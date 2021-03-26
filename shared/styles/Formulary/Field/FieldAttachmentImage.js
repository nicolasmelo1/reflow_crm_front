import styled from 'styled-components'

export default styled(({isInitial, isSectionConditional, ...rest}) => <img {...rest}/>)`
    max-width: 70px;
    max-height: 70px;
    border-radius: 5px;
    padding: 5px;   
    background-color: ${props => props.isInitial ? props.isSectionConditional ? 'transparent' : 'transparent' : '#fff'} ;
    filter: ${props => props.isInitial ? props.isSectionConditional ? 'invert(0%)' : 'invert(100%)' : 'invert(0%)'} ;
`