import React from 'react';

const License = (props) => {
    const centeredMessageStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // 100% of the viewport height
        color: 'red',
      };
  return (
    <div style={centeredMessageStyle}>
      <h4>License expired or missing. Please contact IST Team (connectus@ispatialtec.com)</h4>
    </div>
  );
};

export default License;