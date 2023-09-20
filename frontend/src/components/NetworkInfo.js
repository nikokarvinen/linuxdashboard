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
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { styled } from '@mui/system'
import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'

const useStyles = styled({
  accordion: {
    marginTop: '16px',
    marginBottom: '17px',
    padding: '0',
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  infoIcon: {
    marginLeft: '8px',
  },
  filterTextField: {
    marginBottom: '16px',
  },
})

const NetworkInfo = () => {
  const classes = useStyles()
  const [networkInfo, setNetworkInfo] = useState([])
  const [sortedInfo, setSortedInfo] = useState([])
  const [isAccordionExpanded, setAccordionExpanded] = useState(true)
  const [filter, setFilter] = useState('')

  const fetchNetworkData = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/network')
      setNetworkInfo(response.data.data)
      setSortedInfo(response.data.data)
    } catch (error) {
      console.error('An error occurred while fetching network info:', error)
    }
  }, [])

  useEffect(() => {
    fetchNetworkData()
    const intervalId = setInterval(fetchNetworkData, 5000)
    return () => clearInterval(intervalId)
  }, [fetchNetworkData])

  const handleAccordionToggle = (event, newExpandedState) => {
    setAccordionExpanded(newExpandedState)
  }

  const handleRefresh = (event) => {
    event.stopPropagation()
    fetchNetworkData()
  }

  const handleFilterChange = (e) => {
    const text = e.target.value
    setFilter(text)
    setSortedInfo(
      networkInfo.filter((info) =>
        info.name.toLowerCase().includes(text.toLowerCase())
      )
    )
  }

  const handleSortByName = () => {
    const sorted = [...sortedInfo].sort((a, b) => a.name.localeCompare(b.name))
    setSortedInfo(sorted)
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
              <WifiIcon /> Network Interfaces
            </Typography>
            <Tooltip title="Network Interfaces displays the active network interfaces and their detailed metrics.">
              <InfoIcon fontSize="small" className={classes.infoIcon} />
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
          <TextField
            label="Filter by name"
            value={filter}
            onChange={handleFilterChange}
            className={classes.filterTextField}
          />
          <IconButton onClick={handleSortByName}>Sort by Name</IconButton>
          {networkInfo.length === 0 ? (
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
                  <TableCell>Received Bytes</TableCell>
                  <TableCell>Received Packets</TableCell>
                  <TableCell>Transmitted Bytes</TableCell>
                  <TableCell>Transmitted Packets</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedInfo.map((network) => (
                  <TableRow key={network.name}>
                    <TableCell>{network.name}</TableCell>
                    <TableCell>{network.rxBytes}</TableCell>
                    <TableCell>{network.rxPackets}</TableCell>
                    <TableCell>{network.txBytes}</TableCell>
                    <TableCell>{network.txPackets}</TableCell>
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
