import classNames from 'classnames';
import { useWindowLoaded } from '../lib/custom-hooks';

import { ReactComponent as WarningIcon } from '../assets/images/icons/warning-solid.svg';

import './Notice.css';
import { MAIN_URL } from '../constants';

function Notice() {
  const isWindowLoaded = useWindowLoaded();

  return (
    <div
      className={classNames('notice', {
        show: isWindowLoaded,
      })}
    >
      <WarningIcon />
      <span>
        You are currently viewing an outdated version of the main website. To
        view the updated version, click <a href={MAIN_URL}>here</a>.
      </span>
    </div>
  );
}

export default Notice;
