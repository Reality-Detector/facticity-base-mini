// import React from 'react';
// import Plot from 'react-plotly.js';
// import { useResizeDetector } from 'react-resize-detector';

// const ScatterPlot = ({claim,data}) => {
//   const { width, ref } = useResizeDetector();

//   const plotData = [
//     {
//       x: data.filter(item => item.url !== 'Facticity').map(item => item.Bias),
//       y: data.filter(item => item.url !== 'Facticity').map(item => item.Quality),
//       hovertext: data.filter(item => item.url !== 'Facticity').map(item => item.url),
//       mode: 'markers',
//       type: 'scatter',
//       marker: { size: 8 },
//       text: data.filter(item => item.url !== 'Facticity').map(() => ''),
//       hoverinfo: 'text',
//       name: 'Collected Sources',
//     },
//     {
//       x: data.filter(item => item.url === 'Facticity').map(item => item.Bias),
//       y: data.filter(item => item.url === 'Facticity').map(item => item.Quality),
//       hovertext: data.filter(item => item.url === 'Facticity').map(item => item.url),
//       mode: 'markers',
//       type: 'scatter',
//       marker: { size: 8, color: 'red' },
//       text: data.filter(item => item.url === 'Facticity').map(() => ''),
//       hoverinfo: 'text',
//       name: 'Facticity',
//     }
//   ];
  

//   const layout = {
//     xaxis: {
//       title: 'Political Bias',
//       range: [-42, 42]
//     },
//     yaxis: {
//       title: 'Quality',
//       range: [0, 64]
//     },
//     hovermode: 'closest',
//     width: width,
//     height: 300,  // You can adjust the height as needed
//     margin: {
//       l: 50,
//       r: 50,
//       t: 50,
//       b: 50
//     },
//     paper_bgcolor: 'white',
//     legend: {
//       x: 1,
//       y: 0,
//       xanchor: 'right',
//       yanchor: 'bottom',
//       bgcolor: 'rgba(255, 255, 255, 0.5)',  // semi-transparent background
//       bordercolor: 'black',
//       borderwidth: 1
//     },
//     shapes: [
//       // Left region (blue)
//       {
//         type: 'rect',
//         xref: 'x',
//         yref: 'paper',
//         x0: -42,
//         y0: 0,
//         x1: 0,
//         y1: 1,
//         fillcolor: 'rgba(135, 206, 250, 0.2)',  // light blue with some transparency
//         line: {
//           width: 0
//         }
//       },
//       // Right region (red)
//       {
//         type: 'rect',
//         xref: 'x',
//         yref: 'paper',
//         x0: 0,
//         y0: 0,
//         x1: 42,
//         y1: 1,
//         fillcolor: 'rgba(255, 99, 71, 0.2)',  // light red with some transparency
//         line: {
//           width: 0
//         }
//       }
//     ],
//     annotations: [
//         {
//           x: -21,  // position of the text
//           y: 32,  // position of the text
//           xref: 'x',
//           yref: 'y',
//           text: 'Left Leaning',
//           showarrow: false,
//           font: {
//             family: 'Arial, sans-serif',
//             size: 20,
//             color: 'rgba(135, 206, 250, 0.8)'
//           },
//         //   bgcolor: 'rgba(135, 206, 250, 0.2)',  // match the blue region color
//         //   bordercolor: 'blue'
//         },
//         {
//           x: 21,  // position of the text
//           y: 32,  // position of the text
//           xref: 'x',
//           yref: 'y',
//           text: 'Right Leaning',
//           showarrow: false,
//           font: {
//             family: 'Arial, sans-serif',
//             size: 20,
//             color: 'rgba(255, 99, 71, 0.8)'
//           },
//         //   bgcolor: 'rgba(255, 99, 71, 0.2)',  // match the red region color
//         //   bordercolor: 'red'
//         }
//     ]
//   };
//   const hasMultiplePoints = plotData[0].x.length > 1;


//   return (
//     <div>
//          {hasMultiplePoints && (
//             // <div ref={ref} style={{ width: '100%', border: '2px solid black', padding: '10px', boxSizing: 'border-box', borderRadius: '10px' }}>
//             <div ref={ref} style={{ width: '100%', padding: '10px'}}>
            
