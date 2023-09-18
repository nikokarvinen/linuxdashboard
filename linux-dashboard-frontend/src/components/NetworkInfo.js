import axios from 'axios'
import React, { useEffect, useState } from 'react'

const NetworkInfo = () => {
  const [networkInfo, setNetworkInfo] = useState([])

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
    <div>
      <h2>Network Interfaces</h2>
      {networkInfo.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>IP Address</th>
            </tr>
          </thead>
          <tbody>
            {networkInfo.map((network, index) => (
              <tr key={index}>
                <td>{network.name}</td>
                <td>{network.inet}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading network info...</p>
      )}
    </div>
  )
}

export default NetworkInfo
