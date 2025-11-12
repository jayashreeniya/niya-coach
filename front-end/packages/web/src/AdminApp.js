// AdminApp.js - Admin Only Frontend
import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import AdminConsole3 from "../../blocks/AdminConsole3/src/AdminConsole3.web";

class AdminApp extends Component {
  render() {
    return (
      <Router>
        <div style={{ height: '100vh', width: '100%' }}>
          <Switch>
            <Route exact path="/" component={AdminConsole3} />
            <Route path="/admin" component={AdminConsole3} />
            <Redirect to="/" />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default AdminApp;



