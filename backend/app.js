const express = require('express')
const { exec } = require('child_process')
const cors = require('cors')
const os = require('os')

const app = express()
const port = 5000

// Enable CORS for localhost development
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  })
)

// Helper function to get CPU average
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

// Helper function to get CPU usage
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

// Helper function to execute shell commands
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

const MAX_LENGTH = 120 // e.g., 120 points for 60 minutes
let cpuData = []

// Collect CPU usage data periodically
setInterval(async () => {
  const currentCpuUsage = await cpuUsage()
  const time = new Date().toISOString()
  cpuData.push({ name: time, cpuUsage: currentCpuUsage })

  // Limit data array to MAX_LENGTH
  if (cpuData.length > MAX_LENGTH) {
    cpuData.shift()
  }
}, 30 * 1000) // Collect data every 30 seconds

// Handle GET reguest for CPU info
app.get('/cpu', async (req, res) => {
  try {
    const cpuInfoOutput = await executeCommand('lscpu')
    const lines = cpuInfoOutput.split('\n')
    const cpuInfo = {}

    lines.forEach((line) => {
      const [key, value] = line.split(':').map((str) => str.trim())
      if (key && value) {
        cpuInfo[key] = value
      }
    })

    res.json({ data: cpuInfo, cpuData: cpuData.slice(-MAX_LENGTH) })
  } catch (error) {
    console.error(`Error executing command: ${error}`)
    res.status(500).json({ error: `Internal Server Error: ${error.message}` })
  }
})

// Handle GET request for memory information
app.get('/memory', (req, res) => {
  // Execute shell command to get memory info
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

    // Return memory information as JSON
    res.json({ data: memoryInfo })
  })
})

// Handle GET request for disk information
app.get('/disk', async (req, res) => {
  try {
    const output = await executeCommand('df -h')
    const lines = output.split('\n')

    // Create diskInfo object with necessary information
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

// Handle GET request for process information
app.get('/processes', async (req, res) => {
  try {
    const output = await executeCommand('ps aux --sort=-%mem,-%cpu')
    const lines = output.split('\n')

    // Create processes object with necessary information
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

// Function to fetch IP and MAC information
const getNetworkDetails = async (interfaceName) => {
  const ipAddressOutput = await executeCommand(
    `ip -4 addr show ${interfaceName}`
  )

  const ipAddressMatch = ipAddressOutput.match(/inet (\d+\.\d+\.\d+\.\d+)/)
  const ipAddress = ipAddressMatch ? ipAddressMatch[1] : 'N/A'

  const macAddressOutput = await executeCommand(
    `cat /sys/class/net/${interfaceName}/address`
  )

  const macAddress = macAddressOutput ? macAddressOutput.trim() : 'N/A'

  return { ipAddress, macAddress }
}

const getSubnetMask = async (interfaceName) => {
  try {
    const output = await executeCommand(
      `ip -o -f inet addr show ${interfaceName} | awk '{print $4}'`
    )
    const subnet = output.trim().split('/')[1]
    return subnet ? subnet : 'N/A'
  } catch (err) {
    return 'N/A'
  }
}

const getDefaultGateway = async () => {
  try {
    const output = await executeCommand(
      `ip route | grep default | awk '{print $3}'`
    )
    return output.trim() || 'N/A'
  } catch (err) {
    return 'N/A'
  }
}

const getDNSServers = async () => {
  try {
    const output = await executeCommand(
      `cat /etc/resolv.conf | grep nameserver | awk '{print $2}'`
    )
    return output.trim().split('\n') || ['N/A']
  } catch (err) {
    return ['N/A']
  }
}

// Function to make bytes human-readable
const bytesToSize = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Byte'
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
}

app.get('/network', async (req, res) => {
  try {
    const linkOutput = await executeCommand('ip -s link')
    const defaultGateway = await getDefaultGateway()
    const dnsServers = await getDNSServers()

    const interfaces = linkOutput.split(/\n(?=\d+: )/).filter(Boolean)

    const networkInfoPromises = interfaces.map(async (str) => {
      const lines = str.split('\n').filter(Boolean)
      const name = lines[0].split(': ')[1].split('@')[0].trim()

      const { ipAddress, macAddress } = await getNetworkDetails(name)
      const subnetMask = await getSubnetMask(name)

      const rxLineIndex = lines.findIndex((line) => /^    RX:/.test(line))
      const txLineIndex = lines.findIndex((line) => /^    TX:/.test(line))

      const rxMetricsLine =
        rxLineIndex !== -1 ? lines[rxLineIndex + 1].trim() : ''
      const txMetricsLine =
        txLineIndex !== -1 ? lines[txLineIndex + 1].trim() : ''

      const rxMetrics = rxMetricsLine
        ? rxMetricsLine.split(/\s+/).filter(Boolean)
        : []
      const txMetrics = txMetricsLine
        ? txMetricsLine.split(/\s+/).filter(Boolean)
        : []

      return {
        name,
        ipAddress,
        macAddress,
        subnetMask,
        defaultGateway,
        dnsServers,
        rxBytes: rxMetrics.length ? bytesToSize(rxMetrics[0]) : 'N/A',
        rxPackets: rxMetrics.length > 1 ? rxMetrics[1] : 'N/A',
        txBytes: txMetrics.length ? bytesToSize(txMetrics[0]) : 'N/A',
        txPackets: txMetrics.length > 1 ? txMetrics[1] : 'N/A',
      }
    })

    const networkInfo = await Promise.all(networkInfoPromises)
    res.json({ data: networkInfo })
  } catch (error) {
    console.error(`Error executing command: ${error}`)
    res.status(500).json({ error: `Internal Server Error: ${error.message}` })
  }
})

// Handle GET request for system uptime
app.get('/uptime', async (req, res) => {
  try {
    const uptimeInSeconds = os.uptime()

    // Return uptime information as JSON
    res.json({ data: { uptime: uptimeInSeconds } })
  } catch (error) {
    console.error(`Error fetching uptime: ${error}`)
    res.status(500).json({ error: `Internal Server Error: ${error.message}` })
  }
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
