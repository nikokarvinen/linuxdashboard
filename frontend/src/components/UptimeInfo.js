import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import InfoIcon from '@mui/icons-material/Info'
import RefreshIcon from '@mui/icons-material/Refresh'
import TimerIcon from '@mui/icons-material/Timer'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CircularProgress,
  IconButton,
  LinearProgress,
  Paper,
  Typography,
} from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'

const formatUptime = (uptime) => {
  const days = Math.floor(uptime / (24 * 60 * 60))
  const hours = Math.floor((uptime % (24 * 60 * 60)) / (60 * 60))
  const minutes = Math.floor((uptime % (60 * 60)) / 60)
  const seconds = Math.floor(uptime % 60)

  return `${days}d ${hours}h ${minutes}m ${seconds}s`
}

const UptimeInfo = () => {
  const [uptime, setUptime] = useState(null)
  const [isAccordionExpanded, setAccordionExpanded] = useState(true)

  const fetchUptimeData = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/uptime')
      setUptime(response.data.data.uptime)
    } catch (error) {
      console.error('An error occurred while fetching uptime:', error)
    }
  }, [])

  useEffect(() => {
    fetchUptimeData()
    const intervalId = setInterval(fetchUptimeData, 1000)
    return () => clearInterval(intervalId)
  }, [fetchUptimeData])

  const handleAccordionToggle = (event, newExpandedState) => {
    setAccordionExpanded(newExpandedState)
  }

  const handleRefresh = (event) => {
    event.stopPropagation()
    fetchUptimeData()
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
              <TimerIcon /> System Uptime
            </Typography>
            <Tooltip title="Uptime represents the time for which the system has been running continuously.">
              <InfoIcon fontSize="small" style={{ marginLeft: '8px' }} />
            </Tooltip>
          </Box>
          <Box>
            <Tooltip title="Refresh">
              <IconButton onClick={handleRefresh}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </AccordionSummary>

      <AccordionDetails style={{ padding: '8px', textAlign: 'left' }}>
        <Paper elevation={0} style={{ width: '100%', padding: '8px' }}>
          {!uptime ? (
            <Box display="flex" justifyContent="center" alignItems="center">
              <CircularProgress />
              <Typography variant="body1" style={{ marginLeft: '16px' }}>
                Loading uptime data...
              </Typography>
            </Box>
          ) : (
            <>
              <Typography variant="body1">
                Uptime: {formatUptime(uptime)}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(uptime % 86400) / 864}
              />
            </>
          )}
        </Paper>
      </AccordionDetails>
    </Accordion>
  )
}

export default UptimeInfo
