import React, { useState } from 'react';
import { Button, Collapse, Typography, Card, CardContent, Alert, Badge } from '@mui/material';
import { marked } from 'marked';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const ExpandComponentSimple = ({ overall_assessment, sources, classification, disambiguation }) => {
  const [expanded, setExpanded] = useState(true);
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  const getColor = (classification) => {
    switch (classification) {
      case 'True':
        return 'success';
      case 'Processing':
        return 'warning';
      case 'False':
        return 'error';
      case 'Inconclusive':
        return 'warning';
      case 'Unverifiable':
        return 'warning';
      case '':
        return 'info';
      default:
        return 'info';
    }
  };

  const badgeColor = getColor(classification);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card variant="outlined" style={{ marginBottom: '10px', fontFamily: 'Helvetica' }}>
      <CardContent>
        <Button
          onClick={handleExpandClick}
          variant="contained"
          style={{
            width: '100%',
            backgroundColor: 'white',
            color: 'black',
            textAlign: 'left',
            boxShadow: 'none',
            textTransform: 'none'
          }}
        >
          <Badge
              color={badgeColor}
              badgeContent={classification}
           ></Badge>
        </Button>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent style={{ border: '1.5px solid #0A0A0A', borderRadius: '20px', fontSize: '20px', textAlign: 'center' }}>


            <Typography
              variant="body2"
              dangerouslySetInnerHTML={{
                __html: overall_assessment ? marked(overall_assessment) : 'Query failed. Please try again'
              }}
              style={{ fontFamily: 'Helvetica', fontSize: '18px' }}
            />

            {disambiguation && (
              <Alert severity="info" sx={{ fontFamily: 'Helvetica' }}>
                <Typography
                  variant="body2"
                  dangerouslySetInnerHTML={{
                    __html: marked("Let's disambiguate: " + disambiguation)
                  }}
                  style={{ fontFamily: 'Helvetica', fontSize: '15px' }}
                />
              </Alert>
            )}

            {sources.length > 0 && (
              <div style={{ marginTop: '10px' }}>
                {sources.map((source, index) => (
                  <Typography key={index} variant="body2" style={{ fontFamily: 'Helvetica', fontSize: 'small' }}>
                    <a href={source} target="_blank" rel="noopener noreferrer">
                      {index + 1}. {source}
                    </a>
                  </Typography>
                ))}
              </div>
            )}
          </CardContent>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default ExpandComponentSimple;
