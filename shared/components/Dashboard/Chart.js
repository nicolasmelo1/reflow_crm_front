import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
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
import formatNumber from '../../utils/formatNumber'


let WebView;
if(process.env['APP'] !== 'web') {
    WebView = require('react-native-webview').WebView
}
/**
 * Since we render the totals the same way on the card and on the popover
 * we created this handy component, so you don't have to repeat code.
 * 
 * @param {Array<Object>} totals - The totals are an array, for fields that are number
 * we retrieve just one total element, but for fields that are not number, we count each 
 * occurence.
 */
const Totals = (props) => {
    const values = props.values.map(value=> {
        if (props.numberFormat) {
            if (props.numberFormat.decimal_separator) {
                value = value.toString().replace('.', props.numberFormat.decimal_separator)
            } else {
                value = value.toString().split('.')[0]
            }
            return formatNumber(value, props.numberFormat)
        } else {
            return value
        }
    })

    const renderMobile = () => (
        <View>
            {props.values.map((__, index) => (
                <ChartTotalLabelContainer key={index} hasBorderBottom={index < props.values.length-1}>
                    <ChartTotalLabel>
                        {props.labels[index]}
                    </ChartTotalLabel>
                    <ChartTotalLabel isTotal={true}>
                        {values[index]}
                    </ChartTotalLabel>
                </ChartTotalLabelContainer>
            ))}
        </View>
    )

    const renderWeb = () => (
        <div>
            {props.values.map((__, index) => (
                <ChartTotalLabelContainer key={index} hasBorderBottom={index < props.values.length-1}>
                    <ChartTotalLabel>
                        {props.labels[index]}
                    </ChartTotalLabel>
                    <ChartTotalLabel isTotal={true}>
                        {values[index]}
                    </ChartTotalLabel>
                </ChartTotalLabelContainer>
            ))}
        </div>
    )

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
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
    //const [jsToInject, setJsToInject] = useState('')
    const chartjsTypes = ['bar', 'pie', 'line']
    const valuesRef = React.useRef(null)
    const labelsRef = React.useRef(null)
    const chartTypeRef = React.useRef(null)
    const numberFormatRef = React.useRef(null)
    const canvasRef = React.useRef(null)
    const chartRef = React.useRef(null)
    const hasRenderedChartJSRef = React.useRef(false)


    const getJsToInjectInWebview = (gettingOnRender=false) => {
        if ((gettingOnRender && !hasRenderedChartJSRef.current) || !gettingOnRender) {
            const maintainAspectRatio = (typeof props.maintainAspectRatio !== 'undefined') ? props.maintainAspectRatio : true
            const numberFormat = (props.numberFormat) ? props.numberFormat : null
            return `
                eval(atob("${require('../../../mobile/assets/js/Chart.min.js').default}"));
                ${formatNumber.toString()}
                ${chart.toString()
                    .replace(/_formatNumber\.default/g, 'formatNumber')
                    .replace(/_chart\.default/g, 'Chart')
                    .replace(/_objectSpread/g, 'Object.assign')}
                var ctx = document.getElementById('chart');
                if (myChart) {
                    myChart.destroy()
                }
                var myChart = chart(ctx, '${props.chartType}',  [${props.labels.map(label=> `'${label}'`)}],  [${props.values}], ${JSON.stringify(numberFormat)}, false)
            `
        }
    }
    const addChartJs = () => {
        if(process.env['APP'] === 'web') {
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
        } else {
            if (chartRef.current) {
                chartRef.current.injectJavaScript(getJsToInjectInWebview())
            }
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

    const renderChartMobile = () => (
        <WebView
            ref={chartRef}
            originWhitelist={['*']}
            scrollEnabled={typeof props.maintainAspectRatio !== 'undefined'}
            javaScriptEnabled={true}
            injectedJavaScript={getJsToInjectInWebview(true)}
            source={{html: `
            <html>
                <head>
                    <meta charset="utf-8">
                    <meta http-equiv="Content-type" content="text/html; charset=utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <style type="text/css">
                        body {
                            margin: 0;
                            padding: 0;
                            min-width: 250px;
                            min-height: 100vh;
                        }
                        .chart-container{
                            position: relative;
                            overflow-y: auto;
                            height: 100%;
                        }
                    </style>
                </head>
    
                <body>
                    <div id="chart-container" class="chart-container">
                        <canvas id="chart" class="chart"></canvas>
                    </div>
                </body>
                <script>
                </script>
            </html>
            ` }}
        />    
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
                    <Totals labels={props.labels} values={props.values} numberFormat={props.numberFormat}/>
                </ChartTotalContent>
            </OverlayTrigger>
        </ChartTotalContainer>
    )
    
    const renderTotalMobile = () => (
        <ChartTotalContainer>
            <ChartTotalContent>
                <Totals labels={props.labels} values={props.values} numberFormat={props.numberFormat}/>
            </ChartTotalContent>
        </ChartTotalContainer>
    )
    const renderMobile = () => {
        return ['bar', 'pie', 'line'].includes(props.chartType) ? renderChartMobile() : renderTotalMobile()
    }

    const renderWeb = () => {
        return ['bar', 'pie', 'line'].includes(props.chartType) ? renderChartWeb() : renderTotalWeb()
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default Chart