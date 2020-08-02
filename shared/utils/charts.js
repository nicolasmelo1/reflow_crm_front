import Chart from 'chart.js'
import formatNumber from './formatNumber'


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
        return values.map((__, index)=> {
            //const indexToRemove = Math.floor(Math.random() * colors.length)
            if (!colors[index]) {
                colors = Array.from(possibleColors)
            }
            const color = colors[index].toString().slice(0)
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
            legend: {
                display: false
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
            legend: {
                display: false
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