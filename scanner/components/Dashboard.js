import React from 'react'
import styled from 'styled-components/native'
import { AsyncStorage, View } from 'react-native'
import axios from 'axios'
import resetNav from '../resetNavigation'

const Head = styled.Text`
  color: #f2f2f2;
`
const ScanButton = styled.Button``

export default class Login extends React.Component {
	constructor() {
		super()
		this.state = {
			
		}
	}

	componentWillMount() {

	}

	logout() {
		AsyncStorage.removeItem('token').then(() => {
			this.props.navigation.dispatch(resetNav('LoggedOut'))
		})
	}

	updateField(field, text) {
		this.setState({ [ field ]: text })
	}

	render() {
		return (
			<View>
				<ScanButton 
					onPress={this.logout.bind(this)}
					title="Logout" />
				<ScanButton 
					onPress={() => this.props.navigation.navigate('Scanner')}
					title="Scan Ticket" />
			</View>
		)
	}
}
