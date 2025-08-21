import React from "react";
import { Box, Card, CardActionArea, CardContent, Typography, Stack } from "@mui/material";

const sampleRecommendations = [
  // {
  //   type: "podcast",
  //   content: "Peter Thiel // The Diversity Myth, 30 Years Later",
  //   title: 'https://podcasts.apple.com/us/podcast/peter-thiel-the-diversity-myth-30-years-later/id1123461944?i=1000627021583',
  //   query: 'https://podcasts.apple.com/us/podcast/peter-thiel-the-diversity-myth-30-years-later/id1123461944?i=1000627021583',
  //   factChecked: false,
  // },
  {
    type: "video",
    content: "CNA: Half a million people in Singapore suffer from kidney disease",
    query: 'https://youtu.be/_qcLpNBleDM',
    title: "https://youtu.be/_qcLpNBleDM",
    factChecked: true,
    link : "https://app.facticity.ai/c/fa301f22-35f0-49a1-a221-a1abde7f54cd"

  }
];

const preFactCheckedSamples = [
  {
    type: "text",
    content: "MrBeast said, 'Life is so much easier when you're broke'",
    title: "Click to view the assessment of the fact-checked claims",
    query: "MrBeast said, 'Life is so much easier when you're broke'",
    factChecked: true,
    link: "https://app.facticity.ai/c/914f2860-ad83-4cbf-960f-382924f674f5",
  },
  {
    type: "para",
    content: "President Trump & Tariffs: Fact Sheet",
    query: "MrBeast said, 'Life is so much easier when you're broke'",
    title: "Click to view the assessment of the fact-checked claims",
    factChecked: true,
    link: "https://app.facticity.ai/c/e268e2a9-7fec-44ac-b09c-4700ca7f4e30",
  },
  {
    "type": "podcast",
    "content": "Peter Thiel, The Diversity Myth, 30 Years Later",
    "query": "https://podcasts.apple.com/us/podcast/peter-thiel-the-diversity-myth-30-years-later/id1123461944?i=1000627021583",
    "title": "Click to view the assessment of the fact-checked claims",
    "factChecked": true,
    "link": "https://app.facticity.ai/c/2cbf00f8-2772-41d5-a4a9-5243d1a47479",
  }
];

const ExampleCards = ({ setSearchQuery, setInternalTrigger }) => {
  const allSamples = [...preFactCheckedSamples, ...sampleRecommendations];

  const handleCardClick = (sample) => {
    if (sample.factChecked) {
      window.open(sample.link, "_blank");
    } else {
      setSearchQuery(sample.query);
      setInternalTrigger((prevState) => !prevState);
    }
  };

  return (
    <Box
  sx={{
    display: "grid",
    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
    gap: 1,
    mt: 0,
    px: { xs: 0.5, sm: 1 },
    maxWidth: "100%",
  }}
>
  {allSamples.map((sample, index) => (
    <Card
      key={index}
      sx={{
        width: "100%",
        borderRadius: 1.5,
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
        transition: "box-shadow 0.3s ease",
        "&:hover": { boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)" },
      }}
      onClick={() => handleCardClick(sample)}
    >
      <CardActionArea
        component={sample.factChecked ? "a" : "div"}
        href={sample.factChecked ? sample.link : undefined}
        target={sample.factChecked ? "_blank" : undefined}
      >
        <CardContent sx={{ p: 1.5 }}>
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 1 }}>
            <Typography
              variant="caption"
              sx={{
                px: 0.5,
                py: 0.2,
                color: sample.factChecked ? "#155724" : "#1E88E5",
                fontSize: { xs: "9px", sm: "10px" },
                fontWeight: "bold",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {sample.factChecked ? "View Assessment ✅" : "Start Check 🔍"}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                px: 0.5,
                py: 0.2,
                backgroundColor: ["text", "para"].includes(sample.type) ? "#D4EDDA" : "#E3F2FD",
                color: ["text", "para"].includes(sample.type) ? "#757575" : "#D32F2F",                  
                fontSize: { xs: "9px", sm: "10px" },
                fontWeight: "bold",
                borderRadius: 1,
              }}
            >
              {{
                text: "Text",
                video: "Video",
                podcast: "Podcast"
              }[sample.type] || "Long Text"}
            </Typography>
          </Stack>

          <Typography variant="body2" sx={{ fontSize: { xs: "11px", sm: "12px" }, lineHeight: 1.3 }}>
            {sample.content}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  ))}
</Box>

  );
};

export default ExampleCards;
