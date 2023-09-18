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

const ProcessesInfo = () => {
  const [processes, setProcesses] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/processes')
        setProcesses(response.data.data)
      } catch (error) {
        console.error('An error occurred while fetching processes:', error)
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
        <StorageIcon /> Running Processes
      </Typography>
      {!processes ? (
        <CircularProgress />
      ) : (
        <Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>PID</TableCell>
                <TableCell>CPU (%)</TableCell>
                <TableCell>Memory (%)</TableCell>
                <TableCell>Command</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {processes.map((process, index) => (
                <TableRow key={index}>
                  <TableCell>{process.user}</TableCell>
                  <TableCell>{process.pid}</TableCell>
                  <TableCell>{process.cpu}</TableCell>
                  <TableCell>{process.mem}</TableCell>
                  <TableCell>{process.command}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Container>
  )
}

export default ProcessesInfo