//             <Plot
//             data={plotData}
//             layout={layout}
//             useResizeHandler={true}
//             style={{ width: '100%' }}
//             config={{ displayModeBar: false }}
//             />
//             <p style={{ fontSize: '12px', textAlign: 'center', marginTop: '10px' }}>
//             {"* Facticity gathers evidence from the web, and its answers might have biases based on the sources it can find on the issue. Here is a breakdown of the sources and their biases for the claim "+claim}
//             </p>
//             <p style={{ fontSize: '12px', textAlign: 'center', marginTop: '10px' }}>
//             Based on the Ad fontes Media Chart
//             </p>
//             </div>
//          )}
//     </div>
   
//   );
// };

// export default ScatterPlot;


import React from 'react';
import Plot from 'react-plotly.js';

const ScatterPlot = ({ claim, data }) => {
  // Separate data based on the 'url' property
  const collectedSources = data.filter(item => item.url !== 'Facticity');
  const facticitySources = data.filter(item => item.url === 'Facticity');
  console.log({collectedSources})
  const plotData = [
    {
      x: collectedSources.map(item => item.Bias),
      y: collectedSources.map(item => item.Quality),
      hovertext: collectedSources.map(item => item.url),
      mode: 'markers',
      type: 'scatter',
      marker: { size: 8 },
      name: 'Collected Sources',
      text: collectedSources.map(() => ''),
      hoverinfo: 'text',
    },
    {
      x: facticitySources.map(item => item.Bias),
      y: facticitySources.map(item => item.Quality),
      hovertext: facticitySources.map(item => item.url),
      mode: 'markers',
      type: 'scatter',
      marker: { size: 8, color: 'red' },
      name: 'Facticity',
      text: facticitySources.map(() => ''),
      hoverinfo: 'text',
    }
  ];

  const layout = {
    xaxis: {
      title: 'Political Bias',
      range: [-42, 42],
    },
    yaxis: {
      title: 'Quality',
      range: [0, 64],
    },
    hovermode: 'closest',
    height: 300, // Fixed height; adjust as needed
    margin: {
      l: 50,
      r: 50,
      t: 50,
      b: 50,
    },
    paper_bgcolor: 'white',
    legend: {
      x: 1,
      y: 0,
      xanchor: 'right',
      yanchor: 'bottom',
      bgcolor: 'rgba(255, 255, 255, 0.5)', // semi-transparent background
      bordercolor: 'black',
      borderwidth: 1,
    },
    shapes: [
      // Left region (blue)
      {
        type: 'rect',
        xref: 'x',
        yref: 'paper',
        x0: -42,
        y0: 0,
        x1: 0,
        y1: 1,
        fillcolor: 'rgba(135, 206, 250, 0.2)', // light blue with some transparency
        line: {
          width: 0,
        },
      },
      // Right region (red)
      {
        type: 'rect',
        xref: 'x',
        yref: 'paper',
        x0: 0,
        y0: 0,
        x1: 42,
        y1: 1,
        fillcolor: 'rgba(255, 99, 71, 0.2)', // light red with some transparency
        line: {
          width: 0,
        },
      }
    ],
    annotations: [
      {
        x: -21, // position of the text
        y: 32,  // position of the text
        xref: 'x',
        yref: 'y',
        text: 'Left Leaning',
        showarrow: false,
        font: {
          family: 'Arial, sans-serif',
          size: 20,
          color: 'rgba(135, 206, 250, 0.8)',
        },
      },
      {
        x: 21, // position of the text
        y: 32, // position of the text
        xref: 'x',
        yref: 'y',
        text: 'Right Leaning',
        showarrow: false,
        font: {
          family: 'Arial, sans-serif',
          size: 20,
          color: 'rgba(255, 99, 71, 0.8)',
        },
      }
    ]
  };

  const hasMultiplePoints = collectedSources.length > 1 || facticitySources.length > 1;

  return (
    <div>
        <div style={{ width: '100%', padding: '10px' }}>
          <Plot
            data={plotData}
            layout={layout}
            useResizeHandler={true}
            style={{ width: '100%', height: '100%' }}
            config={{ displayModeBar: true }}
          />
          <p style={{ fontSize: '12px', textAlign: 'center', marginTop: '10px' }}>
            {"* Facticity gathers evidence from the web, and its answers might have biases based on the sources it can find on the issue. Here is a breakdown of the sources and their biases for the claim \"" + claim + "\""}
          </p>
          <p style={{ fontSize: '12px', textAlign: 'center', marginTop: '10px' }}>
            Based on the Ad fontes Media Chart
          </p>
        </div>
    </div>
  );
};

export default ScatterPlot;
