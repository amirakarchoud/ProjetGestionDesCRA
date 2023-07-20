import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaDownload, FaExclamationTriangle, FaSkullCrossbones } from 'react-icons/fa';
import { Button } from '@mui/material';


const RecapAdmin = () => {
  const apiUrl = 'http://localhost:3000';
  const [craData, setCraData] = useState([]);
  const [page, setPage] = useState(0);
  const [businessDays, setbusinessDays] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [allCollabs, setAllCollabs] = useState([]);
  const today = new Date();
const month = today.getMonth() + 1; 
const year = today.getFullYear();

  useEffect(() => {
    fetchCraData();
    fetchCollabs();
  }, []);


  const fetchCollabs = async () => {
    try {
      const response = await fetch(apiUrl +'/collab/all'); 
      const data = await response.json();
      setAllCollabs(data);
    } catch (error) {
      console.error('Error fetching collabs:', error);
    }
  };
  

  const fetchCraData = async () => {
    try {
      const response = await fetch(apiUrl + '/cra/monthCra/'+month+'/'+year); 
      const data = await response.json();
      setCraData(data);
      //calculating les jours ouvres
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      let i=0;
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) { 
          i++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      setbusinessDays(i);


    } catch (error) {
      console.error('Error fetching CRA data:', error);
      toast.error('Error fetching CRA data');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '16px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)', borderRadius: '10px', backgroundColor: '#E8F4FD', width: '90%' }}>
      <div style={{ marginLeft: '10%', marginRight: '10%' }}>
        <h1 >Recap du mois </h1>
        <Button variant="contained" color="primary" endIcon={<FaDownload />} style={{left:'90%'}}>
            Exporter
          </Button>
      </div>
      <TableContainer>
        <Table  aria-label="collapsible table">
          <TableHead>
            <TableRow>
            <TableCell></TableCell>
              <TableCell><Typography>Collaborateur</Typography></TableCell>
              <TableCell>Peridoe</TableCell>
              <TableCell>Etat du Cra</TableCell>
              <TableCell>Recap</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {craData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((cra) => (
                <TableRow key={cra._id}>
                     <TableCell>
                    {cra._etat ?  <FaExclamationTriangle color="orange" />:<FaCheckCircle color="green" />}
                  </TableCell>
                <TableCell>
                    {cra._collab._name}
                    
                </TableCell>
                <TableCell>{month}/{year}</TableCell>
                <TableCell>{cra._etat ? 'Pas Soumis' :'Soumis'} </TableCell>
                <TableCell>{(cra._activites.length+cra._absences.length)/2} /{businessDays-cra._holidays.length} </TableCell>
                </TableRow>
              ))}
               {allCollabs
              .filter((collab) => !craData.some((cra) => cra._collab._email === collab._email))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((collab) => (
                <TableRow key={collab._email}>
                  <TableCell><FaSkullCrossbones color="red" /></TableCell>
                  
                  <TableCell>{collab._name}</TableCell>
                  <TableCell>{month}/{year}</TableCell>
                  <TableCell>Pas cree</TableCell>
                  <TableCell>0 /0</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={allCollabs.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default RecapAdmin;
