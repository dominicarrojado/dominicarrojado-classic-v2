import {
  useRef,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  CSSProperties,
} from 'react';
import classnames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { getRefValue } from '../lib/hooks';

import './Tooltip.css';

export type Props = {
  isMounted?: boolean;
  position?: 'top' | 'right' | 'bottom' | 'left';
  maxWidth?: number;
  className?: string;
  children: ReactNode;
};

function Tooltip({
  isMounted,
  children,
  maxWidth = 300,
  className = '',
  position = 'top',
}: Props) {
  const positionRef = useRef<string>(position);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef(null);
  const [style, setStyle] = useState<CSSProperties>({});
  const [shouldRender, setShouldRender] = useState<boolean>(false);
  const tooltipMainRef = useCallback(
    (tooltipMainEl) => {
      const tooltipEl = getRefValue(tooltipRef);

      if (tooltipMainEl && tooltipEl) {
        const newWidth = Math.min(tooltipMainEl.offsetWidth, maxWidth);
        const newStyle: CSSProperties = { width: newWidth };
        const currentPos = getRefValue(positionRef);

        // Centralize tooltip
        if (currentPos === 'top' || currentPos === 'bottom') {
          newStyle.left = (newWidth / 2 - tooltipEl.offsetWidth / 2) * -1;
        } else {
          newStyle.top =
            (tooltipMainEl.offsetHeight / 2 - tooltipEl.offsetHeight / 2) * -1;
        }

        setStyle(newStyle);
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [maxWidth, children]
  );
  const classNames = classnames('tooltip', { [position]: true }, className);
  const contentStyle =
    style.width === maxWidth ? ({ whiteSpace: 'normal' } as const) : undefined;
  const showTooltip = () => setShouldRender(true);
  const hideTooltip = () => setShouldRender(false);

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
      ref={tooltipRef}
      className={classNames}
      role="tooltip"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      <CSSTransition
        in={shouldRender}
        nodeRef={wrapperRef}
        timeout={200}
        classNames="tooltip"
        mountOnEnter
        unmountOnExit
      >
        <div ref={wrapperRef} className="wrapper" style={style}>
          <div
            ref={tooltipMainRef}
            className="main"
            data-testid="main"
            style={contentStyle}
          >
            {children}
          </div>
        </div>
      </CSSTransition>
    </div>
  );
}

export default Tooltip;
