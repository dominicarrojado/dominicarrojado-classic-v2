import React, { useRef, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import './Tooltip.css';

const TIMEOUT = 200; // CSS transition timeout
const MAX_WIDTH = 300;

function Tooltip({ isMounted, position, className, children }) {
  const tooltip = useRef();
  const [style, setStyle] = useState({});
  const tooltipMain = useCallback(
    node => {
      if (node !== null) {
        const newWidth = Math.min(node.offsetWidth, MAX_WIDTH);
        const newStyle = { width: newWidth };

        if (position === 'top') {
          newStyle.left = (newWidth / 2 - tooltip.current.offsetWidth / 2) * -1; // Center tooltip
        }

        setStyle(newStyle);
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [children]
  );
  const timeoutRef = useRef();
  const [shouldRender, setShouldRender] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    if (isMounted) {
      showTooltip();
    } else {
      hideTooltip();
    }
  }, [isMounted]);

  function showTooltip() {
    clearTimeout(timeoutRef.current);
    setShouldRender(true);
    timeoutRef.current = setTimeout(() => setShow(true), 100);
  }

  function hideTooltip() {
    clearTimeout(timeoutRef.current);
    setShow(false);
    timeoutRef.current = setTimeout(() => setShouldRender(false), TIMEOUT);
  }

  return (
    <div
      ref={tooltip}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      className={`tooltip ${position} ${isMounted ? 'force-' : ''}${
        show ? 'show' : ''
      } ${className}`}
    >
      {shouldRender ? (
        <div style={style} className="wrapper">
          <div
            ref={tooltipMain}
            style={style.width === MAX_WIDTH ? { whiteSpace: 'normal' } : null}
            className="main"
          >
            {children}
          </div>
        </div>
      ) : null}
    </div>
  );
}

Tooltip.defaultProps = {
  className: '',
  position: 'top',
};

Tooltip.propTypes = {
  isMounted: PropTypes.bool,
  className: PropTypes.string,
  position: PropTypes.string,
  children: PropTypes.node,
};

export default Tooltip;
