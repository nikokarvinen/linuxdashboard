import React from 'react'
import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const formatData = (diskData) => {
  return diskData.map((entry) => ({
    name: entry.name,
    value: entry.value,
    label: `${entry.name} ${entry.value}G`,
  }))
}

const DiskPieChart = ({ diskData }) => {
  const formattedData = formatData(diskData)

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={formattedData}
        cx={200}
        cy={200}
        labelLine={false}
        outerRadius={100}
        fill="#8884d8"
        dataKey="value"
      >
        {formattedData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip formatter={(value) => `${value}G`} />{' '}
      {/* Näyttää arvot yksiköinä tooltipissa */}
      <Legend />
    </PieChart>
  )
}

export default DiskPieChart
