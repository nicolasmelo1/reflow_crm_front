import styled from 'styled-components'

export default styled(React.forwardRef(({isOpen, ...rest}, ref) => <div {...rest} ref={ref}/>))`
    background-color: white;
    color: #444;
    border: 1px solid ${props=>props.isOpen ? '#444': '#0dbf7e'};
    caret-color: #444;
    border-radius: .25rem;
    outline: none !important
`