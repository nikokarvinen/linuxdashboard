const express = require('express')
const { exec } = require('child_process')
const cors = require('cors')

const app = express()
const port = 5000

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  })
)

const executeCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error)
        return
      }
      resolve(stdout.trim())
    })
  })
}

let cpuData = []
const MAX_LENGTH = 60 // e.g., 60 points for 60 minutes

setInterval(() => {
  // Simulate CPU usage data collection
  const cpuUsage = Math.random()
  const time = new Date().toISOString()
  cpuData.push({ name: time, cpuUsage })

  // Remove old data points
  if (cpuData.length > MAX_LENGTH) {
    cpuData.shift()
  }
}, 60 * 1000) // Collect data every minute

app.get('/cpu', async (req, res) => {
  try {
    const cpuInfoOutput = await executeCommand('lscpu')
    const lines = cpuInfoOutput.split('\n')
    const cpuInfo = {}

    lines.forEach((line) => {
      const parts = line.split(':')
      if (parts.length === 2) {
        const key = parts[0].trim()
        const value = parts[1].trim()
        cpuInfo[key] = value
      }
    })

    const uptimeOutput = await executeCommand('uptime')
    const loadAverages = uptimeOutput
      .match(/load average: (.*)/)[1]
      .split(',')
      .map((s) => parseFloat(s.trim()))
    const newCpuData = loadAverages.map((avg, i) => ({
      name: `${i + 1}m`,
      cpuUsage: avg,
    }))

    res.json({ data: cpuInfo, cpuData: newCpuData }) // Using newCpuData here
  } catch (error) {
    console.error(`Error executing command: ${error}`)
    res.status(500).json({ error: `Internal Server Error: ${error.message}` })
  }
})

app.get('/memory', (req, res) => {
  exec('free -m', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error}`)
      return res.status(500).json({ error: 'Internal Server Error' })
    }

    const lines = stdout.trim().split('\n')
    const memoryInfo = {}

    lines.forEach((line, index) => {
      if (index === 1) {
        const parts = line.split(/\s+/)
        memoryInfo.total = parts[1]
        memoryInfo.used = parts[2]
        memoryInfo.free = parts[3]
      }
    })

    res.json({ data: memoryInfo })
  })
})

app.get('/disk', async (req, res) => {
  try {
    const output = await executeCommand('df -h')
    const lines = output.split('\n')
    const diskInfo = lines.slice(1).map((line) => {
      const parts = line.split(/\s+/)
      return {
        filesystem: parts[0],
        size: parts[1],
        used: parts[2],
        available: parts[3],
        usePercent: parts[4],
        mounted: parts[5],
      }
    })
    res.json({ data: diskInfo })
  } catch (error) {
    console.error(`Error executing command: ${error}`)
    res.status(500).json({ error: `Internal Server Error: ${error.message}` })
  }
})

app.get('/processes', async (req, res) => {
  try {
    const output = await executeCommand('ps aux --sort=-%mem,-%cpu')
    const lines = output.split('\n')
    const processes = lines.slice(1).map((line) => {
      const parts = line.split(/\s+/).filter(Boolean)
      return {
        user: parts[0],
        pid: parts[1],
        cpu: parts[2],
        mem: parts[3],
        command: parts.slice(10).join(' '),
      }
    })
    res.json({ data: processes })
  } catch (error) {
    console.error(`Error executing command: ${error}`)
    res.status(500).json({ error: `Internal Server Error: ${error.message}` })
  }
})

app.get('/network', async (req, res) => {
  try {
    const output = await executeCommand('ifconfig')
    const interfaces = output.split(/\n\n/).filter(Boolean)
    const networkInfo = interfaces.map((str) => {
      const lines = str.split('\n')
      const firstLine = lines[0]
      const name = firstLine.split(':')[0]
      const inetLine = lines.find((line) => /inet /.test(line)) || ''
      const inet = inetLine.split(' ')[1]
      return { name, inet }
    })

    res.json({ data: networkInfo })
  } catch (error) {
    console.error(`Error executing command: ${error}`)
    res.status(500).json({ error: `Internal Server Error: ${error.message}` })
  }
})

app.get('/uptime', async (req, res) => {
  try {
    const output = await executeCommand('uptime -p')
    res.json({ data: { uptime: output } })
  } catch (error) {
    console.error(`Error executing command: ${error}`)
    res.status(500).json({ error: `Internal Server Error: ${error.message}` })
  }
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
