import React from 'react'
import { StackNavigator as stackNavigator } from 'react-navigation'
import { Platform, StatusBar, AsyncStorage, View } from 'react-native'

import Login from './components/Login'
import Scanner from './components/Scanner'
import Dashboard from './components/Dashboard'


const LoggedIn = stackNavigator({
	Dashboard: { 
		screen: Dashboard,
		navigationOptions: {
			title: 'Haunted Ticketing'
		}
	},
	Scanner: { 
		screen: Scanner,
		navigationOptions: {
			title: 'Ticket Scanner'
		}
	}
})

const LoggedOut = stackNavigator({
	Login: { screen: Login }
}, { headerMode: 'none' })

const createRoutes = (loggedIn) => stackNavigator({
	LoggedIn: { screen: LoggedIn },
	LoggedOut: { screen: LoggedOut }
}, {
	headerMode: 'none',
	mode: 'modal',
	initialRouteName: loggedIn ? 'LoggedIn' : 'LoggedOut'
})

export default class App extends React.Component {
	constructor() {
		super()
		this.state = {
			loggedIn: false,
			tokenChecked: false
		}
	}

	componentWillMount() {
		AsyncStorage.getItem('token').then(token => {
			this.setState({ tokenChecked: true })
			if (token) {
				this.setState({ loggedIn: true })
			}
		})
	}

	render() {
		const Routes = createRoutes(this.state.loggedIn)
		return (
			<View style={{ 
				paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
				flex: 1
			}}>
				{ this.state.tokenChecked ? <Routes /> : null }
			</View>
		)
	}
}
