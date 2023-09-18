import TimerIcon from '@mui/icons-material/Timer'
import {
  Box,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const UptimeInfo = () => {
  const [uptime, setUptime] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/uptime')
        setUptime(response.data.data.uptime)
      } catch (error) {
        console.error('An error occurred while fetching uptime:', error)
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
        <TimerIcon /> System Uptime
      </Typography>
      {!uptime ? (
        <CircularProgress />
      ) : (
        <Box>
          <Typography variant="body1">{uptime}</Typography>
        </Box>
      )}
    </Container>
  )
}

export default UptimeInfo
