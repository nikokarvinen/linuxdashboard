import MemoryIcon from '@mui/icons-material/Memory'
import { Box, Container, Paper, Typography } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const CpuInfo = () => {
  const [cpuInfo, setCpuInfo] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/cpu')
        setCpuInfo(response.data.data)
      } catch (error) {
        console.error('An error occurred while fetching CPU info:', error)
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
        <MemoryIcon /> CPU Info
      </Typography>
      {!cpuInfo ? (
        <CircularProgress />
      ) : (
        <Box>
          <Typography variant="body1">
            <strong>Architecture:</strong> {cpuInfo.Architecture}
          </Typography>
        </Box>
      )}
    </Container>
  )
}

export default CpuInfo
