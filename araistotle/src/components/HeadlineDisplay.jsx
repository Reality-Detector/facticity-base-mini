import { useState, useEffect } from "react";
import { Box, Typography, IconButton, useMediaQuery, Button, Card, CardContent, Chip  } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const HeadlineDisplay = ({ headlines, setSearchQuery }) => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [showAll, setShowAll] = useState(false);

  const displayedHeadlines = showAll ? headlines : headlines.slice(0, 3);
  const hasMore = headlines.length > 3;

  return (
    <Box sx={{ textAlign: "center", p: 1, maxWidth: "100%", marginBottom: '10px', marginTop: '10px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
        <TrendingUpIcon sx={{ color: '#0066FF', mr: 1, fontSize: '1.1rem' }} />
        <Typography color="primary" sx={{ fontSize: "1rem", mb: 1, color: '#0066FF' }}>
        Try Fact-Checking These Trending Headlines
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          maxWidth: '800px',
          margin: '0 auto'
        }}
      >
        {displayedHeadlines.map((article, index) => (
          <Card
            key={index}
            onClick={() => setSearchQuery(article)}
            sx={{
              cursor: "pointer",
              transition: 'all 0.2s ease-in-out',
              borderRadius: 1.5,
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
                borderColor: '#0066FF',
              },
              '&:active': {
                transform: 'translateY(0px)',
              }
            }}
          >
            <CardContent sx={{ 
              padding: isMobile ? '8px 12px' : '10px 16px',
              '&:last-child': { paddingBottom: isMobile ? '8px' : '10px' }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <Chip
                  label={`${index + 1}`}
                  size="small"
                  sx={{
                    backgroundColor: '#f0f7ff',
                    color: '#0066FF',
                    fontWeight: 600,
                    minWidth: '24px',
                    height: '20px',
                    fontSize: '0.7rem',
                    flexShrink: 0,
                    mt: 0.25
                  }}
                />
                <Typography
                  sx={{
                    fontSize: isMobile ? "0.8rem" : "0.9rem",
                    lineHeight: 1.4,
                    color: '#333',
                    fontWeight: 500,
                    textAlign: 'left',
                    wordBreak: "break-word",
                    flex: 1
                  }}
                >
                  {article}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
        
        {hasMore && !showAll && (
          <Box
            onClick={() => setShowAll(true)}
            sx={{
              cursor: "pointer",
              transition: 'all 0.2s ease-in-out',
              padding: isMobile ? '8px 12px' : '10px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              '&:hover': {
                '& .MuiSvgIcon-root': {
                  color: '#0066FF',
                },
                '& .MuiTypography-root': {
                  color: '#0066FF',
                }
              },
            }}
          >
            <ExpandMoreIcon sx={{ color: '#999', fontSize: '1rem', transition: 'color 0.2s ease-in-out' }} />
            <Typography
              sx={{
                fontSize: isMobile ? "0.75rem" : "0.85rem",
                color: '#999',
                fontWeight: 500,
                textAlign: 'center',
                transition: 'color 0.2s ease-in-out'
              }}
            >
              Show {headlines.length - 3} more headlines
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HeadlineDisplay;
