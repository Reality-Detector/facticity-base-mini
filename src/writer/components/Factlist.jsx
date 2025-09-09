import React, { useState, useContext, useEffect } from 'react';
import {
  List,
  ListItemText,
  Typography,
  Button,
  Box,
  Collapse,
  IconButton,
  Divider,
  Link,
  Paper,
  Menu,
  MenuItem,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import InfoIcon from '@mui/icons-material/Info';
import FactDetailsModal from './FactDetailsModal'; // Import the FactDetailsModal component
// import { green, red, grey } from '@mui/material/colors';
import { green, red, yellow, grey} from '@mui/material/colors';
import { AppContext } from "./AppContext";
import ClickSourceLink from './SourceComponents/hoverSource';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { formatInTextCitation } from './citations/APAutility';
import SourceBreakdown from './SourceComponents/sourceBreakdown';
import DescriptionIcon from '@mui/icons-material/Description'; //
import TaskActions from './InteractionBar';
import { useAppContext } from '../../AppProvider';
import { motion, AnimatePresence } from 'framer-motion';


const classificationColors = {
  True: green[500],
  False: red[500],
  Unverifiable: grey[500],
};

// Map classification to border color for each fact card
const classificationBorderColor = {
  True: 'green',
  False: 'red',
  Unverifiable: 'yellow',
  'Insufficient Evidence': 'grey',
};

const FactList = ({ facts = [], onCorrect, onCorrectHyperlink, handleAdd, handleAddCitation, onDismiss, commentClaim, filter }) => {
  const demoFacts = [...facts];
  const router = useRouter();
  const { userCredits, setUserCredits } = useAppContext();


  // const demoFacts = [
  //   {
  //     "Classification": "True",
  //     "correction_text": [
  //         {
  //             "metadata": {
  //                 "authors": [],
  //                 "content": "No content",
  //                 "source_type": "Web Source",
  //                 "title": "No title",
  //                 "url": "https://www.space.com/58-the-sun-formation-facts-and-characteristics.html](https://www.space.com/58-the-sun-formation-facts-and-characteristics.html",
  //                 "website": "Space",
  //                 "year": "n.d."
  //             },
  //             "summary": "The Sun's gravitational pull keeps the planets, asteroids, and comets in orbit, making it the central and most significant body of the solar system."
  //         }
  //     ],
  //     "disambiguation": "The claim suggests that the Sun's gravitational pull is responsible for keeping the planets, asteroids, and comets in orbit, and it refers to the Sun as the \"heart\" of the solar system. Key terms include \"gravitational pull,\" which refers to the force exerted by the Sun that keeps celestial bodies in orbit, and \"heart of the solar system,\" implying the central and most significant role of the Sun in the solar system's structure and dynamics. The claim is straightforward, with no significant ambiguities affecting the fact-checking process.",
  //     "evidence": {
  //         "https://coolcosmos.ipac.caltech.edu/ask/5-How-large-is-the-Sun-compared-to-Earth-": "How large is the Sun compared to Earth? | Cool Cosmos It is so large that about 1,300,000 planet Earths can fit inside of it. Earth is about the size of an average sunspot! Exexo_banner_image\u00a0...",
  //         "https://medium.com/@clay.c.edgar/if-earth-was-a-grain-of-sand-22ea58f43d5e": "If Earth Was a Grain of Sand. The universe is big. | by Clay C. Edgar ... Jun 19, 2018 ... The size of the Sun compared to the size of a sand-grain Earth. The Earth would orbit our pool ball sized Sun at around 6 meters (19.5 feet).",
  //         "https://science.nasa.gov/resource/solar-system-sizes/": "Solar System Sizes - NASA Science Oct 24, 2003 ... This illustration shows the approximate sizes of the planets relative to each other. Outward from the Sun, the planets are Mercury, Venus, Earth, Mars, Jupiter\u00a0...",
  //         "https://spaceplace.nasa.gov/sun-compare/": "How Does Our Sun Compare With Other Stars? | NASA Space Place ... It is 864,000 miles (1,392,000 km) in diameter, which makes it 109 times wider than Earth. ... a cartoon showing the size comparison of our sun, other suns,\u00a0...",
  //         "https://www.nisenet.org/sites/default/files/catalog/uploads/ExSci_Space_Solar%20Eclipse_SizingUp.pdf": "Sizing Up the Sun, Earth, and Moon Then why do the Sun and Moon look the same size to us? The Sun is about 400 times bigger across than the Moon, but it also happens to.",
  //         "https://www.skyatnightmagazine.com/space-science/how-many-earths-can-fit-sun": "This is how many Earths could fit in the Sun | BBC Sky at Night ... Feb 27, 2024 ... How big is Earth compared to the Sun, and how many times would our planet squish into the space occupied by our host star? Magazine gift\u00a0...",
  //         "https://www.space.com/58-the-sun-formation-facts-and-characteristics.html": "Earth's sun: Facts about the sun's age, size and history | Space Mar 23, 2022 ... It holds 99.8% of the solar system's mass and is roughly 109 times the diameter of the Earth \u2014 about one million Earths could fit inside the sun\u00a0..."
  //     },
  //     "input": "The Sun's gravitational pull keeps the planets, asteroids, and comets in orbit, making it the heart of the solar system.",
  //     "overall_assessment": "The claim is true. The Sun's gravitational pull is indeed the dominant force that keeps the planets, asteroids, and comets in orbit around it, making it the central body of the solar system. This is supported by multiple reputable sources, including Space.com and BBC Sky at Night Magazine, which confirm that the Sun holds 99.8% of the solar system's mass and is the largest object within it, thus playing a crucial role in maintaining the orbits of other celestial bodies. [https://www.space.com/58-the-sun-formation-facts-and-characteristics.html](https://www.space.com/58-the-sun-formation-facts-and-characteristics.html), [https://www.skyatnightmagazine.com/space-science/how-many-earths-can-fit-sun](https://www.skyatnightmagazine.com/space-science/how-many-earths-can-fit-sun)",
  //     "references": {},
  //     "sources": [
  //         {
  //             "sources": [
  //                 "https://www.skyatnightmagazine.com/space-science/how-many-earths-can-fit-sun",
  //                 "https://coolcosmos.ipac.caltech.edu/ask/5-How-large-is-the-Sun-compared-to-Earth-",
  //                 "https://medium.com/@clay.c.edgar/if-earth-was-a-grain-of-sand-22ea58f43d5e",
  //                 "https://www.space.com/58-the-sun-formation-facts-and-characteristics.html",
  //                 "https://science.nasa.gov/resource/solar-system-sizes/",
  //                 "https://www.nisenet.org/sites/default/files/catalog/uploads/ExSci_Space_Solar%20Eclipse_SizingUp.pdf"
  //             ],
  //             "support": "None"
  //         }
  //     ],
  //     "sources_array": {
  //         "negative": [],
  //         "neutral": [
  //             {
  //                 "metadata": {
  //                     "authors": [],
  //                     "content": "No content",
  //                     "source_type": "Web Source",
  //                     "title": "No title",
  //                     "url": "https://www.nisenet.org/sites/default/files/catalog/uploads/ExSci_Space_Solar%20Eclipse_SizingUp.pdf",
  //                     "website": "Nisenet",
  //                     "year": "n.d."
  //                 },
  //                 "summary": "The source discusses the relative sizes of the Sun, Earth, and Moon, explaining that the Sun is significantly larger than the Moon. The Sun's gravitational pull is not mentioned in this excerpt."
  //             }
  //         ],
  //         "positive": [
  //             {
  //                 "metadata": {
  //                     "authors": [
  //                         "Science Writer",
  //                         "Jenny Winder Is An Astronomy Writer"
  //                     ],
  //                     "content": "Though our Sun is an average-sized star, it is the largest object in our Solar System.\n\nThe Sun accounts for 99.8% of our Solar System's mass, so the mass of all the planets combined makes up just 0.2% of the Sun's mass.\n\nThe answer to the question how many Earths can fit in the Sun depends on how you measure, for example, by mass, volume, or diameter.\n\nAn image of the Sun captured by NASA's Solar Dynamics Observatory. How many Earths could fit in the Sun? Credit: NASA/SDO\n\nThe Sun's mass is 1,988,500x10^24 kg, and Earth's is 5.9724 x10^24 kg, so one Sun equals about 333,000 Earth masses.\n\nBy volume, the Sun is 1,412,000 x10^12 km^3, and Earth is 1.083 x10^12 km^3, so it would take 1.3 million Earths to fill the Sun (assuming the Earth spheres are squishy and pack in with no gaps!)\n\nThe Sun's diameter is 1,392,000 km (864,000 miles), and Earth's is 12,742 km (7,917 miles), so Earth could line up 109 times across the face of the Sun.\n\nThe surface area of the Sun is 12,000 times that of the Earth's\n\nWhat about the biggest and smallest planets in our Solar System? How many of them could fit in the Sun?\n\nJupiter, the largest planet, has a mass of 1,900x10^24 kg, 318 times that of the Earth, and would fit 1,000 times into the Sun.\n\nMercury is the smallest of our planets, with a mass of just 0.330x10^24 kg, so you would need 21.2 million Mercurys to fill the Sun.\n\nDwarf planet Pluto has just 1% of the mass of Earth, so more than 200 million Plutos are equal to the Sun's mass.\n\nOur Moon is 400 times smaller than the Sun and 27 million times less massive. You would need 64.3 million Moons to equal the Sun.",
  //                     "source_type": "Web Source",
  //                     "title": "This is how many Earths could fit in the Sun",
  //                     "url": "https://www.skyatnightmagazine.com/space-science/how-many-earths-can-fit-sun",
  //                     "website": "Skyatnightmagazine",
  //                     "year": 2024
  //                 },
  //                 "summary": "The Sun is the largest object in our solar system and accounts for 99.8% of its mass."
  //             },
  //             {
  //                 "metadata": {
  //                     "authors": [],
  //                     "content": "Compared to Earth, the Sun is enormous! It contains 99.86% of all of the mass of the entire Solar System. The Sun is 864,400 miles (1,391,000 kilometers) across. This is about 109 times the diameter of Earth. The Sun weighs about 333,000 times as much as Earth. It is so large that about 1,300,000 planet Earths can fit inside of it. Earth is about the size of an average sunspot!",
  //                     "source_type": "Web Source",
  //                     "title": "How large is the Sun compared to Earth?",
  //                     "url": "https://coolcosmos.ipac.caltech.edu/ask/5-How-large-is-the-Sun-compared-to-Earth-",
  //                     "website": "Coolcosmos",
  //                     "year": "n.d."
  //                 },
  //                 "summary": "The Sun is 864,400 miles (1,391,000 kilometers) across, about 109 times the diameter of Earth. It weighs 333,000 times as much as Earth. The Sun contains 99.86% of the mass of the Solar System."
  //             },
  //             {
  //                 "metadata": {
  //                     "authors": [
  //                         "Clay C. Edgar"
  //                     ],
  //                     "content": "If Earth Was a Grain of Sand Clay C. Edgar \u00b7 Follow 5 min read \u00b7 Jun 19, 2018 -- 3 Listen Share\n\nThe universe is big.\n\nOkay, that might be the biggest understatement of the century, but a fact nonetheless. Humans are inherently bad at judging how big and far away things are in the cosmos. Things are simply too big and the distances between those things are far too vast.\n\nIn the modern era, with intercontinental air flight travel, I believe you can get a pretty good idea for how big the Earth is. After all, we can circumnavigate the globe in less than two days, and astronauts can do it in 90 minutes. But, what about other objects in our own neighborhood? How big is the Sun? How far away from the Sun is Earth? How big is our solar system and the Milky Way galaxy? These distances are enormously vast and basically incomprehensible. Can we more easily visualize these vast numbers if we scale things down?\u2026\n\nWay down\u2026\n\nLet\u2019s scale the Earth down to the size of a grain of sand, which is roughly the size of the period at the end of this sentence. You are here \u2192 .\n\nBilliards, Anyone?\n\nIf the Earth was the size of a grain of sand, the Sun would be about the size of a pool ball (5.5cm or 2.17in). The moon, barely a visible spec of dust at this scale, would orbit our tiny grain-sized planet from 1.5cm away (about the width of your finger tip).\n\nThe size of the Sun compared to the size of a sand-grain Earth.\n\nThe Earth would orbit our pool ball sized Sun at around 6 meters (19.5 feet). In our scale, the speed of light scales down as well so it would appear to move more slowly. Light would still take about eight minutes to reach our planet from the Sun. Try taking eight minutes to walk 19 feet, it\u2019s dreadfully slow; the pace is around 2.4 feet per minute, which is also the maximum speed a garden snail can move. Even though the speed of light is the absolute fastest speed that anything can travel in the universe, it\u2019s still really, really, really slow at cosmic scales. At our scale, the speed of light literally moves at a snail\u2019s pace.\n\nOur sun is a fairly average-sized star. However, there are stars that are, you guessed it, much, much bigger. One of the largest stars we can detect is VY Canis Majoris. Given our scale, the star would be about 39 meters in diameter (128 feet). Compare that 39 meters to our tiny pool ball sun and you can begin to image how massive things can be in our universe.\n\nPluto, once known to many of us as a planet of our solar system, would orbit the Sun from 232 meters away (762 feet), which is twice the length of an American football field, making the entire solar system bigger than 4 football fields all placed end-to-end.",
  //                     "source_type": "Web Source",
  //                     "title": "If Earth Was a Grain of Sand",
  //                     "url": "https://medium.com/@clay.c.edgar/if-earth-was-a-grain-of-sand-22ea58f43d5e",
  //                     "website": "Medium",
  //                     "year": 2018
  //                 },
  //                 "summary": "The article discusses the relative sizes of the Sun, Earth, and other celestial bodies in our solar system using a grain of sand as a representation of Earth. The Sun is compared to a pool ball and the Earth orbits the Sun at a distance  of around 6 meters (19.5 feet) in this scale."
  //             },
  //             {
  //                 "metadata": {
  //                     "authors": [
  //                         "Charles Q. Choi",
  //                         "Contributing Writer",
  //                         "Social Links Navigation"
  //                     ],
  //                     "content": "One of the first images taken by the ESA/NASA Solar Orbiter during its first close pass at the sun in 2020.\n\nThe sun lies at the heart of the solar system, where it is by far the largest object. It holds 99.8% of the solar system's mass and is roughly 109 times the diameter of the Earth \u2014 about one million Earths could fit inside the sun.\n\nThe surface of the sun is about 10,000 degrees Fahrenheit (5,500 degrees Celsius) hot, while temperatures in the core reach more than 27 million F (15 million C), driven by nuclear reactions. One would need to explode 100 billion tons of dynamite every second to match the energy produced by the sun, according to NASA.\n\nThe sun is one of more than 100 billion stars in the Milky Way. It orbits some 25,000 light-years from the galactic core, completing a revolution once every 250 million years or so. The sun is relatively young, part of a generation of stars known as Population I, which are relatively rich in elements heavier than helium. An older generation of stars is called Population II, and an earlier generation of Population III may have existed, although no members of this generation are known yet.\n\nRelated: How hot is the sun?\n\nHow the sun formed\n\nThe sun was born about 4.6 billion years ago. Many scientists think the sun and the rest of the solar system formed from a giant, rotating cloud of gas and dust known as the solar nebula. As the nebula collapsed because of its gravity, it spun faster and flattened into a disk. Most of the material was pulled toward the center to form the sun.\n\nRelated: How was the sun formed?\n\nThe sun has enough nuclear fuel to stay much as it is now for another 5 billion years. After that, it will swell to become a red giant. Eventually, it will shed its outer layers, and the remaining core will collapse to become a white dwarf. Slowly, the white dwarf will fade, and will enter its final phase as a dim, cool theoretical object sometimes known as a black dwarf.\n\nRelated: When will the sun die?\n\nDiagram showing the sun at the center of our solar system (not to scale). (Image credit: NASA/JPL-Caltech)\n\nInternal structure and atmosphere of the sun\n\nThe sun and the atmosphere of the sun are divided into several zones and layers. The solar interior, from the inside out, is made up of the core, radiative zone and the convective zone. The solar atmosphere above that consists of the photosphere, chromosphere, a transition region and the corona. Beyond that is the solar wind, an outflow of gas from the corona.\n\nThe core extends from the sun's center to about a quarter of the way to its surface. Although it only makes up roughly 2% of the sun's volume, it is almost 15 times the density of lead and holds nearly half of the sun's mass. Next is the radiative zone, which extends from the core to 70% of the way to the sun's surface, making up 32 % of the sun's volume and 48% of its mass. Light from the core gets scattered in this zone, so that a single photon often may take a million years to pass through.\n\nThe convection zone reaches up to the sun's surface, and makes up 66% of the sun's volume but only a little more than 2% of its mass. Roiling \"convection cells\" of gas dominate this zone. Two main kinds of solar convection cells exist \u2014 granulation cells about 600 miles (1,000 kilometers) wide and supergranulation cells about 20,000 miles (30,000 km) in diameter.\n\nThe photosphere is the lowest layer of the sun's atmosphere, and emits the light we see. It is about 300 miles (500 km) thick, although most of the light comes from its lowest third. Temperatures in the photosphere range from 11,000 F (6,125 C) at the bottom to 7,460 F (4,125 C) at the top. Next up is the chromosphere, which is hotter, up to 35,500 F (19,725 C), and is apparently made up entirely of spiky structures known as spicules typically some 600 miles (1,000 km) across and up to 6,000 miles (10,000 km) high.\n\nAfter that is the transition region a few hundred to a few thousand miles thick, which is heated by the corona above it and sheds most of its light as ultraviolet rays. At the top is the super-hot corona, which is made of structures such as loops and streams of ionized gas. The corona generally ranges from 900,000 F (500,000 C) to 10.8 million F (6 million C) and can even reach tens of millions of degrees when a solar flare occurs. Matter from the corona is blown off as the solar wind.\n\nRelated: Space weather: Sunspots, solar flares & coronal mass ejections\n\nThe sun's magnetic field\n\nThe sun's magnetic field is typically only about twice as strong as Earth's magnetic field. However, it becomes highly concentrated in small areas, reaching up to 3,000 times stronger than usual. These kinks and twists in the magnetic field develop because the sun spins more rapidly at the equator than at higher latitudes and because the inner parts of the sun rotate more quickly than the surface.\n\nRelated: Huge magnetic 'ropes' drive powerful sun explosions\n\nThese distortions create features ranging from sunspots to spectacular eruptions known as flares and coronal mass ejections. Flares are the most violent eruptions in the solar system, while coronal mass ejections are less violent but involve extraordinary amounts of matter \u2014 a single ejection can spout roughly 20 billion tons (18 billion metric tons) of matter into space.\n\nChemical composition of the sun\n\nJust like most other stars, the sun is made up mostly of hydrogen, followed by helium. Nearly all the remaining matter consists of seven other elements \u2014 oxygen, carbon, neon, nitrogen, magnesium, iron and silicon. For every 1 million atoms of hydrogen in the sun, there are 98,000 of helium, 850 of oxygen, 360 of carbon, 120 of neon, 110 of nitrogen, 40 of magnesium, 35 of iron and 35 of silicon. Still, hydrogen is the lightest of all elements, so it only accounts for roughly 72% of the sun's mass, while helium makes up about 26%.\n\nRelated: What is the sun made of?\n\nSee how solar flares, sun storms and huge eruptions from the sun work in this SPACE.com infographic. View the full solar storm infographic here (Image credit: Karl Tate/SPACE.com)\n\nSunspots and solar cycles\n\nSunspots are relatively cool, dark features on the sun's surface that are often roughly circular. They emerge where dense bundles of magnetic field lines from the sun's interior break through the surface.\n\nThe number of sunspots varies as solar magnetic activity does \u2014 the change in this number, from a minimum of none to a maximum of roughly 250 sunspots or clusters of sunspots and then back to a minimum, is known as the solar cycle, and averages about 11 years long. At the end of a cycle, the magnetic field rapidly reverses its polarity.\n\nRelated: Largest sunspot in 24 years wows scientists, but also mystifies\n\nHistory of observing the sun\n\nThe ESA-NASA Solar Orbiter and NASA's Parker Solar Probe currently study the sun in unprecedented detail from a closer distance than any spacecraft before. (Image credit: Solar Orbiter: ESA/ATG medialab; Parker Solar Probe: NASA/Johns Hopkins APL)\n\nAncient cultures often modified natural rock formations or built stone monuments to mark the motions of the sun and moon, charting the seasons, creating calendars and monitoring eclipses. Many believed the sun revolved around the Earth, with the ancient Greek scholar Ptolemy formalizing this \"geocentric\" model in 150 B.C. Then, in 1543, Nicolaus Copernicus described a heliocentric (sun-centered) model of the solar system, and in 1610, Galileo Galilei's discovery of Jupiter's moons confirmed that not all heavenly bodies circled Earth.\n\nTo learn more about how the sun and other stars work, after early observations using rockets, scientists began studying the sun from Earth orbit. NASA launched a series of eight orbiting observatories known as the Orbiting Solar Observatory between 1962 and 1971. Seven of them were successful, and analyzed the sun at ultraviolet and X-ray wavelengths and photographed the super-hot corona, among other achievements.\n\nIn 1990, NASA and the European Space Agency launched the Ulysses probe to make the first observations of its polar regions. In 2004, NASA's Genesis spacecraft returned samples of the solar wind to Earth for study. In 2007, NASA's double-spacecraft Solar Terrestrial Relations Observatory (STEREO) mission returned the first three-dimensional images of the sun. NASA lost contact with STEREO-B in 2014, which remained out of contact except for a brief period in 2016. STEREO-A remains fully functional.\n\nThe Solar and Heliospheric Observatory (SOHO), which last year celebrated 25 years in space, has been one of the most important solar missions to date. Designed to study the solar wind, as well as the sun's outer layers and interior structure, it has imaged the structure of sunspots below the surface, measured the acceleration of the solar wind, discovered coronal waves and solar tornadoes, found more than 1,000 comets, and revolutionized our ability to forecast space weather.\n\nThe Solar Dynamics Observatory (SDO), launched in 2010, has returned never-before-seen details of material streaming outward and away from sunspots, as well as extreme close-ups of activity on the sun's surface and the first high-resolution measurements of solar flares in a broad range of extreme ultraviolet wavelengths.\n\nThe newest addition to the sun-observing fleet are NASA's Parker Solar Probe, launched in 2018, and ESA/NASA Solar Orbiter, launched in 2020. Both of these spacecraft orbit the sun closer than any spacecraft before, taking complementary measurements of the environment in the vicinity of the star.\n\nDuring its close passes, the Parker Solar Probe dives into the sun's outer atmosphere, the corona, having to withstand temperatures hotter than one million degrees Fahrenheit. At its nearest, the Parker Solar Probe will fly merely 4 million miles (6.5 million km) to the sun's surface (the distance between the sun and Earth is 93 million miles (150 million km)). The measurements it makes are helping scientists learn more about how energy flows through the sun, the structure of the solar wind, and how energetic particles are accelerated and transported.\n\nRelated: NASA Parker Solar Probe nails close flyby of sun as its space weather cycle ramps up\n\nWhile Solar Orbiter doesn't fly as close as the Parker Solar Probe, it is equipped with high-tech cameras and telescopes that take images of the sun's surface from the closest distance ever. It was not technically possible for the Parker Solar Probe to carry a camera that would look directly at the sun's surface.\n\nAt its closest, Solar Orbiter will pass at about 26 million miles (43 million km) away from the star \u2014 about 25% closer than Mercury. During its first perihelion, the point in its elliptical orbit closest to the sun, the spacecraft approached the sun to about half the distance from earth. The images acquired during the first perihelion, released in June last year, were the closest images of the sun ever taken and revealed previously unseen features on the star's surface \u2014 miniature flares dubbed the campfires.\n\nAfter Solar Orbiter completes a few close passes, mission controllers will start elevating its orbit out of the ecliptic plane in which planets orbit, to enable the spacecraft's cameras to take the first ever close-up images of the sun's poles. Mapping the activity in the polar regions will help scientists better understand the sun's magnetic field, which drives the 11-year solar cycle.\n\nThis article was updated on June 9, 2021 by Space.com senior writer Tereza Pultarova.",
  //                     "source_type": "Web Source",
  //                     "title": "Earth's sun: Facts about the sun's age, size and history",
  //                     "url": "https://www.space.com/58-the-sun-formation-facts-and-characteristics.html",
  //                     "website": "Space",
  //                     "year": 2021
  //                 },
  //                 "summary": "The sun lies at the heart of the solar system, where it is by far the largest object. Many scientists think the sun and the rest of the solar system formed from a giant, rotating cloud of gas and dust known as the solar nebula. The sun holds 99.8% of the solar system's mass and is roughly 109 times the diameter of the Earth \u2014 about one million Earths could fit inside the sun."
  //             },
  //             {
  //                 "metadata": {
  //                     "authors": [],
  //                     "content": "This illustration shows the approximate sizes of the planets relative to each other. Outward from the Sun, the planets are Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune, followed by the dwarf planet Pluto. Jupiter's diameter is about 11 times that of the Earth's and the Sun's diameter is about 10 times Jupiter's. Pluto's diameter is slightly less than one-fifth of Earth's. The planets are not shown at the appropriate distance from the Sun.",
  //                     "source_type": "Web Source",
  //                     "title": "Solar System Sizes",
  //                     "url": "https://science.nasa.gov/resource/solar-system-sizes/",
  //                     "website": "Science",
  //                     "year": "n.d."
  //                 },
  //                 "summary": "This illustration shows the approximate sizes of the planets relative to each other. Outward from the Sun, the planets are Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune, followed by the dwarf planet Pluto. Jupiter's diameter is about 11 times that of the Earth's and the Sun's diameter is about 10 times Jupiter's. Pluto's diameter is slightly less than one-fifth of Earth's. The planets are not shown at the appropriate distance from the Sun."
  //             }
  //         ]
  //     },
  //     "task_id": "1746952863170918393",
  //     "tldr_text": ""
  // }
  // ]

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFact, setSelectedFact] = useState(null);

  const { fontSize, setTabNum } = useContext(AppContext);
  const lineHeightValue = '1.5'; // Adjusted for better readability

  // Click handler for the info icon
  const handleInfoClick = (fact) => {
    setSelectedFact(fact);
    setModalOpen(true);
  };

  // Close the FactDetailsModal
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedFact(null);
  };

  // Calculate total sources from positive, negative, and neutral
  const calculateSourceCount = (sourcesArray) => {
    if (!sourcesArray) return 0;
    const positiveCount = sourcesArray.positive?.length || 0;
    const negativeCount = sourcesArray.negative?.length || 0;
    const neutralCount = sourcesArray.neutral?.length || 0;
    return positiveCount + negativeCount + neutralCount;
  };

  const FactCard = ({fact}) => {
    const [sourcesOpen, setSourcesOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const { userCredits, setUserCredits } = useAppContext();
  


    const handleMenuOpen = (event) => {
      event.stopPropagation();
      setAnchorEl(event.currentTarget);
    };
  
    const handleMenuClose = (event) => {
      event?.stopPropagation();
      setAnchorEl(null);
    };
  
    const toggleSources = (event) => {
      event.stopPropagation();
      setSourcesOpen((prev) => !prev);
    };
  
    const totalSources = calculateSourceCount(fact.sources_array);
  
    function updateCorrectionMetaData(index, updatedData) {
      fact.correction_text[0].metadata[index] = updatedData;
      console.log("YES", index)
      console.log(fact.correction_text[0])
    }
  
    // Accept without citations
    const handleAcceptNoCitations = (e) => {
      e.stopPropagation();
      onCorrect(
        fact.input,
        fact.correction_text?.length
          ? fact.correction_text[0].summary
          : '',
        // Pass null if not including citations
        null
      );
      onDismiss(fact.input)
      handleMenuClose(e);
    };
  
    // Accept with citations
    const handleAcceptWithCitations = (e) => {
      e.stopPropagation();
      // const formattedCitations = fact.correction_text[0].metadata
      // .map((meta) => formatInTextCitation(meta))
      // .join(', '); // Join the formatted citations with a comma and space
      const formattedCitationsArray = fact.correction_text[0].metadata.map((meta) => formatInTextCitation(meta));

      const citationUrlsArray = fact.correction_text[0].metadata.map((meta) => meta.url || null);
      console.log({citationUrlsArray})
      onCorrectHyperlink(
        fact.input,
        fact.correction_text?.length
          ? fact.correction_text[0].summary
          : '',
        formattedCitationsArray,
        citationUrlsArray,
        fact.correction_text[0].metadata
      )
      onDismiss(fact.input)
      handleMenuClose(e);
    };
    

    const handleJustCitations = (e) => {
      e.stopPropagation();
      handleAddCitation(
        fact.input,
        '',
        formatInTextCitation(fact.correction_text[0].metadata[0]),
        fact.correction_text[0].metadata[0].url,
        fact.correction_text[0].metadata[0]
      )
      onDismiss(fact.input)
      handleMenuClose(e);
    };

    function generateComment(fact) {
      const { Classification, correction_text, sources_array } = fact;
    
      // Build a string to list out all sources, grouped by category (negative, neutral, positive, etc.)
      let sourcesString = '';
      
      const categoryName = {"POSITIVE":"Arguments","NEGATIVE":"Counter Arguments","NEUTRAL":"Neutral"}
      // Loop over each category (e.g. "negative", "neutral", "positive")
      for (const [category, sources] of Object.entries(sources_array)) {
        // Only add section if there's at least one source in this category
        if (sources.length) {
          sourcesString += `  ${categoryName[category.toUpperCase()]}:\n`;
          sources.forEach((source, index) => {
            sourcesString += `${index + 1}. ${source.summary}\n`;
            sourcesString += `${source.metadata.url}\n\n`;

          });
        }
      }
    
      // Use template literals to make multi-line strings easier to handle
      const multiLineComment = `
    The statement is ${Classification}.
    Suggestion:
    ${correction_text[0].summary}
    ${correction_text[0].metadata.url}
    
    Other sources:
    ${sourcesString}
      `;
    
      return multiLineComment;
    }
    
  
    const handleComment = (e) => {
      e.stopPropagation();
      commentClaim(fact.input,
        generateComment(fact)
      )
    }
    return (
      <Paper
        elevation={2}
        key={fact.input}
        sx={{
          padding: 1.5,
          borderRadius: 3,
          marginBottom: 1.5,
          backgroundColor: 'background.paper',
          boxShadow: 1,
          display: 'flex',
          borderLeft: `4px solid ${
            classificationBorderColor[fact.Classification] || 'grey'
          }`,
          overflow: 'hidden',
          maxWidth: '100%',
        }}
      >
        <Box
          flex={1}
          sx={{
            wordWrap: 'break-word',
            overflow: 'hidden',
            padding: '0 8px',
          }}
        >
          {/* Classification + info icon */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="subtitle2"
              sx={{
                color:
                  classificationColors[fact.Classification] ||
                  'text.secondary',
                lineHeight: lineHeightValue,
                fontSize,
                whiteSpace: 'nowrap',
              }}
            >
              {fact.Classification}
            </Typography>
            <IconButton
              onClick={() => handleInfoClick(fact)}
              sx={{ color: 'primary.main', padding: 0.5 }}
              aria-label="Info"
            >
              <InfoIcon fontSize="small" />
            </IconButton>
          </Box>
  
          {/* Fact statement */}
          <ListItemText
            primary={
              <Typography
                variant="body2"
                sx={{
                  textDecoration:
                    fact.Classification === 'False'
                      ? 'line-through'
                      : 'none',
                  color: 'text.primary',
                  marginBottom: 0.5,
                  lineHeight: lineHeightValue,
                  fontSize,
                  wordWrap: 'break-word',
                  overflow: 'hidden',
                }}
              >
                {fact.input}
              </Typography>
            }
          />
  
          <Divider sx={{ my: 1 }} />
  
            {/* Correction section */}
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 'bold',
                color: 'text.secondary',
                mb: 0.5,
                lineHeight: lineHeightValue,
                fontSize,
              }}
            >
              {fact.Classification === 'False'
                ? 'Correction'
                : fact.Classification === 'True'
                ? 'Enhance'
                : fact.Classification === 'Unverifiable'
                ? 'Verifiable Statement'
                : ''}
            </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.primary',
              fontWeight: 'medium',
              mb: 1,
              lineHeight: lineHeightValue,
              fontSize,
              wordWrap: 'break-word',
              overflow: 'hidden',
            }}
          >
            {fact.correction_text?.length
              ? fact.correction_text[0].summary
              : ''}

            {/* {fact.correction_text?.[0].metadata && (
              <div>
                <ClickSourceLink
                  source={fact.correction_text[0]}
                  updateData={updateCorrectionMetaData}
                />
              </div>
            )} */}
            {fact.correction_text?.[0]?.metadata?.length > 0 && (
              <div>
                {fact.correction_text[0].metadata.map((metadata, index) => (
                  <ClickSourceLink
                    key={index}
                    metadata={metadata}
                    updateData={updateCorrectionMetaData}
                    index = {index}
                  />
                ))}
              </div>
            )}
          </Typography>
          {fact?.message && (
            <Typography 
              variant="body2" 
              sx={{
                color: 'text.primary',
                fontWeight: 'medium',
                mb: 1,
                lineHeight: lineHeightValue,
                fontSize,
                wordWrap: 'break-word',
                overflow: 'hidden',
              }}
            >
              {fact.message === "You don't have any credits available." ? (
                <>
                  You don't have any credits available. Please{' '}
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => router.push('/subscription')}
                    sx={{
                      color: '#1E9AFF',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    upgrade your plan
                  </Link>
                  {' '}to continue. You can also get a{' '}
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => router.push('/subscription')}
                    sx={{
                      color: '#1E9AFF',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    free trial
                  </Link>
                  !
                </>
              ) : (
                fact.message
              )}
            </Typography>
          )} 
  
          {/* THREE-BUTTON ARRAY: Accept, Dismiss, Sources */}
          <Box display="flex" alignItems="center" gap={1}>
            {/* Accept (contained blue) w/ dropdown */}
            <Box>
              <Button
                variant="contained"
                size="small"
                onClick={handleMenuOpen}
                sx={{
                  backgroundColor: '#1E9AFF',
                  color: '#fff',
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: '#1A88E0',
                  },
                }}
                endIcon={<KeyboardArrowDownIcon />}
              >
                Accept
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                keepMounted
              >
                <MenuItem onClick={handleAcceptNoCitations}>
                  without citation
                </MenuItem>
                <MenuItem onClick={handleAcceptWithCitations}>
                  with citations
                </MenuItem>
                <MenuItem onClick={handleJustCitations}>
                  just citation
                </MenuItem>
              </Menu>
            </Box>
  
            {/* Dismiss (outlined in the same blue) */}
            <Button
              variant="outlined"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDismiss(fact.input);
              }}
              sx={{
                color: '#1E9AFF',
                borderColor: '#1E9AFF',
                '&:hover': {
                  color: '#1A88E0',
                  borderColor: '#1A88E0',
                },
              }}
            >
              Dismiss
            </Button>
  
            {/* Sources (outlined, showing total + icon + arrow) */}
            <Button
              variant="outlined"
              size="small"
              onClick={toggleSources}
              sx={{
                color: '#1E9AFF',
                borderColor: '#1E9AFF',
                '&:hover': {
                  color: '#1A88E0',
                  borderColor: '#1A88E0',
                },
              }}
            >
              {totalSources}
              <DescriptionIcon fontSize="small" sx={{ ml: 0.5 }} />
              <KeyboardArrowDownIcon fontSize="small" sx={{ ml: 0.5 }} />
            </Button>
          </Box>
  
          {/* Toggleable sources list */}
          <SourceBreakdown
            fact={fact}
            sourcesOpen={sourcesOpen}
            handleAdd={handleAdd}
            handleAddCitation = {handleAddCitation}
            commentClaim={commentClaim}
          />

          <TaskActions task_id={fact.task_id}/>
        </Box>
      </Paper>
    );
  };
  // Filter the facts before rendering
  const filteredFacts =
    filter === 'View All'
      ? demoFacts
      : demoFacts.filter((fact) => fact.Classification === filter);

  return (
    <>
      {filteredFacts.length > 0 ? (
        <>
          <List sx={{ overflow: 'auto', padding: 1 }}>
            <AnimatePresence>
              {filteredFacts.map((fact) => (
                <motion.div
                  // key={fact.input} // Ensure each fact has a unique key
                  // layout // Enables automatic layout animations
                  // initial={{ opacity: 0, y: 20 }} // Starting state
                  // animate={{ opacity: 1, y: 0 }}  // Animate to
                  // exit={{ opacity: 0, y: -20 }}   // Exit state
                  // transition={{ type: 'spring', stiffness: 500, damping: 30 }} // Smooth transition
                  // style={{
                  //   padding: '10px',
                  //   margin: '5px 0',
                  // }}

                  key={fact.input} // Ensure each fact has a unique key
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="motion-item"
                
                >
                  <FactCard
                    key={fact.input} // Make sure 'fact.input' is unique
                    fact={fact}
                    onCorrect={onCorrect}
                    handleAdd={handleAdd}
                    onDismiss={onDismiss}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

          </List>
          <FactDetailsModal
            open={modalOpen}
            onClose={handleCloseModal}
            fact={selectedFact}
          />
        </>
      ) : (
        <Box
          sx={{
            height: '60vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: 1,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Let’s get fact-checking!
          </Typography>
          <Typography variant="body2">
            Facticity.AI will analyze the highlighted content for factual accuracy 
            and provide relevant citations to support it.
          </Typography>
        </Box>
      )}
    </>
  );
};

export default FactList;
