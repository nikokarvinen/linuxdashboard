import axios from 'axios'
import React, { useEffect, useState } from 'react'

const MemoryInfo = () => {
  const [memoryData, setMemoryData] = useState({})

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
    <div>
      <h2>Memory Info</h2>
      <ul>
        <li>Total Memory: {memoryData.total} MB</li>
        <li>Used Memory: {memoryData.used} MB</li>
        <li>Free Memory: {memoryData.free} MB</li>
      </ul>
    </div>
  )
}

export default MemoryInfo
