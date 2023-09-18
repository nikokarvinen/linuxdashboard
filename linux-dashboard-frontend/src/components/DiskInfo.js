import axios from 'axios'
import React, { useEffect, useState } from 'react'

const DiskInfo = () => {
  const [diskInfo, setDiskInfo] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/disk')
        setDiskInfo(response.data.data)
      } catch (error) {
        console.error('An error occurred while fetching disk info:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <div>
      <h2>Disk Info</h2>
      {diskInfo.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Filesystem</th>
              <th>Size</th>
              <th>Used</th>
              <th>Available</th>
              <th>Use %</th>
              <th>Mounted on</th>
            </tr>
          </thead>
          <tbody>
            {diskInfo.map((disk, index) => (
              <tr key={index}>
                <td>{disk.filesystem}</td>
                <td>{disk.size}</td>
                <td>{disk.used}</td>
                <td>{disk.available}</td>
                <td>{disk.usePercent}</td>
                <td>{disk.mounted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading disk info...</p>
      )}
    </div>
  )
}

export default DiskInfo
