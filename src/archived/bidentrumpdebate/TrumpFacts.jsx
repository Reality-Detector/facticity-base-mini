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



const TrumpFacts = ({ data }) => {
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
        {data.filter((fact) => fact.speaker === 'Trump').reverse().map((item, index) => {
          const isClassificationFalse = item.Classification == "False"; // Adjust this condition based on your actual requirement
  
          return (
            <Card key={index} style={{ marginBottom: '10px', marginRight: '5px' }} className={isClassificationFalse ? 'glow' : ''}>
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
                      Classification: {item.Classification}
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
      </>
  );
};

export default TrumpFacts;
