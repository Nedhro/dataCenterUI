import React from 'react';
import './App.scss';
import DataView from './pages/collector/DataView';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import DiagnosisChart from './pages/DiagnosisChart/DiagnosisChart';
import BillingInfo from './pages/BillingInfo/BillingInfo';
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
          <Route exact path="/diagnosis/billingInfo">
            <BillingInfo />
          </Route>

        </Switch>
      </Router>
    </div>
  );
}

export default App;
