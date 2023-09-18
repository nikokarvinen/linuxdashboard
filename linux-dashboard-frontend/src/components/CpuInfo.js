import MemoryIcon from '@mui/icons-material/Memory'
import { Box, Container, Paper, Typography } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import CpuLineChart from './CpuLineChart'

const CpuInfo = () => {
  const [cpuInfo, setCpuInfo] = useState(null)
  const [cpuData, setCpuData] = useState([])

  // Kovakoodattu CPU-käyttödata
  const hardcodedCpuData = [
    { name: '1s', cpuUsage: 20 },
    { name: '2s', cpuUsage: 25 },
    // Lisää tarvittavat aikasarjadatat tähän
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/cpu')
        console.log('CPU Data:', response.data.data)
        setCpuInfo(response.data.data)
        setCpuData(response.data.cpuData) // Assuming this is where you receive CPU usage data
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
          {cpuData && cpuData.length > 0 ? (
            <CpuLineChart cpuData={cpuData} />
          ) : (
            // Käytä kovakoodattua dataa, jos `cpuData` ei ole saatavilla
            <CpuLineChart cpuData={hardcodedCpuData} />
          )}
        </Box>
      )}
    </Container>
  )
}

export default CpuInfo
