import RefreshIcon from '@mui/icons-material/Refresh'
import StorageIcon from '@mui/icons-material/Storage'
import {
  Box,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const ProcessesInfo = () => {
  const [processes, setProcesses] = useState(null)
  const [filteredProcesses, setFilteredProcesses] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sortOrder, setSortOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('pid')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/processes')
        setProcesses(response.data.data)
        setFilteredProcesses(response.data.data)
      } catch (error) {
        console.error('An error occurred:', error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (processes && searchTerm) {
      const filtered = processes.filter((process) => {
        return process.command.toLowerCase().includes(searchTerm.toLowerCase())
      })
      setFilteredProcesses(filtered)
    } else {
      setFilteredProcesses(processes)
    }
  }, [searchTerm, processes])

  const handleRefresh = async () => {
    try {
      const response = await axios.get('http://localhost:5000/processes')
      setProcesses(response.data.data)
      setFilteredProcesses(response.data.data)
    } catch (error) {
      console.error('An error occurred:', error)
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleSort = (property) => {
    const isAsc = orderBy === property && sortOrder === 'asc'
    setSortOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const sortedProcesses = filteredProcesses?.sort((a, b) => {
    const [valueA, valueB] = [a[orderBy], b[orderBy]]
    if (sortOrder === 'asc') {
      return valueA < valueB ? -1 : 1
    } else {
      return valueA > valueB ? -1 : 1
    }
  })

  const displayedProcesses = sortedProcesses?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  return (
    <Container
      component={Paper}
      elevation={3}
      style={{ padding: '16px', marginTop: '16px' }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h5">
          <StorageIcon /> Running Processes
        </Typography>
        <IconButton onClick={handleRefresh}>
          <RefreshIcon />
        </IconButton>
      </Box>
      <TextField
        label="Search"
        variant="outlined"
        size="small"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {!displayedProcesses ? (
        <CircularProgress />
      ) : (
        <Box>
          <Table>
            <TableHead>
              <TableRow>
                {['User', 'PID', 'CPU (%)', 'Memory (%)', 'Command'].map(
                  (headCell) => (
                    <TableCell
                      key={headCell}
                      sortDirection={
                        orderBy === headCell.toLowerCase() ? sortOrder : false
                      }
                    >
                      <TableSortLabel
                        active={orderBy === headCell.toLowerCase()}
                        direction={
                          orderBy === headCell.toLowerCase() ? sortOrder : 'asc'
                        }
                        onClick={() => handleSort(headCell.toLowerCase())}
                      >
                        {headCell}
                      </TableSortLabel>
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedProcesses.map((process, index) => (
                <TableRow key={index}>
                  <TableCell>{process.user}</TableCell>
                  <TableCell>{process.pid}</TableCell>
                  <TableCell>{process.cpu}</TableCell>
                  <TableCell>{process.mem}</TableCell>
                  <TableCell>{process.command}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  colSpan={5}
                  count={filteredProcesses?.length || 0}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: { 'aria-label': 'rows per page' },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </Box>
      )}
    </Container>
  )
}

export default ProcessesInfo
