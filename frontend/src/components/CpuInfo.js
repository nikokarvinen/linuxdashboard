import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import InfoIcon from '@mui/icons-material/Info'
import MemoryIcon from '@mui/icons-material/Memory'
import RefreshIcon from '@mui/icons-material/Refresh'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CircularProgress,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Typography,
} from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import axios from 'axios'
import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'
import CpuLineChart from './CpuLineChart'

const CpuInfo = () => {
  // State for holding CPU information and data
  const [cpuInfo, setCpuInfo] = useState(null)
  const [cpuData, setCpuData] = useState([])
  const [timeRange, setTimeRange] = useState(5)
  const [isAccordionExpanded, setAccordionExpanded] = useState(true)
  const [error, setError] = useState(null) // Added for error handling

  // Fetch CPU Data
  const fetchCpuData = useCallback(async () => {
    try {
      setError(null) // Reset error before fetching
      const { data } = await axios.get(
        `http://localhost:5000/cpu?timeRange=${timeRange}`
      )
      const { data: cpuInfoData, cpuData: cpuDataArray } = data

      setCpuInfo(cpuInfoData)
      setCpuData(cpuDataArray.slice(-timeRange))
    } catch (error) {
      console.error('An error occurred while fetching CPU data:', error)
      setError('Failed to fetch CPU data.') // Setting error state
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
    event.stopPropagation()
    fetchCpuData()
  }

  const handleTimeRangeChange = (event) => {
    event.stopPropagation()
    setTimeRange(event.target.value)
  }

  return (
    <Accordion
      expanded={isAccordionExpanded}
      onChange={handleAccordionToggle}
      elevation={3}
      style={{
        marginTop: '16px',
        marginBottom: '17px',
        padding: '0',
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <Box display="flex" alignItems="center">
            <Typography variant="h5">
              <MemoryIcon /> CPU Info
            </Typography>
            <Tooltip title="The CPU Info section provides information on the CPU architecture and its performance over a specified time range.">
              <InfoIcon fontSize="small" style={{ marginLeft: '8px' }} />
            </Tooltip>
          </Box>
          <IconButton onClick={handleRefresh}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </AccordionSummary>

      <AccordionDetails style={{ padding: '8px', textAlign: 'left' }}>
        <Paper elevation={0} style={{ width: '100%', padding: '8px' }}>
          {/* Check if there's an error */}
          {error ? (
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          ) : (
            <>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Select
                  value={timeRange}
                  onChange={handleTimeRangeChange}
                  style={{ width: '166px', height: '35px' }}
                >
                  <MenuItem value={5}>Last 5 minutes</MenuItem>
                  <MenuItem value={30}>Last 30 minutes</MenuItem>
                  <MenuItem value={60}>Last 60 minutes</MenuItem>
                </Select>
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
                <Box display="flex" justifyContent="center" alignItems="center">
                  <CircularProgress />
                  <Typography variant="body1" style={{ marginLeft: '16px' }}>
                    Loading CPU data...
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Paper>
      </AccordionDetails>
    </Accordion>
  )
}

export default CpuInfo
