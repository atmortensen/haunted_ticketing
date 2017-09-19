import React from 'react'
import { Text, View, AsyncStorage, Vibration, Alert } from 'react-native'
import { BarCodeScanner, Permissions } from 'expo'
import axios from 'axios'
import resetNav from '../resetNavigation'

export default class App extends React.Component {
	constructor() {
		super()
		this.state = {
			hasCameraPermission: false,
			forceRedeem: false,
			read: false
		}
	}

	componentWillMount() {
		Permissions.askAsync(Permissions.CAMERA).then(({ status }) => {
			this.setState({ hasCameraPermission: status === 'granted' })
		}) 
	}

	logout() {
		AsyncStorage.removeItem('token').then(() => {
			this.props.navigation.dispatch(resetNav('LoggedOut'))
		})
	}
	// https://www.hauntedticketing.com/api/transaction/redeem
	handleBarCodeRead(barCode) {
		if (this.state.read) { 
			return null
		}
		this.setState({ read: true })
		AsyncStorage.getItem('token').then(token => {
			Vibration.vibrate()
			this.props.navigation.goBack()
			axios.patch(
				'http://192.168.1.10:3001/api/transaction/redeem',
				{	barCode: barCode.data, forceRedeem: this.state.forceRedeem },
				{ headers: { 'Authorization': token } }
			).then(({ data }) => {
				if (data.invalidLogin) {
					Alert.alert('Invalid login credentials!')
					this.logOut()
				} else if (data.invalidTimeSlot) {
					Alert.alert(data.error)
					// Choose to force redeem
				} else if (data.error) {
					Alert.alert(data.error)
				} else {
					Alert.alert(data.name)
				}
				this.props.navigation.goBack()
			}).catch(() => {
				Alert.alert('Could not connect to server!')
			})
		})
	}

	render() {
		const { hasCameraPermission } = this.state
		
		if (hasCameraPermission === null) {
			return <Text>Requesting for camera permission</Text>
		} else if (hasCameraPermission === false) {
			return <Text>No access to camera</Text>
		} else {
			return (
				<View style={{ flex: 1 }}>
					<BarCodeScanner
						onBarCodeRead={this.handleBarCodeRead.bind(this)}
						style={{ flex: 1 }}
					/>
				</View>
			)
		}
	}
}
