import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import charts from '../../utils/charts'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const DashboardConfiguration = (props) => {
    const buildChart = React.useRef(null)
    const chart = React.useRef(null)
    const [chartType, setChartType] = useState('bar')

    const changeChargeType = () => {
        if (chart.current) {
            chart.current.destroy()
        }
        chart.current = charts(buildChart.current, chartType, ['Jan', 'Fev', 'Mar'], [10, 20, 30])
    }

    useEffect(() => {
        if (buildChart.current) {
            changeChargeType()
        }
    })

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <div>
                <button onClick={e=>{setChartType('bar')}}>Barra</button>
                <button onClick={e=>{setChartType('line')}}>Line</button>
                <button onClick={e=>{setChartType('pie')}}>Pie</button>
                <canvas width="400" height="400" ref={buildChart}/>
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default DashboardConfiguration