import styled from 'styled-components'

export default styled(({sidebarIsOpen, ...rest}) => <button {...rest}/>)`
    position: absolute;
    left: ${({ sidebarIsOpen }) => sidebarIsOpen ? 'calc(310px + 15px)' : '15px'};
    transition: left 0.3s ease-in-out;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 50px;
    font-weight: bold;
    height: 2rem;
    background: #444;
    border-radius: 0 20px 20px 0;
    border: none;
    z-index: 10;
    cursor: pointer;
    color: #0dbf7e
`