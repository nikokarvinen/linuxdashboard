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
    <div>
      <h2>System Uptime</h2>
      {uptime ? <p>{uptime}</p> : <p>Loading uptime information...</p>}
    </div>
  )
}

export default UptimeInfo
