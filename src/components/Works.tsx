import { useRef, useState, useEffect } from 'react';
import { getRefValue } from '../lib/hooks';

import Window from '../modules/Window';

import WorkItem from './WorkItem';

import { SET_WORK_IN_VIEW_TIMEOUT, WORKS } from '../constants';

function Works() {
  const timeoutRef = useRef<number>();
  const worksRef = useRef<HTMLUListElement>(null);
  const [windowLoaded, setWindowLoaded] = useState(Window.loaded);
  const [workIdToDownloadGif, setWorkIdToDownloadGif] = useState('');
  const [workIdToShowGif, setWorkIdToShowGif] = useState('');

  useEffect(() => {
    const windowOnLoad = () => setWindowLoaded(true);
    const windowOnScroll = () => {
      // Auto-play GIF logic
      clearTimeout(getRefValue(timeoutRef));
      setWorkIdToShowGif('');

      const { pageYOffset, innerHeight } = window;
      let hasNewWorkId = false;

      const worksEl = getRefValue(worksRef);

      for (const node of worksEl.children) {
        const nodeId = node.id;
        const nodeImg = node.querySelector<HTMLImageElement>('.img');

        // Check if work image is within user view
        if (
          nodeId &&
          nodeImg &&
          nodeImg.offsetTop >= pageYOffset &&
          nodeImg.offsetTop + nodeImg.offsetHeight <= pageYOffset + innerHeight
        ) {
          hasNewWorkId = true;

          // Delay showing of GIF so it is less abrupt
          timeoutRef.current = window.setTimeout(() => {
            setWorkIdToDownloadGif(nodeId);
            setWorkIdToShowGif(nodeId);
          }, SET_WORK_IN_VIEW_TIMEOUT);
          break;
        }
      }

      // Only cancel download if work item is entirely out of user view
      if (!hasNewWorkId) {
        setWorkIdToDownloadGif('');
      }
    };

    Window.on('load', windowOnLoad);
    Window.on('scroll', windowOnScroll);

    return () => {
      Window.off('load', windowOnLoad);
      Window.off('scroll', windowOnScroll);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="page-section">
      <div className="section-title">
        <h2 className="title">My Projects</h2>
        <div className="desc">A bunch of things I've done so far.</div>
      </div>
      <ul ref={worksRef}>
        {WORKS.map((work, index) => {
          const id = `work-${index}`;

          return (
            <WorkItem
              key={id}
              work={{
                ...work,
                id,
              }}
              shouldShowImg={windowLoaded}
              shouldDownloadGif={workIdToDownloadGif === id}
              shouldShowGif={workIdToShowGif === id}
            />
          );
        })}
      </ul>
    </section>
  );
}

export default Works;
