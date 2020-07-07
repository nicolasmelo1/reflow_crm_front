import React, { useEffect } from 'react'
import { View } from 'react-native'
import { OverlayTrigger, Popover } from 'react-bootstrap'
import charts from '../../utils/charts'
import isEqual from '../../utils/isEqual'
import { 
    ChartContainer,
    ChartTotalContainer,
    ChartTotalContent,
    ChartTotalLabel,
    ChartTotalLabelContainer
} from '../../styles/Dashboard'
import chart from '../../utils/charts'



/**
 * Since we render the totals the same way on the card and on the popover
 * we created this handy component, so you don't have to repeat code.
 * 
 * @param {Array<Object>} totals - The totals are an array, for fields that are number
 * we retrieve just one total element, but for fields that are not number, we count each 
 * occurence.
 */
const Totals = (props) => {
    return (
        <div>
            {props.values.map((__, index) => (
                <ChartTotalLabelContainer key={index} hasBorderBottom={index < props.values.length-1}>
                    <ChartTotalLabel>
                        {props.labels[index]}
                    </ChartTotalLabel>
                    <ChartTotalLabel isTotal={true}>
                        {props.values[index]}
                    </ChartTotalLabel>
                </ChartTotalLabelContainer>
            ))}
        </div>
    )
}

const PopoverWithTotals = React.forwardRef((props, ref) => {
    return (
        <Popover ref={ref} {...props}>
            <Popover.Content>
                {props.labels && props.values ? (<Totals labels={props.labels} values={props.values}/>): ''}
            </Popover.Content>
        </Popover>
    )
})


/**
 * {Description of your component, what does it do}
 * @param {String} labels - {go in detail about every prop it recieves}
 * @param {String} values - {go in detail about every prop it recieves}
 * @param {String} chartType - {go in detail about every prop it recieves}
 */
const Chart = (props) => {
    const chartjsTypes = ['bar', 'pie', 'line']
    const valuesRef = React.useRef(null)
    const labelsRef = React.useRef(null)
    const chartTypeRef = React.useRef(null)
    const numberFormatRef = React.useRef(null)
    const canvasRef = React.useRef(null)
    const chartRef = React.useRef(null)

    const addChartJs = () => {
        chartTypeRef.current = props.chartType
        numberFormatRef.current = props.numberFormat
        labelsRef.current = props.labels
        valuesRef.current = props.values
        if (chartRef.current) {
            chartRef.current.destroy()
            chartRef.current = null
        }
        if (chartjsTypes.includes(props.chartType) && chartRef.current === null) {
            const maintainAspectRatio = (typeof props.maintainAspectRatio !== 'undefined') ? props.maintainAspectRatio : true
            const numberFormat = (props.numberFormat) ? props.numberFormat : null
            chartRef.current = charts(canvasRef.current, props.chartType, props.labels, props.values, numberFormat, maintainAspectRatio)
        }
    }

    useEffect(() => {
        addChartJs()
    }, [])

    useEffect(() => {
        if (
            chartTypeRef.current !== props.chartType || 
            numberFormatRef.current !== props.numberFormat ||
            !isEqual(labelsRef.current, props.labels) ||
            !isEqual(valuesRef.current, props.values)
        ) {
            addChartJs()
        }
    }, [props.chartType, props.numberFormat, props.labels, props.values])

    const renderChartWeb = () => (
        <ChartContainer maintainAspectRatio={props.maintainAspectRatio}>
            <canvas ref={canvasRef}/>
        </ChartContainer>
    )

    const renderTotalWeb = () => (
        <ChartTotalContainer>
            <OverlayTrigger 
            trigger="click" 
            placement="bottom" 
            rootClose={true}
            delay={{ show: 250, hide: 100 }} 
            overlay={<PopoverWithTotals labels={props.labels} values={props.values}/>}
            popperConfig={{
                modifiers: {
                    preventOverflow: {
                        boundariesElement: 'offsetParent'
                    }
                }
            }} 
            >
                <ChartTotalContent>
                    <Totals labels={props.labels} values={props.values}/>
                </ChartTotalContent>
            </OverlayTrigger>
        </ChartTotalContainer>
    )

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return ['bar', 'pie', 'line'].includes(props.chartType) ? renderChartWeb() : renderTotalWeb()
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default Chart