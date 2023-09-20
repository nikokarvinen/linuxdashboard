import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import InfoIcon from '@mui/icons-material/Info'
import RefreshIcon from '@mui/icons-material/Refresh'
import StorageIcon from '@mui/icons-material/Storage'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import DiskPieChart from './DiskPieChart'

const DiskInfo = () => {
  const [diskInfo, setDiskInfo] = useState(null)
  const [diskData, setDiskData] = useState([])
  const [isAccordionExpanded, setAccordionExpanded] = useState(true)

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/disk')
      const diskData = response.data.data
      setDiskInfo(diskData)

      const calculatedFree = diskData.reduce(
        (total, { available }) => total + parseFloat(available),
        0
      )

      const calculatedUsed = diskData.reduce(
        (total, { used }) => total + parseFloat(used),
        0
      )

      setDiskData([
        { name: 'Free', value: calculatedFree },
        { name: 'Used', value: calculatedUsed },
      ])
    } catch (error) {
      console.error('An error occurred while fetching disk info:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAccordionToggle = (event, newExpandedState) => {
    setAccordionExpanded(newExpandedState)
  }

  const handleRefresh = (event) => {
    event.stopPropagation()
    fetchData()
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
              <StorageIcon /> Disk Info
            </Typography>
            <Tooltip title="Disk Info displays information about the available, used, and free disk space.">
              <InfoIcon fontSize="small" style={{ marginLeft: '8px' }} />
            </Tooltip>
          </Box>
          <IconButton onClick={handleRefresh}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </AccordionSummary>

      <AccordionDetails style={{ padding: '8px', textAlign: 'left' }}>
        {!diskInfo ? (
          <CircularProgress />
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Filesystem</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Used</TableCell>
                  <TableCell>Available</TableCell>
                  <TableCell>Use %</TableCell>
                  <TableCell>Mounted on</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {diskInfo.map((disk, index) => (
                  <TableRow key={index}>
                    <TableCell>{disk.filesystem}</TableCell>
                    <TableCell>{disk.size}</TableCell>
                    <TableCell>{disk.used}</TableCell>
                    <TableCell>{disk.available}</TableCell>
                    <TableCell>{disk.usePercent}</TableCell>
                    <TableCell>{disk.mounted}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {diskData && diskData.length > 0 && (
              <DiskPieChart diskData={diskData} />
            )}
          </>
        )}
      </AccordionDetails>
    </Accordion>
  )
}

export default DiskInfo
