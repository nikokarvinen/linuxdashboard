const express = require('express')
const { exec } = require('child_process')
const cors = require('cors')
const os = require('os')

const app = express()
const port = 5000

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  })
)

let lastMeasure = {
  idle: 0,
  total: 0,
}

function cpuAverage() {
  const cpus = os.cpus()
  let idle = 0
  let total = 0

  cpus.forEach((cpu) => {
    for (const type in cpu.times) {
      total += cpu.times[type]
    }
    idle += cpu.times.idle
  })

  return {
    idle: idle / cpus.length,
    total: total / cpus.length,
  }
}

function cpuUsage() {
  const startMeasure = cpuAverage()

  return new Promise((resolve) => {
    setTimeout(() => {
      const endMeasure = cpuAverage()
      const idleDifference = endMeasure.idle - startMeasure.idle
      const totalDifference = endMeasure.total - startMeasure.total
      const percentage = 100 - (idleDifference / totalDifference) * 100
      resolve(percentage)
    }, 100)
  })
}

// Function to execute shell commands
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
const MAX_LENGTH = 120 // e.g., 120 points for 60 minutes

// Collect CPU usage data
setInterval(async () => {
  const currentCpuUsage = await cpuUsage() // call our new cpuUsage function
  const cpuUsagePercentage = currentCpuUsage // CPU usage as a percentage
  const time = new Date().toISOString() // ISO format time string
  cpuData.push({ name: time, cpuUsage: cpuUsagePercentage }) // Push new data point

  // Limit the data array to MAX_LENGTH
  if (cpuData.length > MAX_LENGTH) {
    cpuData.shift() // Remove the oldest data point
  }
}, 30 * 1000) // Collect data every 30 seconds

// Define the '/cpu' endpoint
app.get('/cpu', async (req, res) => {
  // Get the requested time range from query params, or default to MAX_LENGTH
  const range = parseInt(req.query.range) || MAX_LENGTH

  try {
    // Execute the 'lscpu' command and process its output
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

    // Send the processed 'lscpu' information and the last 'range' CPU data points
    res.json({ data: cpuInfo, cpuData: cpuData.slice(-range) })
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
    const uptimeInSeconds = os.uptime()
    res.json({ data: { uptime: uptimeInSeconds } })
  } catch (error) {
    console.error(`Error fetching uptime: ${error}`)
    res.status(500).json({ error: `Internal Server Error: ${error.message}` })
  }
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
