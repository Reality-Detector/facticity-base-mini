import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Collapse,
  IconButton,
  Typography,
  Badge
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {marked} from 'marked';
import './Facts.css'; // Import your CSS file
import Alert from '@mui/material/Alert';


const BidenFacts = ({ data }) => {
  const [expanded, setExpanded] = useState({});

  const handleExpandClick = (index) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [index]: !prevExpanded[index],
    }));
  };

  const getStatusBadge = (classification) => {
    switch (classification) {
      case 'True':
        return <Badge color="success" badgeContent="✓" />;
      case 'False':
        return <Badge color="error" badgeContent="✕" />;
      case 'Inconclusive':
        return <Badge color="warning" badgeContent="-" />;
      default:
        return null;
    }
  };

  const getStatusColor = (classification) => {
    switch (classification) {
      case 'True':
        return 'green';
      case 'False':
        return 'red';
      case 'Inconclusive':
        return 'orange';
      default:
        return 'inherit'; // Default color
    }
  };

  return (
    <>
    <div style= {{backgroundColor: 'white', padding: '20px'}}>      
    {data.filter((fact) => fact.speaker === 'Kamala').map((item, index) => {
      const isClassificationFalse = item.Classification == "False"; // Adjust this condition based on your actual requirement

      return (
        // <Card key={index} style={{ marginBottom: '10px', marginRight: '5px' }} className={isClassificationFalse ? 'glow' : ''}>
        <Card key={index} style={{ marginBottom: '10px', marginRight: '5px' }}>
          <CardHeader
            title={<strong>{item.result.question}</strong>}
            subheader={
              <React.Fragment>
                <span style={{ marginLeft: '10px' }}>
                  {getStatusBadge(item.Classification)}
                </span>
                <span
                  style={{
                    marginLeft: '10px',
                    marginRight: '5px',
                    color: getStatusColor(item.Classification),
                    paddingLeft: '5px',
                  }}
                >
  Classification: {item.Classification === 'Inconclusive' ? 'Unverifiable' : item.Classification}
  </span>
              </React.Fragment>
            }
            action={
              <IconButton
                onClick={() => handleExpandClick(index)}
                aria-expanded={expanded[index] || false}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </IconButton>
            }
            className={isClassificationFalse ? 'glow' : ''}
          />
          <Collapse in={expanded[index]} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography variant="body2" color="textSecondary" component="p">
                <strong>Overall Assessment:</strong>
                <div dangerouslySetInnerHTML={{ __html: marked(item.result.overall_assessment) }} />
              </Typography>
              { item.result.disambiguation !== "" && (
                          <div>
                            <Alert severity="info" sx={{ fontFamily: 'IBM Plex Sans' }}>
                                <Typography
                                  variant="body2"
                                  dangerouslySetInnerHTML={{ __html: item.result.disambiguation ? marked("Let's disambiguate: "+item.result.disambiguation) : 'Query failed. Please try again' }}
                                  style={{ fontFamily: 'IBM Plex Sans', fontSize: '15px' }}
                                />
                              {/* Let's disambiguate: {marked(disambiguation)} */}
                            </Alert>
                            <br></br>
                          </div>
                        )}
              <div>
                <h5>Sources</h5>
                <ul>
                  {item.result.sources[0].sources.map((source, i) => (
                    <li key={i}><a href={source}>{source}</a></li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Collapse>
        </Card>
      );
    })}
    </div>
  </>
  );
};

export default BidenFacts;
