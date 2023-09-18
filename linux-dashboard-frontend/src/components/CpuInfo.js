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
    <div>
      <h1>CPU Info</h1>
      {cpuInfo ? (
        <div>
          <p>
            <strong>Architecture:</strong> {cpuInfo.Architecture}
          </p>
        </div>
      ) : (
        <p>Loading CPU information...</p>
      )}
    </div>
  )
}

export default CpuInfo
