import React from 'react'
import { StackNavigator } from 'react-navigation'
import { AsyncStorage } from 'react-native'

import Login from './components/Login'
import Scanner from './components/Scanner'
import Dashboard from './components/Dashboard'

const Routes = StackNavigator({
	Dashboard: { screen: Dashboard },
	Scanner: { screen: Scanner }
})

export default class App extends React.Component {
	constructor() {
		super()
		this.state = {
			loggedIn: false
		}
	}

	componentWillMount() {
		AsyncStorage.getItem('token').then(token => {
			if (token) {
				this.setState({ loggedIn: true })
			}
		})
	}

	render() {
		if (this.state.loggedIn) {
			return <Routes />
		} else {
			return <Login />
		}
	}
}
