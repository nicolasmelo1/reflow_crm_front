import styled from 'styled-components'

const getBackgroundColor = (props) => {
    if (props.isInitial) {
        if (props.isSectionConditional) {
            return '#fff'
        } else {
            return '#20253F'
        }
    } else {
        return 'transparent'
    }
}

const getBoxShadow = (props) => {
    if (props.isInitial) {
        if (props.isSectionConditional) {
            return '#f2f2f2 0px 3px 3px -2px, #f2f2f2 0px 3px 4px 0px, #f2f2f2 0px 1px 8px 0px'
        } else {
            return '#20253F 0px 3px 3px -2px, #20253F 0px 3px 4px 0px, #20253F 0px 1px 8px 0px'
        }
    } else {
        return '0'
    }
}


const getBorder = (props) => {
    if (props.isInitial) {
        if (props.isSectionConditional) {
            return '1px solid #20253F'
        } else {
            return '1px solid #fff'
        }
    } else {
        return '0'
    }
}

export default styled(({isInitial, isSectionConditional, ...rest}) => <label {...rest}/>)`
    box-shadow: ${props=> getBoxShadow(props)};
    background-color: ${props => getBackgroundColor(props)};
    border: ${props=> getBorder(props)};
    text-align: center;
    height: 100%;
    font-size: 11px;
    padding:5px;
    cursor: pointer;
    border-radius: 10px;
    margin: 0;
`