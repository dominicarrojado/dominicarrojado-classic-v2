import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import './ProgressCircle.css';

function ProgressCircle({ size, strokeWidth, progress, className }) {
  const [offset, setOffset] = useState(0);
  const sizeHalf = size / 2;
  const radius = sizeHalf - strokeWidth * 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    setOffset(circumference - (progress / 100) * circumference);
  }, [circumference, progress]);

  return (
    <svg className={`progress-circle ${className}`} width={size} height={size}>
      <circle
        className="ring"
        strokeWidth={strokeWidth}
        fill="transparent"
        r={radius}
        cx={sizeHalf}
        cy={sizeHalf}
        style={{
          strokeDasharray: `${circumference} ${circumference}`,
          strokeDashoffset: offset,
        }}
      />
    </svg>
  );
}

ProgressCircle.defaultProps = {
  size: 36,
  strokeWidth: 3,
  progress: 0,
  className: '',
};

ProgressCircle.propTypes = {
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
  progress: PropTypes.number,
  className: PropTypes.string,
};

export default ProgressCircle;
