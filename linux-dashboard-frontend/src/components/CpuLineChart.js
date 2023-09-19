import { Box } from '@mui/material'
import React, { useState } from 'react'
import {
  Brush,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const CpuLineChart = ({ cpuData }) => {
  const [lineVisibility, setLineVisibility] = useState(true)

  const toggleLine = () => {
    setLineVisibility(!lineVisibility)
    console.log('cpuData:', cpuData) // <-- Add this line for debugging
  }

  return (
    <Box>
      <button onClick={toggleLine}>
        {lineVisibility ? 'Hide' : 'Show'} Line
      </button>
      <LineChart width={500} height={300} data={cpuData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis
          label={{ value: 'CPU Usage (%)', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip />
        <Legend />
        <Brush dataKey="name" height={30} stroke="#8884d8" />
        {lineVisibility && (
          <Line
            type="monotone"
            dataKey="cpuUsage"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        )}
      </LineChart>
    </Box>
  )
}

export default CpuLineChart
