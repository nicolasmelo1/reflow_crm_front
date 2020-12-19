import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { OverlayTrigger, Popover } from 'react-bootstrap'
import charts from '../../utils/charts'
import isEqual from '../../utils/isEqual'
import { 
    ChartContainer,
    ChartTotalContainer,
    ChartTotalContent,
    ChartTotalTitleLabel,
    ChartTotalLabel,
    ChartTotalLabelContainer
} from '../../styles/Dashboard'
import PopoverContent from '../../styles/PopoverContent'
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
                <ChartTotalLabelContainer key={index}>
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
                <ChartTotalLabelContainer key={index}>
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

const PopoverWithTotals = React.forwardRef(({labels, values, numberFormat, ...rest}, ref) => {
    return (
        <Popover ref={ref} {...rest}>
            <PopoverContent>
                {labels && values ? (<Totals labels={labels} values={values} numberFormat={numberFormat}/>): ''}
            </PopoverContent>
        </Popover>
    )
})


/**
 * This component is responsible for rendering everything about charts and totals.
 * For Totals this component render a total component created here, for charts this component renders
 * the graphical interface inside a canvas element using Charts.js library.
 * 
 * You might see that we don't use any lib to interface between charts.js and react. We handle it with 
 * a function in `utils` folder to make this interface. Since this function can grow in the near future it's 
 * important to make the function separate of the component. Also, make both things separate is exactly how we can inject the
 * charts.js in the webview on mobile.
 * 
 * Read for further explanation on the graphing library: https://www.chartjs.org/docs/latest/
 * 
 * @param {Array<String>} labels - The labels of the charts, usually this is an array with string elements.
 * with each element being the label. This array must be the same size of `values` props.
 * @param {Array<Float>|Array<BigInteger>} values - The values for each label, must be the same size of `label` props. For position
 * 0 of the `labels` we use element on the position 0 of `values` props array and so on.
 * @param {('card'|'pie'|'bar'|'line')} chartType - The type of the chart, for `pie`, `bar` and `line` we render the chart using
 * charts.js library. For `card` we render a simple card of totals, and don't use any lib.
 * @param {Boolean} maintainAspectRatio - Maintain aspect ratio of the chart. You might want to read this for reference:
 * https://www.chartjs.org/docs/latest/general/responsive.html
 * @param {Object} numberFormat - The object of the number format, that's how we will format numbers in the chart.
 * @param {String} chartName - (OPTIONAL) - This is only used in `card` chartType. This loads the title of the card inside of the card.
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

    const isToAddChartJs = () => {
        return chartTypeRef.current !== props.chartType || 
        numberFormatRef.current !== props.numberFormat ||
        !isEqual(labelsRef.current, props.labels) ||
        !isEqual(valuesRef.current, props.values)
    }

    // ONLY MOBILE.
    const getJsToInjectInWebview = (gettingOnRender=false) => {
        const numberFormat = (props.numberFormat) ? props.numberFormat : null
        return `
            if (typeof Chart === 'undefined') {
                eval(atob("${require('../../../mobile/assets/js/Chart.min.js').default}"));
            }
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

    const addChartJs = () => {
        chartTypeRef.current = props.chartType
        numberFormatRef.current = props.numberFormat
        labelsRef.current = props.labels
        valuesRef.current = props.values
        // web
        if(process.env['APP'] === 'web') {
            if (chartRef.current) {
                chartRef.current.destroy()
                chartRef.current = null
            }
            if (chartjsTypes.includes(props.chartType) && chartRef.current === null) {
                const maintainAspectRatio = (typeof props.maintainAspectRatio !== 'undefined') ? props.maintainAspectRatio : true
                const numberFormat = (props.numberFormat) ? props.numberFormat : null
                chartRef.current = charts(canvasRef.current, props.chartType, props.labels, props.values, numberFormat, maintainAspectRatio)
            }
        // mobile
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
        if (isToAddChartJs()) {
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
            injectedJavaScript={getJsToInjectInWebview()}
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
            placement="auto" 
            rootClose={true}
            delay={{ show: 250, hide: 100 }} 
            overlay={<PopoverWithTotals labels={props.labels} values={props.values} numberFormat={props.numberFormat}/>}
            popperConfig={{
                modifiers: [
                    {
                        name: 'preventOverflow',
                        options: {
                            altBoundary: true,
                        }
                    }
                ]
            }} 
            >
                <ChartTotalContent>
                    {props.chartName ? (
                        <ChartTotalTitleLabel>
                            {props.chartName}
                        </ChartTotalTitleLabel>
                    ) : ''}
                    <Totals labels={props.labels} values={props.values} numberFormat={props.numberFormat}/>
                </ChartTotalContent>
            </OverlayTrigger>
        </ChartTotalContainer>
    )
    
    const renderTotalMobile = () => (
        <ChartTotalContainer>
            <ChartTotalContent>
                {props.chartName ? (
                    <ChartTotalTitleLabel>
                        {props.chartName}
                    </ChartTotalTitleLabel>
                ) : null}
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