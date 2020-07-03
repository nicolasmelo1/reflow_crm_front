import React, { useEffect } from 'react'
import { View } from 'react-native'
import charts from '../../utils/charts'
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


/**
 * {Description of your component, what does it do}
 * @param {String} labels - {go in detail about every prop it recieves}
 * @param {String} values - {go in detail about every prop it recieves}
 * @param {String} chartType - {go in detail about every prop it recieves}
 */
const Chart = (props) => {
    const chartjsTypes = ['bar', 'pie', 'line']
    const canvasRef = React.useRef(null)
    const chartRef = React.useRef(null)

    const addChartJs = () => {
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
        if (chartRef.current) {
            chartRef.current.destroy()
            chartRef.current = null
        } 
        addChartJs()
    }, [props.chartType, props.numberFormat, props.labels, props.values])

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <ChartContainer maintainAspectRatio={props.maintainAspectRatio}>
                {['bar', 'pie', 'line'].includes(props.chartType) ? (
                    <canvas ref={canvasRef}/>
                ) : (
                    <ChartTotalContainer>
                        <ChartTotalContent>
                            <Totals labels={props.labels} values={props.values}/>
                        </ChartTotalContent>
                  </ChartTotalContainer>  
                )}
            </ChartContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default Chart