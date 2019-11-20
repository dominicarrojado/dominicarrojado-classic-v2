import React from 'react';

// To pre-load all assets for offline use
function PreLoader() {
  return (
    <div
      style={{
        position: 'absolute',
        width: 0,
        height: 0,
        opacity: 0,
        pointerEvents: 'none',
      }}
    >
      <span className="font-weight-300" />
      <span className="font-weight-400" />
      <span className="font-weight-bold" />
    </div>
  );
}

export default PreLoader;
