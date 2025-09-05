import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { marked } from 'marked';
import BarChartComponent from './BarChart';
import BidenFacts from './BidenFacts';
import TrumpFacts from './TrumpFacts';
import 'bootstrap/dist/css/bootstrap.min.css';
import AboutModal from './Modal';
import trumpImg from './trump_3.jpg';
import bidenImg from './kamala.jpg';
import './Dashboard.css'; // Import the CSS file
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaBullhorn } from 'react-icons/fa'; // Import the microphone icon
import { Checkbox, FormControlLabel, Box, Typography } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import HelpOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import FilterListIcon from '@mui/icons-material/FilterList';
import useMediaQuery from '@mui/material/useMediaQuery';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import { useAppContext } from '../AppProvider';

const Dashboard = () => {
  const isMobile = useMediaQuery('(max-width:800px)');

  const [data, setData] = useState([]);
  const [trumpStats, setTrumpStats] = useState({ True: 0, False: 0, Inconclusive: 0 });
  const [bidenStats, setBidenStats] = useState({ True: 0, False: 0, Inconclusive: 0 });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [bidenFilters, setBidenFilters] = useState({ True: true, False: true, Inconclusive: true });
  const [trumpFilters, setTrumpFilters] = useState({ True: true, False: true, Inconclusive: true });

  const {backendUrl} = useAppContext()
  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(backendUrl+'/get-data-2');

      const newData = response.data;

      const trumpData = newData.filter(fact => fact.speaker === 'Trump');
      const bidenData = newData.filter(fact => fact.speaker === 'Kamala');

      const newTrumpStats = {
        True: trumpData.filter(fact => fact.Classification === 'True').length,
        False: trumpData.filter(fact => fact.Classification === 'False').length,
        Inconclusive: trumpData.filter(fact => fact.Classification === 'Inconclusive').length
      };

      const newBidenStats = {
        True: bidenData.filter(fact => fact.Classification === 'True').length,
        False: bidenData.filter(fact => fact.Classification === 'False').length,
        Inconclusive: bidenData.filter(fact => fact.Classification === 'Inconclusive').length
      };

      setData(newData);
      setTrumpStats(newTrumpStats);
      setBidenStats(newBidenStats);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data initially
    // const interval = setInterval(fetchData, 30000); // Fetch data every 30 seconds

    // return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const toggleFilter = (candidate, classification) => {
    if (candidate === 'Biden') {
      setBidenFilters(prevFilters => ({
        ...prevFilters,
        [classification]: !prevFilters[classification]
      }));
    } else if (candidate === 'Trump') {
      setTrumpFilters(prevFilters => ({
        ...prevFilters,
        [classification]: !prevFilters[classification]
      }));
    }
  };

  const getFilteredFacts = (candidate) => {
    let filters = candidate === 'Kamala' ? bidenFilters : trumpFilters;
    return data.filter(fact =>
      fact.speaker === candidate && filters[fact.Classification]
    );
  };

  return (
    <>
      <div style={{ backgroundColor: '#F4F4F4' }}>
        <ToastContainer />
        <nav className="navbar">
          <div style={{ display: 'flex', gap: '10px' }}><h1 style={{ color: '#0066FF' }}>Facticity.AI</h1> <h5 style={{ marginTop: '10px' }}> <a href='https://www.aiseer.co' style={{ textDecoration: 'none' }}>by AI Seer.</a></h5></div>
          <div>
          <h3 style={{ display: 'flex', alignItems: 'center' }}>
            US Presidential Debate 2024: Gen AI-powered Fact-checking
            {/* <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'red', padding: '4px 8px', borderRadius: '4px', color: 'white', marginLeft: '8px' }}>
              <div style={{ width: '10px', height: '8px', borderRadius: '50%', backgroundColor: 'white', marginRight: '4px' }}></div>
                <span>Live</span>
              </div> */}
          </h3>
        </div>

          <div className="about-button">
            <button onClick={openModal}>About</button>
          </div>
          <AboutModal isOpen={modalIsOpen} closeModal={closeModal} />
        </nav>
        {/* <div>
                    <p className="note">Note: Facticity may get claim extraction, speaker attribution or results wrong. Facticity does not endorse any particular candidate.</p>
                </div> */}
        <div className="content">
          <div className="candidate-section biden">
            <div className="candidate-header">
              <img src={bidenImg} alt="Harris" />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h2>KAMALA HARRIS</h2>
                <h4 style={{ color: '#0F4B84' }}>Democratic Party</h4>
              </div>
            </div>
            <div>
              <h5>Fact-Checking Statistics for Statements by Harris </h5>
              <BarChartComponent trumpStats={bidenStats} />
            </div>
            <div style={{ backgroundColor: 'white', padding: '20px' }}>
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <h4>Claims by Harris</h4>
          <p style={{ color: 'grey' }}>Latest cards appear on top</p>
        </div>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            padding: 2,
            borderRadius: 2,
            border: '1px solid #ddd',
            backgroundColor: '#f5f5f5',
            flex: 2,
            maxWidth: '100%',
            width: isMobile ? '100%' : 600,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterListIcon color="action" />
            <Typography variant="h6" fontWeight="bold">
              Filters
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'center',
              gap: isMobile ? 2 : 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6" fontWeight="bold">
                {bidenStats.True + bidenStats.False + bidenStats.Inconclusive}
              </Typography>
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  icon={<CheckCircleOutlineIcon />}
                  checkedIcon={<CheckCircleOutlineIcon />}
                  checked={bidenFilters.True}
                  onChange={() => toggleFilter('Biden', 'True')}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1">True:</Typography>
                  <Typography fontWeight="bold">{bidenStats.True}</Typography>
                </Box>
              }
            />

            <FormControlLabel
              control={
                <Checkbox
                  icon={<CancelOutlinedIcon />}
                  checkedIcon={<CancelOutlinedIcon />}
                  checked={bidenFilters.False}
                  onChange={() => toggleFilter('Biden', 'False')}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1">False:</Typography>
                  <Typography fontWeight="bold">{bidenStats.False}</Typography>
                </Box>
              }
            />

            <FormControlLabel
              control={
                <Checkbox
                  icon={<HelpOutlineIcon />}
                  checkedIcon={<HelpOutlineIcon />}
                  checked={bidenFilters.Inconclusive}
                  onChange={() => toggleFilter('Biden', 'Inconclusive')}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1">Unverifiable:</Typography>
                  <Typography fontWeight="bold">{bidenStats.Inconclusive}</Typography>
                </Box>
              }
            />
          </Box>
        </Box>
      </div>
    </div>
              <div className="facts-list">
                <BidenFacts data={getFilteredFacts('Kamala')} />
              </div>
            {/* </div> */}
          </div>

          <div className="candidate-section trump">
            <div className="candidate-header">
              <img src={trumpImg} alt="Trump" />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h2>DONALD TRUMP</h2>
                <h4 style={{ color: '#8E1F1B' }}>Republican Party</h4>
              </div>
            </div>
            <div>
              <h5>Fact-Checking Statistics for Statements by Trump</h5>
              <BarChartComponent trumpStats={trumpStats} />
            </div>
            <div style={{ backgroundColor: 'white', padding: '20px' }}>
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <h4>Claims by Trump</h4>
          <p style={{ color: 'grey' }}>Latest cards appear on top</p>
        </div>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            padding: 2,
            borderRadius: 2,
            border: '1px solid #ddd',
            backgroundColor: '#f5f5f5',
            flex: 2,
            maxWidth: '100%',
            width: isMobile ? '100%' : 600,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterListIcon color="action" />
            <Typography variant="h6" fontWeight="bold">
              Filters
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'center',
              gap: isMobile ? 2 : 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6" fontWeight="bold">
                {trumpStats.True + trumpStats.False + trumpStats.Inconclusive}
              </Typography>
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  icon={<CheckCircleOutlineIcon />}
                  checkedIcon={<CheckCircleOutlineIcon />}
                  checked={trumpFilters.True}
                  onChange={() => toggleFilter('Trump', 'True')}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1">True:</Typography>
                  <Typography fontWeight="bold">{trumpStats.True}</Typography>
                </Box>
              }
            />

            <FormControlLabel
              control={
                <Checkbox
                  icon={<CancelOutlinedIcon />}
                  checkedIcon={<CancelOutlinedIcon />}
                  checked={trumpFilters.False}
                  onChange={() => toggleFilter('Trump', 'False')}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1">False:</Typography>
                  <Typography fontWeight="bold">{trumpStats.False}</Typography>
                </Box>
              }
            />

            <FormControlLabel
              control={
                <Checkbox
                  icon={<HelpOutlineIcon />}
                  checkedIcon={<HelpOutlineIcon />}
                  checked={trumpFilters.Inconclusive}
                  onChange={() => toggleFilter('Trump', 'Inconclusive')}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1">Unverifiable:</Typography>
                  <Typography fontWeight="bold">{trumpStats.Inconclusive}</Typography>
                </Box>
              }
            />
          </Box>
        </Box>
      </div>
    </div>
            <div className="facts-list">
              <TrumpFacts data={getFilteredFacts('Trump')} />
            </div>
          </div>
        </div>
        <div>
          <p className="note">Note: Facticity may get claim extraction, speaker attribution or results wrong. Facticity does not endorse any particular candidate.</p>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
