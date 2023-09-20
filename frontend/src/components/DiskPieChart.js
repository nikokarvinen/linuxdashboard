import React from 'react'
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
} from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

// Custom tooltip component
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const roundedValue = parseFloat(payload[0].value).toFixed(2) // Round to 2 decimal places
    const additionalStyle =
      payload[0].name === 'Used' ? { marginTop: '-20px' } : {}
    return (
      <div className="custom-tooltip" style={{ ...additionalStyle }}>
        <p>{`${payload[0].name} : ${roundedValue}G`}</p>
      </div>
    )
  }
  return null
}

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
  } = props
  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)

  // Decide text anchor based on the quadrant
  const textAnchor = cos >= 0 ? 'start' : 'end'

  // Handle NaN percentage
  const displayPercent = isNaN(percent)
    ? 'Unknown'
    : `${(percent * 100).toFixed(2)}%`

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <text
        x={cx + (outerRadius + 10) * cos}
        y={cy + (outerRadius + 10) * sin}
        fill={fill}
        textAnchor={textAnchor} // Apply the anchor
        dominantBaseline="central"
      >
        {`${payload.name} : ${displayPercent}`}
      </text>
    </g>
  )
}

const formatData = (diskData) => {
  return diskData.map((entry) => ({
    name: entry.name,
    value: entry.value,
    label: `${entry.name} ${entry.value}G`,
  }))
}

const DiskPieChart = ({ diskData }) => {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const onPieEnter = (data, index) => {
    setActiveIndex(index)
  }

  const formattedData = formatData(diskData)

  return (
    <div style={{ textAlign: 'left' }}>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={formattedData}
            cx="30%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={onPieEnter}
          >
            {formattedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} /> {/* Custom Tooltip */}
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default DiskPieChart
