import { Fragment, useEffect } from 'react';
import Window from './modules/Window';
import Notice from './components/Notice';
import Index from './pages/Index';
import PreLoader from './components/PreLoader';

function App() {
  useEffect(() => {
    Window.init();
  }, []);

  return (
    <Fragment>
      <Notice />
      <Index />
      <PreLoader />
    </Fragment>
  );
}

export default App;
