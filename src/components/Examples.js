import React from 'react';
import { Grid, Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';

const cardsData = [
  { id: 1, title: 'Text', image: 'https://via.placeholder.com/150', description: 'Type any fact' },
  { id: 2, title: 'Image', image: 'https://via.placeholder.com/150', description: 'Upload Image' },
  { id: 3, title: 'Video', image: 'https://via.placeholder.com/150', description: 'Upload Video or Link' },
  { id: 4, title: 'Doc', image: 'https://via.placeholder.com/150', description: 'Upload Document' },
];

function SquareCards() {
  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      {cardsData.map((card) => (
        <Grid item xs={12} sm={6} md={3} key={card.id} style={{ display: 'flex', justifyContent: 'center' }}>
          <Card style={{ width: 150 }}>
            <CardActionArea onClick={() => alert(`Clicked on ${card.title}`)}>
              <CardMedia
                component="img"
                alt={card.title}
                height="100"
                image={card.image}
                title={card.title}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {card.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {card.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default SquareCards;
