// src/components/DataTable.js
import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const DataTable = () => {
  const [apiData, setApiData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.publicapis.org/entries');
        if (response.status === 429) {
          // Implement a backoff and retry mechanism
          console.log('Rate limit exceeded. Retrying in 5 seconds...');
          await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds
          fetchData(); // Retry the request
        } else {
          const data = await response.json();
          setApiData(data.entries);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

  const handleDelete = (index) => {
    const updatedData = [...apiData];
    updatedData.splice(index, 1);
    setApiData(updatedData);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Auth</TableCell>
            <TableCell>HTTPS</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {apiData.map((api, index) => (
            <TableRow key={index}>
              <TableCell>{api.API}</TableCell>
              <TableCell>{api.Description}</TableCell>
              <TableCell>{api.Auth}</TableCell>
              <TableCell>{api.HTTPS ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDelete(index)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
