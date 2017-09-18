import React from 'react'
import styled from 'styled-components/native'
import { AsyncStorage } from 'react-native'
import axios from 'axios'

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
		// AsyncStorage.getItem('token').then(token => {
		// 	if (!token) {
		// 		this.props.navigator.push('login')
		// 	}
		// })
	}

	logout() {
		AsyncStorage.removeItem('token').then(() => {
			this.props.navigator.push('login')
		})
	}

	updateField(field, text) {
		this.setState({ [ field ]: text })
	}

	render() {
		return (
			<ScanButton 
				onPress={() => this.props.navigator.push('scanner')}
				title="Scan Ticket" />
		)
	}
}
