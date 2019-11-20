import React, { useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import './Tooltip.css';

const TIMEOUT = 200; // CSS transition timeout
const MAX_WIDTH = 300;

function Tooltip({ className, trigger, children }) {
  const tooltip = useRef();
  const [style, setStyle] = useState({});
  const tooltipMain = useCallback(
    node => {
      if (node !== null) {
        const newWidth = Math.min(node.offsetWidth, MAX_WIDTH);

        setStyle({
          width: newWidth,
          left: (newWidth / 2 - tooltip.current.offsetWidth / 2) * -1, // Center tooltip
        });
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [children]
  );
  const timeoutRef = useRef();
  const [shouldRender, setShouldRender] = useState(false);
  const [show, setShow] = useState(false);

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
      onMouseEnter={trigger === 'hover' ? showTooltip : undefined}
      onMouseLeave={trigger === 'hover' ? hideTooltip : undefined}
      className={`tooltip ${show ? 'show' : ''} ${className}`}
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
  trigger: 'hover',
};

Tooltip.propTypes = {
  trigger: PropTypes.string,
  children: PropTypes.node,
};

export default Tooltip;
