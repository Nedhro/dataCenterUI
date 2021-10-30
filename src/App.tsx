import React from 'react';
import './App.scss';
// import DashBoard from './pages/collector/DashBoard';
import DataView from './pages/collector/DataView';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import BillingInfo from './pages/collector/BillingInfo';
import Facility from './pages/collector/Facility';
function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" >
          <DataView />
        </Route>
        <Route path="/billingInfo" >
          <BillingInfo />
        </Route>
        <Route path="/:id" >
          <Facility />
        </Route>
      </Switch>
    </Router>
    // <div className="App">

    // {/* <DashBoard/> */}
    // </div>
  );
}

export default App;
