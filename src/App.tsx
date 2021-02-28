import React from 'react';
import './App.scss';
import DataView from './pages/collector/DataView';
//import RegistrationCollector from './pages/collector/RegistrationCollector';

function App() {
  return (
    <div className="App">
    {/* <RegistrationCollector/> */}
    <DataView/>
    </div>
  );
}

export default App;
