import React, { Fragment } from 'react';
import Index from './pages/Index';
import PreLoader from './components/PreLoader';

export default function App() {
  return (
    <Fragment>
      <Index />
      <PreLoader />
    </Fragment>
  );
}
