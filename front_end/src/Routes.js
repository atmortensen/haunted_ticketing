import React, { Component } from 'react'
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom'
import browser from 'detect-browser'

import ReactGA from 'react-ga'
ReactGA.initialize('UA-16183207-10')

import TimeSlots from './views/TimeSlots'
import Payment from './views/Payment'
import Ticket from './views/Ticket'
import Login from './views/admin/Login'
import Dashboard from './views/admin/dashboard/Dashboard'

function Analytics(props) {
	ReactGA.set({ page: props.location.pathname + props.location.search })
	ReactGA.pageview(props.location.pathname + props.location.search)
	
	return null
}

export default class Routes extends Component {

	render() {
		if (browser && browser.name === 'ie') {
			const style = {
				textAlign: 'center',
				paddingTop: '50px',
				fontSize: '24px',
				fontWeight: 'bold',
				maxWidth: '800px',
				margin: 'auto',
				lineHeight: '130%'
			}
			return (
				<p style={style}>We do not currently support Internet Explorer. Please try a different browser like Firefox of Chrome to access the site.</p>
			)
		}

		return (
			<BrowserRouter>
				<div>
					<Route path="/" component={ Analytics } />
					{/* <Route path="/admin" render={() => <p>Test</p>} /> */}
					<Switch>
						<Route exact path="/" component={ TimeSlots } />
						<Route exact path="/payment" component={ Payment } />
						<Route exact path="/ticket" component={ Ticket } />
						<Route exact path="/admin" component={ Login } />
						<Route exact path="/admin/dashboard" component={ Dashboard } />
						<Route render={() => 
							<div style={{ textAlign: 'center' }}>
								<h2>Page not found!</h2>
								<Link to="/">Haunted Ticketing</Link>
							</div>
						} />
					</Switch>
				</div>
			</BrowserRouter>
		)
	} 
}
