import React from 'react';
import './App.scss';
import DataView from './pages/collector/DataView';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import DiagnosisChart from './pages/DiagnosisChart/DiagnosisChart';
//import RegistrationCollector from './pages/collector/RegistrationCollector';

function App() {
  return (
    <div className="App">
      {/* <RegistrationCollector/> */}

      <Router>
        <Switch>
          <Route exact path="/">
            <DataView />
          </Route>
          <Route exact path="/diagnosis">
            <DiagnosisChart />
          </Route>

        </Switch>
      </Router>
    </div>
  );
}

export default App;
