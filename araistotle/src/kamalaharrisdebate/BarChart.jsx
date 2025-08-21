import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BarChartComponent = ({ trumpStats }) => {
  // Convert trumpStats object into an array of objects suitable for Recharts
  const colors = ['rgba(40, 167, 69, 0.7)', 'rgba(220, 53, 69, 0.7)', 'rgba(255, 140, 0, 0.7)']; // translucent green, red, yellow

  const data = Object.keys(trumpStats).map((key, index) => {
    let displayName;
  
    // Map "Inconclusive" to "Unverifiable"
    if (key === "Inconclusive") {
      displayName = "Unverifiable";
    } else {
      displayName = key;
    }
  
    return {
      name: displayName,
      factcount: trumpStats[key],
      fill: colors[index], // Generate dynamic colors
    };
  });

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        {/* <Legend /> */}
        <Bar dataKey="factcount" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
