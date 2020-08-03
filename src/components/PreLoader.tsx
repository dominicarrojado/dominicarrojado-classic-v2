import React, { useState, useEffect } from 'react';
import Window from '../modules/Window';

function PreLoader() {
  const [windowLoaded, setWindowLoaded] = useState<boolean>(Window.loaded);

  useEffect(() => {
    Window.on('load', () => setWindowLoaded(true));
  }, []);

  return windowLoaded ? (
    <div
      style={{
        position: 'absolute',
        width: 0,
        height: 0,
        opacity: 0,
        pointerEvents: 'none',
      }}
    >
      <span style={{ fontWeight: 300 }}></span>
      <span style={{ fontWeight: 400 }}></span>
      <span style={{ fontWeight: 'bold' }}></span>
    </div>
  ) : null;
}

export default PreLoader;
