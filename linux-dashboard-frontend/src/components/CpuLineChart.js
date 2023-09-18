import React from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const CpuLineChart = ({ cpuData }) => {
  console.log('CpuData in CpuLineChart:', cpuData)

  return (
    <LineChart width={500} height={300} data={cpuData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis
        label={{ value: 'CPU Usage (%)', angle: -90, position: 'insideLeft' }}
      />{' '}
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="cpuUsage"
        stroke="#8884d8"
        activeDot={{ r: 8 }}
      />
    </LineChart>
  )
}

export default CpuLineChart
