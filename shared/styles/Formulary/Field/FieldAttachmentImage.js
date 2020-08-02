import styled from 'styled-components'

const getImageFilter = (props) => {
    if (props.isInitial) {
        if (props.isSectionConditional) {
            return 'invert(0%)'
        } else {
            return 'invert(100%)'
        }
    } else {
        if (props.isSectionConditional) {
            return 'invert(100%)'
        } else {
            return 'invert(0%)'
        }
    }
}

export default styled(({isInitial, isSectionConditional, ...rest}) => <img {...rest}/>)`
    max-width: 70px;
    max-height: 70px;
    filter: ${props=> getImageFilter(props)};
`