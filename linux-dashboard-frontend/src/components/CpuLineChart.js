import { Box } from '@mui/material'
import moment from 'moment'
import React from 'react'
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

// Function to format date-time for the X-axis labels
const formatDateTick = (tickItem) => {
  return moment(tickItem).format('HH:mm') // Format the time as HH:mm
}

// Custom tooltip to make time display in a more readable format
const CustomTooltip = ({ payload, label, active }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`Time: ${moment(label).format('HH:mm')}`}</p>
        <p className="intro">{`CPU Usage: ${payload[0].value}`}</p>
      </div>
    )
  }
  return null
}

const CpuLineChart = ({ cpuData }) => {
  return (
    <Box>
      <LineChart width={500} height={300} data={cpuData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tickFormatter={formatDateTick} />
        <YAxis
          label={{ value: 'CPU Usage (%)', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Brush dataKey="name" height={30} stroke="#8884d8" />
        <Line
          type="monotone"
          dataKey="cpuUsage"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </Box>
  )
}

export default CpuLineChart
