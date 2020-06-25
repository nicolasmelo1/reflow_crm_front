import Chart from 'chart.js'

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

const chart = (context, type, labels, values) => {
    const datasetOptions = {
        line: {
            fill: false,
            borderColor:possibleColors[Math.floor(Math.random() * possibleColors.length)]
        },
        bar: {
            backgroundColor: values.map(__=>possibleColors[Math.floor(Math.random() * possibleColors.length)])
        },
        pie: {
            backgroundColor: values.map(__=>possibleColors[Math.floor(Math.random() * possibleColors.length)])
        }
    }
    const options = {
        line: {
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }, 
        bar: {
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        },
        pie: {}
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