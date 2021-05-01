import formatNumber from './formatNumber'
import dynamicImport from './dynamicImport'

let ChartModule = dynamicImport('chart.js', '')
ChartModule = ChartModule ? ChartModule : {}

const Chart = ChartModule?.Chart
const ArcElement = ChartModule?.ArcElement
const LineElement = ChartModule?.LineElement
const BarElement = ChartModule?.BarElement
const PointElement = ChartModule?.PointElement
const BarController = ChartModule?.BarController
const BubbleController = ChartModule?.BubbleController
const DoughnutController = ChartModule?.DoughnutController
const LineController = ChartModule?.LineController
const PieController = ChartModule?.PieController
const PolarAreaController = ChartModule?.PolarAreaController
const RadarController = ChartModule?.RadarController
const ScatterController = ChartModule?.ScatterController
const CategoryScale = ChartModule?.CategoryScale
const LinearScale = ChartModule?.LinearScale
const LogarithmicScale = ChartModule?.LogarithmicScale
const RadialLinearScale = ChartModule?.RadialLinearScale
const TimeScale = ChartModule?.TimeScale
const TimeSeriesScale = ChartModule?.TimeSeriesScale
const Decimation = ChartModule?.Decimation
const Filler = ChartModule?.Filler
const Legend = ChartModule?.Legend
const Title = ChartModule?.Title
const Tooltip = ChartModule?.Tooltip

Chart.register(
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip
)

const chart = (context, type, labels, values, numberFormat=null, maintainAspectRatio=true) => {
    let possibleColors = [
        '#f2f2f2',
        '#0DBF7E',
        '#17242D',
        '#bfbfbf', 
        '#856A5D', 
        '#CCC9E7', 
        '#D8CBC7',
        '#33673B',
        '#FCDDBC',
        '#FFE6A7',
        '#DCEDFF',
        '#94B0DA', 
        '#127475', 
        '#F2542D',
        '#B95F89',
        '#414288',
        '#F038FF',
        '#643A71'
    ]

    let colors = Array.from(possibleColors)
    const defineColors = () => {
        let colors = Array.from(possibleColors)
        let count = 0
        return values.map(__=> {
            //const indexToRemove = Math.floor(Math.random() * colors.length)
            if (typeof(colors[count]) === 'undefined') {
                count = 0
            }
            const color = colors[count].toString().slice(0)
            count++
            return color
        })
    } 

    const defaultOptions = {
        maintainAspectRatio: maintainAspectRatio,
        title: {
            display: false
        },
        tooltips: {
            callbacks: {
                title: (tooltipItem, data) => {
                    return data?.labels[tooltipItem[0].index]
                },
                label: (tooltipItem, data) => {
                    data = (data?.datasets[0]?.data) ? data.datasets[0].data : []
                    if (numberFormat) {
                        let value = ''
                        if (numberFormat.decimal_separator) {
                            value = data[tooltipItem.index].toString().replace('.', numberFormat.decimal_separator)
                        } else {
                            value = data[tooltipItem.index].toString().split('.')[0]
                        }
                        return formatNumber(value, numberFormat)
                    } else {
                        return data[tooltipItem.index]
                    }
                }
            }
        }
    }

    const datasetOptions = {
        line: {
            fill: false,
            borderColor:colors[Math.floor(Math.random() * colors.length)]
        },
        bar: {
            backgroundColor: defineColors()
        },
        pie: {
            backgroundColor: defineColors()
        }
    }
    
    const options = {
        line: {
            ...defaultOptions,
            plugins: {
                legend: {
                    display: false
                }
            },
            elements: {
                line: {
                    tension: 0 // disables bezier curves
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        callback: (value, index, values) => {
                            if (numberFormat) {
                                if (numberFormat.decimal_separator) {
                                    value = value.toString().replace('.', numberFormat.decimal_separator)
                                } else {
                                    value = value.toString().split('.')[0]
                                }
                                return formatNumber(value, numberFormat)
                            } else {
                                return value
                            }
                        }
                    }
                }]
            }
        }, 
        bar: {
            ...defaultOptions,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        callback: (value, index, values) => {
                            if (numberFormat) {
                                if (numberFormat.decimal_separator) {
                                    value = value.toString().replace('.', numberFormat.decimal_separator)
                                } else {
                                    value = value.toString().split('.')[0] 
                                }
                                return formatNumber(value, numberFormat)
                            } else {
                                return value
                            }
                        }
                    }
                }]
            }
        },
        pie: {
            ...defaultOptions,
        }
    }

    return new Chart(
        context,
        { 
            type: type,
            data: {
                labels: labels,
                datasets: [{
                    ...datasetOptions[type],
                    data: values
                }]
            },
            options: options[type]
        }
    )
}

export default chart