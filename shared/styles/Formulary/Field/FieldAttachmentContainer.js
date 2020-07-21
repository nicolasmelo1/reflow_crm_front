import styled from 'styled-components'

export default styled(({isInitial, numberOfItems, isSectionConditional,...rest}) => <div {...rest}/>)`
    ${props=> props.isInitial ? `
        position: sticky;
        ${props.numberOfItems !== 1 ? 'left: 0;': ''}
        height: 100%;
        background-color: ${props.isSectionConditional ? '#17242D' : '#fff'};
        border-right: 1px solid #f2f2f2;
        z-index: 1;
    ` : ''}
    width: ${props=> props.numberOfItems !== 1 ? '130px': ''};
    text-align: center;
    display: ${props=> props.numberOfItems !== 1 ? 'inline-block' : ''};
    vertical-align: middle;
    border-radius: .25rem;
    padding: 10px;
`