import StorageIcon from '@mui/icons-material/Storage'
import {
  Box,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import DiskPieChart from './DiskPieChart'

const DiskInfo = () => {
  const [diskInfo, setDiskInfo] = useState(null)
  const [diskData, setDiskData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/disk')
        setDiskInfo(response.data.data)

        // Laske free ja used arvot datan perusteella
        const calculatedFree = response.data.data.reduce((total, disk) => {
          return total + parseFloat(disk.available)
        }, 0)

        const calculatedUsed = response.data.data.reduce((total, disk) => {
          return total + parseFloat(disk.used)
        }, 0)

        setDiskData([
          { name: 'Free', value: calculatedFree },
          { name: 'Used', value: calculatedUsed },
        ])
      } catch (error) {
        console.error('An error occurred while fetching disk info:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <Container
      component={Paper}
      elevation={3}
      style={{ padding: '16px', marginTop: '16px' }}
    >
      <Typography variant="h5" gutterBottom>
        <StorageIcon /> Disk Info
      </Typography>
      {!diskInfo ? (
        <CircularProgress />
      ) : (
        <Box>
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
        </Box>
      )}
    </Container>
  )
}

export default DiskInfo
