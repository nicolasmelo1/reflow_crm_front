import styled from 'styled-components'

export default styled(({isOpen, height,...rest}) => <div {...rest}/>)`
    ${props => props.display === 'bottom' ? `
        box-shadow: -5px 5px 20px #17242D;
    `: ''}    
    background-color: ${props => props.display !== 'bottom' ? '#fff': '#f2f2f2'}; 
    overflow-y: auto; 
    display: block;
    position: relative;
    padding: ${props=> props.isOpen || props.display !== 'bottom' ? '10px' : '0'};

    scrollbar-color: #bfbfbf transparent;
    scrollbar-width: thin;
    
    &::-webkit-scrollbar-thumb {
        background: #bfbfbf;
        border-radius: 5px;
    }

    &::-webkit-scrollbar {
        -webkit-appearance: none;
        width: 8px;
        height: 8px;
        background-color: transparent;
    }

    @media(max-width: 420px) {
        ${props => props.display === 'bottom' ? `
            height: ${props.isOpen ? `calc(var(--app-height) - 50px)` : '0'};
        ` : ''}
    }

    @media(min-width: 420px) {
        ${props => props.display === 'bottom' ? `
            margin-right: 15px;
            width:80vw; 
            float: right; 
            border-radius: 10px 0 0 0; 
            height: ${props.isOpen ? `calc(var(--app-height) - var(--app-navbar-height) - 90px)` : '0'};
        ` : ''} 
    }
`