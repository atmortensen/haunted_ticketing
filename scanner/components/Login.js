import React from 'react'
import styled from 'styled-components/native'
import { AsyncStorage, Keyboard } from 'react-native'
import resetNav from '../resetNavigation'
import axios from './myAxios'

const Form = styled.KeyboardAvoidingView`
	background: #262626;
	flex: 1;
	justify-content: center;
	align-items: center;
`
const Head = styled.Text`
	color: #f2f2f2;
	font-size: 20px;
	text-align center;
`
const Password = styled.TextInput`
	width: 65%;
	background: #fff;
	padding: 5px;
	font-size: 20px;
	margin-top: 10px;
	border: solid 1px #000;
	text-align: center;
`
const Submit = styled.Button``
const ErrorMessage = styled.Text`
	color: red;
	font-size: 16px;
	margin-bottom: 10px;
`

export default class Login extends React.Component {
	constructor() {
		super()
		this.state = {
			password: '',
			error: ''
		}
	}
	
	login() {
		Keyboard.dismiss()
		axios.post('/api/login', { password: this.state.password })
			.then(({ data }) => {
				if (data.error) {
					this.setState({ error: data.error, password: '' })
				} else {
					AsyncStorage.setItem('token', data).then(() => {
						this.props.navigation.dispatch(resetNav('LoggedIn'))
					})
				}
			}).catch(() => this.setState({ error: 'Server Error!' }))
	}

	updateField(field, text) {
		this.setState({ [ field ]: text })
	}

	render() {
		return (
			<Form behavior="padding">
				<Head>Haunted Mansions Ticketing</Head>
				<Password 
					onChangeText={this.updateField.bind(this, 'password')} 
					value={this.state.password} 
					secureTextEntry={true} 
					placeholder="Password" />
				<ErrorMessage>{this.state.error}</ErrorMessage> 
				<Submit 
					title="Login" 
					onPress={this.login.bind(this)} />
			</Form>
		)
	}
}
