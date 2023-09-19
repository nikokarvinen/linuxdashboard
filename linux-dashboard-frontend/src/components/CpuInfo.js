import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MemoryIcon from '@mui/icons-material/Memory'
import RefreshIcon from '@mui/icons-material/Refresh'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Typography,
} from '@mui/material'
import axios from 'axios'
import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'
import CpuLineChart from './CpuLineChart'

const CpuInfo = () => {
  const [cpuInfo, setCpuInfo] = useState(null)
  const [cpuData, setCpuData] = useState([])
  const [timeRange, setTimeRange] = useState(60)
  const [isAccordionExpanded, setAccordionExpanded] = useState(true)

  const fetchCpuData = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/cpu?timeRange=${timeRange}`
      )

      setCpuInfo(response.data.data)
      setCpuData(response.data.cpuData.slice(-timeRange)) // Take the last 'timeRange' number of elements
    } catch (error) {
      console.error('An error occurred while fetching CPU data:', error)
    }
  }, [timeRange])

  useEffect(() => {
    fetchCpuData()
    const intervalId = setInterval(fetchCpuData, 60 * 1000)
    return () => clearInterval(intervalId)
  }, [fetchCpuData])

  const handleAccordionToggle = (event, newExpandedState) => {
    setAccordionExpanded(newExpandedState)
  }

  const handleRefresh = (event) => {
    event.stopPropagation() // Stop the event from propagating to parent components
    fetchCpuData()
  }

  const handleTimeRangeChange = (event) => {
    event.stopPropagation() // Stop the event from propagating to parent components
    setTimeRange(event.target.value)
  }

  return (
    <Accordion
      expanded={isAccordionExpanded}
      onChange={handleAccordionToggle}
      elevation={3}
      style={{
        marginTop: '16px',
        padding: '0',
        width: '80%',
        margin: '0 auto',
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <Typography variant="h5">
            <MemoryIcon /> CPU Info
          </Typography>
          <IconButton onClick={handleRefresh}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </AccordionSummary>
      <AccordionDetails style={{ padding: '8px', textAlign: 'left' }}>
        <Paper elevation={0} style={{ width: '100%', padding: '8px' }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            {/* Added width to make the select box smaller */}
            <Select
              value={timeRange}
              onChange={handleTimeRangeChange}
              style={{ width: '166px', height: '35px' }}
            >
              <MenuItem value={5}>Last 5 minutes</MenuItem>
              <MenuItem value={30}>Last 30 minutes</MenuItem>
              <MenuItem value={60}>Last 60 minutes</MenuItem>
            </Select>
            <div></div> {/* Empty div for spacing */}
          </Box>
          <Typography
            variant="body1"
            style={{ marginBottom: '8px', marginTop: '8px' }}
          >
            <strong>Architecture:</strong> {cpuInfo?.Architecture}
          </Typography>
          <Typography variant="body2" style={{ marginBottom: '16px' }}>
            <strong>Latest Time:</strong>{' '}
            {moment(
              cpuData.length > 0 ? cpuData[cpuData.length - 1].name : ''
            ).format('HH:mm:ss')}
          </Typography>
          {cpuData.length > 0 ? (
            <Box display="flex" justifyContent="left">
              <CpuLineChart cpuData={cpuData} timeRange={timeRange} />
            </Box>
          ) : (
            <Typography variant="body1">
              No CPU usage data available.
            </Typography>
          )}
        </Paper>
      </AccordionDetails>
    </Accordion>
  )
}

export default CpuInfo
