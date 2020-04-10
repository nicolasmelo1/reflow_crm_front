import styled from 'styled-components'

const getBackgroundColor = (props) => {
    if (props.isSelectedDay && props.isCurrentMonth) {
        return getBorderAndBackgroundColor(props.isDarkBackground)
    } else if (props.inBetweenDate && props.isCurrentMonth) {
        return '#bfbfbf'
    }
}

const getBorderAndBackgroundColor = (isDarkBackground) => {
    return isDarkBackground ? '#fff': '#444'
}

export default styled.td`
    text-align: center !important;
    padding: 5px 2px;
    font-size: 14px;
    color: ${props=> props.isCurrentMonth ? '#0dbf7e' : '#bfbfbf'};
    background-color: ${props=> getBackgroundColor(props)};
    border-bottom: ${props=> props.isToday ? `1px solid ${getBorderAndBackgroundColor(props.isDarkBackground)}` : 'none'};
    cursor: pointer;
    width: 14.2857142857%;
    &:hover {
        background-color: ${props=>props.isDarkBackground ? '#ccc':'#999'};
    }
`