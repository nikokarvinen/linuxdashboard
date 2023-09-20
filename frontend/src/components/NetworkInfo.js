import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import InfoIcon from '@mui/icons-material/Info'
import RefreshIcon from '@mui/icons-material/Refresh'
import WifiIcon from '@mui/icons-material/Wifi'
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

const NetworkInfo = () => {
  const [networkInfo, setNetworkInfo] = useState(null)
  const [isAccordionExpanded, setAccordionExpanded] = useState(true)

  const fetchNetworkData = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/network')
      setNetworkInfo(response.data.data)
    } catch (error) {
      console.error('An error occurred while fetching network info:', error)
    }
  }, [])

  useEffect(() => {
    fetchNetworkData()
  }, [fetchNetworkData])

  const handleAccordionToggle = (event, newExpandedState) => {
    setAccordionExpanded(newExpandedState)
  }

  const handleRefresh = (event) => {
    event.stopPropagation()
    fetchNetworkData()
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
              <WifiIcon /> Network Interfaces
            </Typography>
            <Tooltip title="Network Interfaces displays the active network interfaces and their IP addresses.">
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
          {networkInfo === null ? (
            <Box display="flex" justifyContent="center" alignItems="center">
              <CircularProgress />
              <Typography variant="body1" style={{ marginLeft: '16px' }}>
                Loading network data...
              </Typography>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>IP Address</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {networkInfo.map((network, index) => (
                  <TableRow key={index}>
                    <TableCell>{network.name}</TableCell>
                    <TableCell>{network.inet}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>
      </AccordionDetails>
    </Accordion>
  )
}

export default NetworkInfo
