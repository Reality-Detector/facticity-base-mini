import React from "react";
import { Container, Typography, Box, Paper, useTheme, useMediaQuery } from "@mui/material";

function BlogTimesBestInventions() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Container
      maxWidth="md"
      sx={{
        mt: 4,
        mb: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          padding: isMobile ? 2 : 4,
          borderRadius: 3,
          background: "#F1F3FE",
          textAlign: "center",
        }}
      >
        <Typography
          variant={isMobile ? "h4" : "h3"}
          gutterBottom
          sx={{ fontWeight: "bold", color: "#0066FF" }}
        >
          Facticity.AI Named to TIME’s Best Inventions of 2024
        </Typography>
        <Box sx={{ mt: 3 }}>
          <img
            src="https://img.pr.com/w1685-h850/release/2411/546267/pressrelease_546267_1730441961.jpeg"
            alt="Facticity AI Award"
            style={{ width: "100%", maxWidth: "600px", borderRadius: "8px" }}
          />
        </Box>
        <Typography
          variant="body1"
          sx={{
            color: "#333",
            fontSize: isMobile ? "1rem" : "1.1rem",
            textAlign: "justify",
          }}
        >
                TIME revealed its annual list of the Best Inventions, which features 200 extraordinary innovations including AI Seer's Facticity.AI which is changing our lives. To compile this year's list, TIME solicited nominations from TIME editors and correspondents around the world. TIME then evaluated each contender on a number of key factors, including originality, efficacy, ambition, and impact. Of the new list, TIME’s editors write: “The result is a list of 200 groundbreaking inventions… that are changing how we live, work, play, and think about what’s possible.” About the Digital Fact-Checker Facticity.AI, TIME writes: "In a world of disinformation, Facticity.AI, an artificially intelligent fact-checking tool developed by Singapore start-up AI Seer, seeks to tip the scales in the truth’s favor. Facticity’s online tool, released in beta in June, checks claims in text and video and provides references and links to reliable sources. The company claims 92% accuracy, beating competitor tools like Bing CoPilot, Perplexity, and Originality.ai (which claims about 72% accuracy on fact-checking). Facticity was put to the test during the most recent presidential debate, checking almost 250 claims in near real-time." Jacob Kozhipatt, a former Business Insider reporter who worked with the AI Seer team to manually verify its checks for this high-stake event, says he was impressed by Facticity's capacity of 20xing mainstream media fact-checking abilities as evidenced by its performance during the Harris V Trump debate. He has since joined the Advisory Board of AI Seer.
                <br></br>
                <br></br>
                Initially entitled Facts, TIME Magazine aimed to present news in a digestible format, allowing readers to stay informed in a short amount of time which is an aim that Facticity.AI’s Co-Inventor and Founder of AI Seer Dennis Yap shares, "In this age where most of us are inundated with information through a fallible information ecosystem, now much of it AI-generated, to some degree untrue or fallaciously appealing to emotions, and getting harder and harder to keep up with, never-mind fact-check of and make sense of." AI Seer is a startup headquartered in Singapore, with three full-time headcount, that has created the world’s most demonstrably accurate (review the bench-marking against the multilingual and English APJ datasets at this link), accessible, timely, and explainable LLM App. In doing so, it has invented the only LLM App to come from and become part of the exclusive list of less than 10 estimated Inventions from a Singaporean-based corporations to have been recognized by TIME in their Best Inventions List and an estimate puts it that less than 1-5% of the inventions have come from startups since it was created decades ago. This Singaporean startup credits their visionary VC Tim Draper who gives out life and startup advice: “Small teams make big things happen” and helped keep them alive during the funding blizzard of SEA. Tim believes in the intrinsic value of being able to fact-check anything one sees or hears and helped show to the world that they could take on rival apps like Perplexity.AI and human fact-checker-powered media outlets with more than one-two order of magnitude of funding. AI Seer is becoming relevant like never before, as seeing is no longer sufficient for believing.
                <br></br>
                <br></br>
                According to experienced Founder and CEO, Denis Branthonne of Novade, “Facticity.AI seems really exciting, I thought those business models were reserved for the US, if AI Seer can succeed in Singapore that would be a fantastic story!” Even, just last weekend, Channel News Asia wrote that “The Republic (of Singapore) might be considered a trailblazer in terms of setting international standards for AI governance, such as launching the world’s first Model AI Governance Framework in 2019. But Singapore does (or did) not have a commercialized consumer-facing product like ChatGPT to boast about.” Founder Dennis Yap accepts this unlikely achievement on behalf of the struggling and sincere entrepreneurs and creators of Southeast Asia who often fail because of the institutional funding gaps both at the seed stage or past Series B. Dennis joked with a GP recently that the new preference for Distributions to Paid-in Capital over IRR is something almost every brick and mortar entrepreneur in Singapore is familiar because of the high rate of retail premise lease turnover. Even at this moment when LLM Apps have immense potential to augment and automate work like hypothesis testing, fact-checking and footnoting which can feel like a mechanical and boring task at times, freeing up more time for creatives to engage in more accurate and creative forms of self-expression, finding institutional funding can still feel like looking for a spark in a blizzard after a too abrupt reversal of too much easy money misspent during ZIRP on too good to be true pitches and pitchers.
                <br></br>
                <br></br>
                Even today, AI Seer has not raised anything close to what the 10th placed Reforged Labs which raised 3.9million USD according to the Top Funded GenAI Startups in Southeast Asia list just published by the GenAI Fund in October 2024. It has thus far only raised 280K USD in funding since it invented Facticity.AI in January 2024 but has received extensive technical and financial assistance from different American MNCs, including to integrate with the leading-edge Lakehouse, a privacy-enhancing data infrastructure which is used by global leaders like Grammarly. AI Seer also joined the AI Verify Foundation this month to help improve global AI safety by contributing a localized, multilingual dataset for factuality benchmarking through Project Moonshot in line with promoting trustworthy AI through transparency and accountability. Facticity.AI prioritizes explainability from credible sources to support a more equitable, accountable, and transparent AI ecosystem for all stakeholders.
                <br></br>
                <br></br>
                How was this unlikely feat achieved, given the growing awareness of LLMs to be hallucinatory or even deliberately deceptive? According to CTO AM Shahruj, "Structuring and guardrailing the Multi-LLM solution is key, as different LLMs have different strengths." He also adds that in co-inventing Facticity.AI, “I’ve come face-to-face with the ethical and technical complexities of information, truth, and the impact of automation on human thought itself. This, among other experiences, has inspired a vision for a world where technology reinforces, rather than undermines, humanity's collective pursuit of knowledge.” His fellow co-inventors include but are not limited to Von Wong and Sriram Srikanth. One of AI Seer’s angel investors, Richard Tsan‐Kwong Yen, founded Ednovation and has worked at AT&T (United States), Nokia (United States), Harvard University, IBM Research - Thomas J. Watson Research Center. Richard remarked, “This is an out-of-this-world achievement! Being an entrepreneur and inventor myself, I know how much hard work and heartache goes into such amazing achievement.” Existing investors like Richard have put in more money since the Award was announced. Anybody can sign up to be on the beta tester waitlist for the Facticity.AI Integration with Microsoft Word which will be publicly launched in about two months here. Paul Kozhipatt, a former consultant a Big Four company, mentioned, "The tool has great use cases in financial services, specifically when compiling/crafting reports."
                <br></br>
                <br></br>
                AI Seer’s founder Dennis was educated in Princeton, NJ, and spent much of his time with its luminaries, Michael Walzer and Anthony Appiah at the Institute for Advanced Study and Princeton University thinking deeply about fundamental research and Max Weber’s Theory of Causality in the field of Science, Technology and Society. He also did research for a VC on the organization design and corporate governance of pioneers such as Thomas Edison’s labs which became the deep-tech research arm of General Electric, before deciding to create an inventive startup. Two of his favorite quotes are: "TIME is really the only capital that any human being has, and the only thing he can't afford to lose." – Thomas Edison and “Fortune gives unto us nothing which we can really own.” – Epictetus. He is in the midst of writing about these experiences in an essay to be entitled, “Innovation as a Vocation” and is heavily influenced by Weber who was a European proto-Existentialist who popularized the modern fact vs. values distinction. Existentialism is the philosophy that contrasts Facticity (in French: facticité, German: Faktizität) to Transcendence of the ego, and Johann Goethe and Max Weber would emphasize how "Elective Affinities" interlock Facticity and Transcendence in complex bi-directional ways. He would also like to dedicate this award to his Grandfather Yap Soo Hai who was a Deacon, Secretary, and Superintendent of the Sunday School of the Bible Presbyterian Church formerly at Prinsep Street Singapore, who lost his Raffles Institution GCE "O" Level Certificate during the Japanese Invasion of Singapore and wouldn't have had to struggle so much in his career and life because of his honesty and the loss of so many historical records and cultural heritage during that period.
                        
        </Typography>


      </Paper>
    </Container>
  );
}

export default BlogTimesBestInventions;