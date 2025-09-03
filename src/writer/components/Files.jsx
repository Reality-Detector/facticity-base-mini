import React, { useState } from 'react';
import UploadToPinecone from './Upload';
import { Chip } from '@mui/material';

const ExpandableModule = ({ items, username, currentProject, showToast }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <div style={{ 
      padding: '10px', 
      borderRadius: '6px', 
      backgroundColor: '#fff',
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      transition: 'background-color 0.3s ease'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <UploadToPinecone currentProject={currentProject} showToast={showToast} setIsExpanded={setIsExpanded}/>
        <span style={{ fontSize: '14px', color: '#555' }}>Files:</span>
        <button 
          onClick={toggleExpand} 
          style={{ 
            background: 'none', 
            border: 'none', 
            color: '#007bff', 
            cursor: 'pointer', 
            fontSize: '14px',
            padding: '4px 8px',
            borderRadius: '4px',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = 'rgba(0, 123, 255, 0.1)')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
        >
          {isExpanded ? 'Hide' : 'Show'}
        </button>
      </div>
      

      {isExpanded && (
      <div 
        style={{ 
          marginTop: '8px', 
          display: 'flex', 
          flexWrap: 'wrap', // Allow the chips to wrap to the next line
          gap: '12px', // Gap between chips
          overflowX: 'auto', // Horizontal scrolling in case of overflow
          paddingBottom: '4px'
        }}
      >
        {items.map((item, index) => (
          <Chip
            key={index}
            label={item.split('_')[0]}  // Split by '_' and display the first element
            style={{
              backgroundColor: '#f0f0f0',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              cursor: 'pointer'
            }}
          />
        ))}
      </div>
    )}
    </div>
  );
};

export default ExpandableModule;
