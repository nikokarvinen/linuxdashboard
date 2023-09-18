const express = require('express')
const { exec } = require('child_process')

const app = express()
const port = 3000

// esimerkki siitä, miten saada tietoa CPU:sta
app.get('/cpu', (req, res) => {
  exec('lscpu', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error}`)
      return res.status(500).json({ error: 'Internal Server Error' })
    }

    const lines = stdout.trim().split('\n')
    const cpuInfo = {}

    lines.forEach((line) => {
      const parts = line.split(':')
      if (parts.length === 2) {
        const key = parts[0].trim()
        const value = parts[1].trim()
        cpuInfo[key] = value
      }
    })

    res.json({ data: cpuInfo })
  })
})

// muut endpointit, kuten muistin käyttö, prosessit jne.

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
