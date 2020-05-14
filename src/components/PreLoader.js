import React, { useState, useEffect } from 'react';

// To pre-load all assets after page load
function PreLoader() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (document.readyState === 'complete') {
      setMounted(true);
    } else {
      window.addEventListener('load', () => setMounted(true));
    }
  }, []);

  return mounted ? (
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
  ) : null;
}

export default PreLoader;
