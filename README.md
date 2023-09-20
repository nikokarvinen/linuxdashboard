# Linux Dashboard

A simple dashboard to monitor Linux system metrics, built with React and Node.js.

## Prerequisites

- Docker
- Docker Compose

## Quick Start

1. **Clone the Repository**

   ```bash
   git clone https://github.com/nikokarvinen/linuxdashboard.git
   ```

   Navigate to the project directory:

   ```bash
   cd linuxdashboard
   ```

2. **Build and Run Containers**

   Use Docker Compose to build and run both the frontend and backend containers.

   ```bash
   docker-compose up --build
   ```

   This command will build the Docker images if they don't exist and then start the containers.

3. **Access the Application**

   - Frontend will be available at `http://localhost:3000`

## Features

- CPU Utilization
- Network Interfaces
- Running Processes
- Disk usage
- Memory info
- System Uptime
- More to come...
