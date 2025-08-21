import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { marked } from 'marked';
import BarChartComponent from './BarChart';
import BidenFacts from './BidenFacts';
import TrumpFacts from './TrumpFacts';
import 'bootstrap/dist/css/bootstrap.min.css';
import AboutModal from './Modal';
import trumpImg from './trump_3.jpg';
import bidenImg from './biden_2.jpg';
import './Dashboard.css'; // Import the CSS file
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaBullhorn } from 'react-icons/fa'; // Import the microphone icon
import { useAppContext } from '../AppProvider';
const Dashboard = () => {
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
      const response = await axios.get(backendUrl+'/get-data');

      const newData = response.data;

      const trumpData = newData.filter(fact => fact.speaker === 'Trump');
      const bidenData = newData.filter(fact => fact.speaker === 'Biden');

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

      // Check for increase in false counts and display toast notifications
      // if (newTrumpStats.False > trumpStats.False) {
      //   toast.error(<><FaBullhorn /> Trump Lied!</>, {
      //     className: 'custom-toast',
      //     bodyClassName: 'custom-toast-body',
      //   });
      // }
      // if (newBidenStats.False > bidenStats.False) {
      //   toast.error(<><FaBullhorn /> Biden Lied!</>, {
      //     className: 'custom-toast',
      //     bodyClassName: 'custom-toast-body',
      //   });
      // }

      setData(newData);
      setTrumpStats(newTrumpStats);
      setBidenStats(newBidenStats);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data initially
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
    let filters = candidate === 'Biden' ? bidenFilters : trumpFilters;
    return data.filter(fact =>
      fact.speaker === candidate && filters[fact.Classification]
    );
  };

  return (
    <>
      <div style={{ backgroundColor: 'gray' }}>
        <ToastContainer />
        <nav className="navbar">
          <div style={{ display: 'flex', gap: '20px' }}><h1>Facticity.AI</h1> <h3 style={{ marginTop: '10px' }}> <a href='https://www.aiseer.co'>by AI Seer</a></h3></div>
          <h5>Presidential Debate 2024: Live GenAI-powered Fact-Checking</h5>
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
              <img src={bidenImg} alt="Biden" />
              <h2>JOE BIDEN</h2>
            </div>
            <div>
              <h5>Fact-Checking Statistics for Statements from Biden </h5>
              <BarChartComponent trumpStats={bidenStats} />
            </div>
            <div className="filter-checkboxes">
              <div className="filter-checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={bidenFilters.True}
                    onChange={() => toggleFilter('Biden', 'True')}
                  />
                  <strong>True:</strong>
                </label>
                <p><strong>{bidenStats.True}</strong></p>
              </div>
              <div className="filter-checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={bidenFilters.False}
                    onChange={() => toggleFilter('Biden', 'False')}
                  />
                  <strong>False:</strong>
                </label>
                <p><strong>{bidenStats.False}</strong></p>
              </div>
              <div className="filter-checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={bidenFilters.Inconclusive}
                    onChange={() => toggleFilter('Biden', 'Inconclusive')}
                  />
                  <strong>Inconclusive:</strong>
                </label>
                <p><strong>{bidenStats.Inconclusive}</strong></p>
              </div>
            </div>
            {/* <div className="stats">
                            <strong>
                                <p>True: {bidenStats.True}</p>
                            </strong>
                            <strong>
                                <p>False: {bidenStats.False}</p>
                            </strong>
                            <strong>
                                <p>Inconclusive: {bidenStats.Inconclusive}</p>
                            </strong>
                        </div> */}
            <p>Latest cards appear on top</p>
            <div className="facts-list">
              <BidenFacts data={getFilteredFacts('Biden')} />
            </div>
          </div>
          <div className="candidate-section trump">
            <div className="candidate-header">
              <img src={trumpImg} alt="Trump" />
              <h2>DONALD TRUMP</h2>
            </div>
            <div>
              <h5>Fact-Checking Statistics for Statements from Trump</h5>
              <BarChartComponent trumpStats={trumpStats} />
            </div>
            <div className="filter-checkboxes">
              <div className="filter-checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={trumpFilters.True}
                    onChange={() => toggleFilter('Trump', 'True')}
                  />
                  <strong>True:</strong>
                </label>
                <p><strong>{trumpStats.True}</strong></p>
              </div>
              <div className="filter-checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={trumpFilters.False}
                    onChange={() => toggleFilter('Trump', 'False')}
                  />
                  <strong>False:</strong>
                </label>
                <p><strong>{trumpStats.False}</strong></p>
              </div>
              <div className="filter-checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={trumpFilters.Inconclusive}
                    onChange={() => toggleFilter('Trump', 'Inconclusive')}
                  />
                  <strong>Inconclusive:</strong>
                </label>
                <p><strong>{trumpStats.Inconclusive}</strong></p>
              </div>
            </div>
            {/* <div className="stats">
                            <strong>
                                <p>True: {trumpStats.True}</p>
                            </strong>
                            <strong>
                                <p>False: {trumpStats.False}</p>
                            </strong>
                            <strong>
                                <p>Inconclusive: {trumpStats.Inconclusive}</p>
                            </strong>
                        </div> */}
            <p>Latest cards appear on top</p>

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
