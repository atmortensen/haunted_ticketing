import React, { Component } from 'react'
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom'

import TimeSlots from './views/TimeSlots'
import Payment from './views/Payment'
import Ticket from './views/Ticket'
import Login from './views/admin/Login'
import Dashboard from './views/admin/dashboard/Dashboard'

export default class Routes extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={ TimeSlots } />
          <Route exact path="/payment" component={ Payment } />
          <Route exact path="/ticket" component={ Ticket } />
          <Route exact path="/admin" component={ Login } />
          <Route exact path="/admin/dashboard" component={ Dashboard } />
          <Route render={() => 
            <div style={{textAlign: 'center'}}>
              <h2>Page not found!</h2>
              <Link to="/">Haunted Ticketing</Link>
            </div>
          } />
        </Switch>
      </BrowserRouter>
    )
  } 
}
