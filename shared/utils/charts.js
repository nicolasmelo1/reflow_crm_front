import Chart from 'chart.js'
import formatNumber from './formatNumber'


const possibleColors = [
    '#0dbf52', 
    '#0dbf60', 
    '#0dbfb9',
    '#0db6bf',
    '#0dbf43',
    '#0d98bf',
    '#0d89bf',
    '#0d7bbf',
    '#0dbf7f',
    '#0dbf6f', 
    '#0dbf7e', 
    '#0dbf8d', 
    '#0dbf9c',
    '#0dbfab',
    '#0db5bf',
    '#0da7bf',
    '#0dbfba', 
    '#0dbf61',
    '#0dbf26',
    '#0dbf34',
    '#21bf0d',
    '#12bf0d',
    '#0dbf17',
    '#0dbf35'
]

const chart = (context, type, labels, values, numberFormat=null) => {
    let colors = Array.from(possibleColors)
    const defaultOptions = {
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
                        const decimalSeparator = (numberFormat.decimal_separator) ? numberFormat.decimal_separator : '.'
                        const value = data[tooltipItem.index].toString().replace('.', decimalSeparator)
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
            backgroundColor: values.map(__=> {
                const indexToRemove = Math.floor(Math.random() * colors.length)
                const color = JSON.parse(JSON.stringify(colors[indexToRemove]))
                colors.splice(indexToRemove, 1)
                return color
            })
        },
        pie: {
            backgroundColor: values.map(__=> {
                const indexToRemove = Math.floor(Math.random() * colors.length)
                const color = JSON.parse(JSON.stringify(colors[indexToRemove]))
                colors.splice(indexToRemove, 1)
                return color
            })
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
                                const decimalSeparator = (numberFormat.decimal_separator) ? numberFormat.decimal_separator : '.'
                                value = value.toString().replace('.', decimalSeparator)
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
                                const decimalSeparator = (numberFormat.decimal_separator) ? numberFormat.decimal_separator : '.'
                                value = value.toString().replace('.', decimalSeparator)
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