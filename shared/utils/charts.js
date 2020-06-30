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
    let colors = Array.from(possibleColors)
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
            title: {
                display: true,
                text: 'Exemplo'
            },
            legend: {
                display: false
            },
            tooltips: {
                callbacks: {
                    label: (tooltipItem, data) => {
                        return '$ ' + tooltipItem.value
                    }
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        callback: (value, index, values) => {
                            return '$ ' + value
                        }
                    }
                }]
            },
            elements: {
                line: {
                    tension: 0 // disables bezier curves
                }
            }
        }, 
        bar: {
            title: {
                display: true,
                text: 'Exemplo'
            },
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
        pie: {
            title: {
                display: true,
                text: 'Exemplo'
            }
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