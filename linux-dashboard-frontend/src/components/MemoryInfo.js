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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'

const MemoryInfo = () => {
  const [memoryData, setMemoryData] = useState(null)
  const [isAccordionExpanded, setAccordionExpanded] = useState(true)

  const fetchMemoryData = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/memory')
      setMemoryData(response.data.data)
    } catch (error) {
      console.error('An error occurred while fetching memory info:', error)
    }
  }, [])

  useEffect(() => {
    fetchMemoryData()
  }, [fetchMemoryData])

  const handleAccordionToggle = (event, newExpandedState) => {
    setAccordionExpanded(newExpandedState)
  }

  const handleRefresh = (event) => {
    event.stopPropagation()
    fetchMemoryData()
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
        marginBottom: '17px',
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
              <MemoryIcon /> Memory Info
            </Typography>
            <Tooltip title="Memory Info displays the current memory usage of the system.">
              <InfoIcon fontSize="small" style={{ marginLeft: '8px' }} />
            </Tooltip>
          </Box>
          <Box>
            <IconButton onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
          </Box>
        </Box>
      </AccordionSummary>

      <AccordionDetails style={{ padding: '8px', textAlign: 'left' }}>
        <Paper elevation={0} style={{ width: '100%', padding: '8px' }}>
          {!memoryData ? (
            <Box display="flex" justifyContent="center" alignItems="center">
              <CircularProgress />
              <Typography variant="body1" style={{ marginLeft: '16px' }}>
                Loading memory data...
              </Typography>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Total Memory</TableCell>
                  <TableCell>Used Memory</TableCell>
                  <TableCell>Free Memory</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{memoryData.total} MB</TableCell>
                  <TableCell>{memoryData.used} MB</TableCell>
                  <TableCell>{memoryData.free} MB</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </Paper>
      </AccordionDetails>
    </Accordion>
  )
}

export default MemoryInfo
