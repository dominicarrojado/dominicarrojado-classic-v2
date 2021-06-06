import { Fragment, useEffect } from 'react';
import Window from './modules/Window';
import Index from './pages/Index';
import PreLoader from './components/PreLoader';

function App() {
  useEffect(() => {
    Window.init();
  }, []);

  return (
    <Fragment>
      <Index />
      <PreLoader />
    </Fragment>
  );
}

export default App;
