import React from 'react'
import CpuInfo from './components/CpuInfo'
import Diskinfo from './components/DiskInfo'
import MemoryInfo from './components/MemoryInfo'
import NetworkInfo from './components/NetworkInfo'
import ProcessesInfo from './components/ProcessesInfo'
import UptimeInfo from './components/UptimeInfo'

function App() {
  return (
    <div className="App">
      <CpuInfo />
      <Diskinfo />
      <NetworkInfo />
      <ProcessesInfo />
      <MemoryInfo />
      <UptimeInfo />
    </div>
  )
}

export default App
