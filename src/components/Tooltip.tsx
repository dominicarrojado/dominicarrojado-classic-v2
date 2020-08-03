import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import classnames from 'classnames';

import './Tooltip.css';

const TIMEOUT = 200; // CSS transition timeout
const MAX_WIDTH = 300;

type Props = {
  isMounted?: boolean;
  position?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  children: ReactNode;
} & typeof defaultProps;

const defaultProps = {
  className: '',
  position: 'top',
};

const Tooltip = (props: Props) => {
  const { isMounted, position, className, children } = props;
  const timeout = useRef<number>();
  const positionRef = useRef<string>(position);
  const tooltipEl = useRef<HTMLDivElement | null>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [shouldRender, setShouldRender] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const tooltipMain = useCallback(
    (node) => {
      if (node !== null && tooltipEl.current !== null) {
        const newWidth = Math.min(node.offsetWidth, MAX_WIDTH);
        const newStyle: { [key: string]: any } = { width: newWidth };
        const currentPos = positionRef.current;

        // Centralize tooltip
        if (currentPos === 'top' || currentPos === 'bottom') {
          newStyle.left =
            (newWidth / 2 - tooltipEl.current.offsetWidth / 2) * -1;
        } else {
          newStyle.top =
            (node.offsetHeight / 2 - tooltipEl.current.offsetHeight / 2) * -1;
        }

        setStyle(newStyle);
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [children]
  );
  const showTooltip = () => {
    clearTimeout(timeout.current);
    setShouldRender(true);
    timeout.current = window.setTimeout(() => setShow(true), 100);
  };
  const hideTooltip = () => {
    clearTimeout(timeout.current);
    setShow(false);
    timeout.current = window.setTimeout(() => setShouldRender(false), TIMEOUT);
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeout.current);
    };
  }, []);

  useEffect(() => {
    if (isMounted) {
      showTooltip();
    } else {
      hideTooltip();
    }
  }, [isMounted]);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  return (
    <div
      ref={tooltipEl}
      className={classnames(
        'tooltip',
        {
          [position]: true,
          [`${isMounted ? 'force-' : ''}show`]: show,
        },
        className
      )}
      role="tooltip"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {shouldRender ? (
        <div className="wrapper" style={style}>
          <div
            ref={tooltipMain}
            className="main"
            style={
              style.width === MAX_WIDTH ? { whiteSpace: 'normal' } : undefined
            }
          >
            {children}
          </div>
        </div>
      ) : null}
    </div>
  );
};

Tooltip.defaultProps = defaultProps;

export default Tooltip;
