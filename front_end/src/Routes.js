import React, {Component} from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'

import Home from './views/Home'
import Login from './views/admin/Login'
import Dashboard from './views/admin/dashboard/Dashboard'

export default class Routes extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/admin" component={Login} />
          <Route exact path="/admin/dashboard" component={Dashboard} />
          <Route render={() => <h2>Page not found!</h2>} />
        </Switch>
      </BrowserRouter>
    )
  } 
}
