import MemoryIcon from '@mui/icons-material/Memory'
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

const MemoryInfo = () => {
  const [memoryData, setMemoryData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/memory')
        setMemoryData(response.data.data)
      } catch (error) {
        console.error('An error occurred while fetching memory info:', error)
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
        <MemoryIcon /> Memory Info
      </Typography>
      {!memoryData ? (
        <CircularProgress />
      ) : (
        <Box>
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
        </Box>
      )}
    </Container>
  )
}

export default MemoryInfo
