import axios from 'axios'
import React, { useEffect, useState } from 'react'

const ProcessesInfo = () => {
  const [processes, setProcesses] = useState([])

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
    <div>
      <h2>Running Processes</h2>
      {processes.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>PID</th>
              <th>CPU (%)</th>
              <th>Memory (%)</th>
              <th>Command</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((process, index) => (
              <tr key={index}>
                <td>{process.user}</td>
                <td>{process.pid}</td>
                <td>{process.cpu}</td>
                <td>{process.mem}</td>
                <td>{process.command}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading processes info...</p>
      )}
    </div>
  )
}

export default ProcessesInfo
