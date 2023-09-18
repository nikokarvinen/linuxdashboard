import WifiIcon from '@mui/icons-material/Wifi'
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

const NetworkInfo = () => {
  const [networkInfo, setNetworkInfo] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/network')
        setNetworkInfo(response.data.data)
      } catch (error) {
        console.error('An error occurred while fetching network info:', error)
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
        <WifiIcon /> Network Interfaces
      </Typography>
      {!networkInfo ? (
        <CircularProgress />
      ) : (
        <Box>
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
        </Box>
      )}
    </Container>
  )
}

export default NetworkInfo
