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
import { FaCalendar, FaCheckCircle, FaDownload, FaExclamationTriangle, FaSkullCrossbones } from 'react-icons/fa';
import { Button, MenuItem, Select, TextField } from '@mui/material';
import moment from 'moment';
import { Link } from 'react-router-dom';
import {Delete as DeleteIcon, Add as AddIcon} from '@mui/icons-material';



const RecapAdmin = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [craData, setCraData] = useState([]);
  const [page, setPage] = useState(0);
  const [businessDays, setbusinessDays] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [allCollabs, setAllCollabs] = useState([]);
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const [selectedFilter, setSelectedFilter] = useState('Tous');
  const [showNotCreated, setShowNotCreated] = useState(1);
  const [filteredCraData, setFilteredCraData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [soumisCraCount, setSoumisCraCount] = useState(0);
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [monthClosed, setMonthClosed] = useState(false);
  const getTokenFromLocalStorage = () => {
    const token = localStorage.getItem('token');
    return token;
  };
  const token = getTokenFromLocalStorage();



  useEffect(() => {
    fetchCollabs();
  }, []);

  useEffect(() => {
    fetchCraData();
  }, [allCollabs]);

  useEffect(() => {
    if(craData?.length>0)
    {
    const soumisCras = craData.filter((cra) => cra._etat === 0);
    setSoumisCraCount(soumisCras.length);
    const isButtonEnabled = soumisCras.length === allCollabs.length;
    setButtonEnabled(isButtonEnabled);
   
    const isMonthClosed = craData.some((cra) => cra._status === 'Closed');
    setMonthClosed(isMonthClosed);
    }
  }, [craData, allCollabs]);


  const fetchCollabs = async () => {
    try {
      const response = await fetch(`${apiUrl}/collab/all`,{ headers: {
        'Authorization': `Bearer ${token}`,
      },});
      const data = await response.json();
      setAllCollabs(data);
    } catch (error) {
      console.error('Error fetching collabs:', error);
    }
  };


  const fetchCraData = async () => {
    try {
      const response = await fetch(`${apiUrl}/cra/monthCra/${month}/${year}`,{ headers: {
        'Authorization': `Bearer ${token}`,
      },});
      const data = await response.json();
      setCraData(data);
      setFilteredCraData(data);
      //calculating les jours ouvres
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      let i = 0;
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

  const getRowColor = (craetat) => {
    const etat = craetat ? 'Pas Soumis' : 'Soumis'
    switch (etat) {
      case "Pas Soumis":
        return "#E8F4FD";
      case "Soumis":
        return "#CCFFCC";
      default:
        return "#FFCCCC";
    }
  };

  const filterOptions = [
    'Tous',
    'Pas soumis',
    'Soumis',
    'Pas cree',
  ];

  const handleFilterChange = (event) => {
    const selectedValue = event.target.value;

    if (selectedValue === 'Tous') {
      setShowNotCreated(1);
      setFilteredCraData(craData);
    } else if (selectedValue === 'Pas soumis') {
      const filteredData = craData.filter((cra) => {
        return cra._etat === 1;
      });
      setShowNotCreated(0);
      setFilteredCraData(filteredData);
    } else if (selectedValue === 'Soumis') {
      const filteredData = craData.filter((cra) => {
        return cra._etat === 0;
      });
      setShowNotCreated(0);
      setFilteredCraData(filteredData);
    } else if (selectedValue === 'Pas cree') {
      setShowNotCreated(1);
      setFilteredCraData([]);
    }
    setSelectedFilter(event.target.value);
  };


  const filteredCollabs = allCollabs.filter((collab) =>
    collab._name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCloturerMois = async () => {
    if (monthClosed) {
      toast.warning('le mois est deja cloturé!');

    }
    else if (buttonEnabled && !monthClosed) {
      try {
        const response = await fetch(`${apiUrl}/cra/closeCras/${month}/${year}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          toast.success('Mois cloturé avec succès!');
          setMonthClosed(true);
        } else {
          toast.error('Erreur lors de la cloture du mois.');
        }
      } catch (error) {
        console.error('Error closing month CRAs:', error);
        toast.error('Erreur lors de la cloture du mois.');
      }
    } else {
      toast.warning('Il existe des cra non soumis!');
    }
  };

  const exportToExcel = async () => {
    try {
      const response = await fetch(`${apiUrl}/cra/export/${month}/${year}`, {
        method: 'GET',
        responseType: 'arraybuffer',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const buffer = await response.arrayBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Recap_mois_${month}.xlsx`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        toast.error('Error exporting to Excel.');
      }
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Error exporting to Excel.');
    }
  };




  return (
    <div style={{ display: 'flex' }}>
      <div style={{ display: 'flex', flexDirection: 'column', padding: '16px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)', borderRadius: '10px', backgroundColor: '#E8F4FD', width: '70%', marginRight: '10px' }}>
        <h1 style={{ marginLeft: '40%' }}>Recap du mois </h1>
        <div style={{ marginLeft: '10%', marginRight: '10%' }}>
          <Button variant="contained" color="primary" endIcon={<FaDownload />} style={{ left: '90%' }} onClick={exportToExcel}>
            Exporter
          </Button>

        </div>
        <div style={{ marginLeft: '10%', marginRight: '10%', marginTop: '2%' }}>
          <Button variant="contained" color="primary" startIcon={<FaCalendar />} style={{ left: '88%' }} onClick={handleCloturerMois} disabled={!buttonEnabled || monthClosed}>
            {monthClosed ? 'Mois cloturé!' : 'Cloturer le mois'}
          </Button>
        </div>
        <div style={{ display: 'flex', marginBottom: '14px' }}>
          <div style={{ marginRight: '40%' }}>
            <Typography>Filtrer par Etat:</Typography>
            <Select style={{ width: '100%' }}
              value={selectedFilter}
              onChange={handleFilterChange}
            >
              {filterOptions.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div>
            <Typography>Recherche par nom :</Typography>
            <TextField
              label="Rechercher"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>


        <TableContainer>

          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell><Typography>Collaborateur</Typography></TableCell>
                <TableCell>Periode</TableCell>
                <TableCell>Etat du Cra</TableCell>
                <TableCell>Recap</TableCell>
                <TableCell>Calendrier</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { filteredCraData?.length > 0 ? (filteredCraData
                .filter(cra => cra._collab._name.toLowerCase().includes(searchTerm.toLowerCase()))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((cra) => (
                  <TableRow
                    key={cra._id}
                    style={{ backgroundColor: getRowColor(cra._etat) }}
                  >

                    <TableCell>
                      {cra._etat ? <FaExclamationTriangle color="orange" /> : <FaCheckCircle color="green" />}
                    </TableCell>
                    <TableCell>
                      {cra._collab._name} {cra._collab._lastname}

                    </TableCell>
                    <TableCell>{month}/{year}</TableCell>
                    <TableCell>{cra._etat ? 'Pas Soumis' : 'Soumis'} </TableCell>
                    <TableCell>{(cra._activites.length + cra._absences.length) / 2} /{businessDays - cra._holidays.length} </TableCell>
                    <TableCell>
                      <Link to={`/calendar/${cra._collab._email}`}>
                        <Button variant="contained" color="primary">
                          Details
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                  ))
                ) : (
                  <p></p>
                )}
              {craData?.length>0 && showNotCreated && filteredCollabs
                .filter((collab) => !craData.some((cra) => cra._collab._email === collab._email))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((collab) => (
                  <TableRow key={collab._email} style={{ backgroundColor: '#FFCCCC' }}>
                    <TableCell><FaSkullCrossbones color="red" /></TableCell>

                    <TableCell>{collab._name} {collab._lastname}</TableCell>
                    <TableCell>{month}/{year}</TableCell>
                    <TableCell>Pas crée</TableCell>
                    <TableCell>0 /0</TableCell>
                    <TableCell>
                      <Link to={`/calendar/${collab._email}`}>
                        <Button variant="contained" color="primary">
                          Details
                        </Button>
                      </Link>
                    </TableCell>
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


      <div style={{ display: 'flex', flexDirection: 'column', padding: '16px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)', borderRadius: '10px', backgroundColor: '#E8F4FD', width: '20%' }}>
      <h3 style={{ marginLeft: '20%' }}>Les Reguls du mois </h3>
      {craData?.length>0 && craData.map((cra) => (
        <div key={cra.id}>
          {cra._history.length > 0 && (
            <div style={{ marginBottom: '8px' }}>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {cra._history.map((reg, index) => (
                  <div>
                  <li key={index} style={{ display: 'flex', alignItems: 'center' , paddingBottom: '8px'}}>
                    <div style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }}>
                      {reg._action === 'Delete' ? <DeleteIcon color="error" fontSize="small" /> : <AddIcon color="primary" fontSize="small" />}
                    </div>
                    <div style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                      {`le ${moment(reg._date).format('L')}, ${cra._collab._name} a ${reg._action === 'Delete' ? 'supprimé' : 'ajouté'} une ${reg._target.project ? 'activité : ' : 'absence : '} ${reg._target.project ? reg._target.project.code : reg._target.raison} pour le ${moment(reg._target.date).format('L')}`}
                    </div>
                    
                  </li>
                  <hr style={{ borderTop: '1px solid #999', width: '70%', margin: '4px auto' }} />
                  </div>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>

    </div>
  );
};

export default RecapAdmin;
