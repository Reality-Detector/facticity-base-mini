import React from 'react';
import { Link } from 'react-router-dom';

function TemporaryPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Temporary Page</h2>
      <p>This is just a placeholder page to demonstrate routing.</p>
      <Link to="/">Go back to Editor</Link>
    </div>
  );
}

export default TemporaryPage;
