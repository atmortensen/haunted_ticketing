import React from 'react'
import { Text, View, AsyncStorage, Vibration, Alert } from 'react-native'
import { BarCodeScanner, Permissions } from 'expo'
import axios from 'axios'

export default class App extends React.Component {
	constructor() {
		super()
		this.state = {
			hasCameraPermission: false,
			forceRedeem: false
		}
	}

	componentWillMount() {
		Permissions.askAsync(Permissions.CAMERA).then(({ status }) => {
			this.setState({ hasCameraPermission: status === 'granted' })
		}) 
	}

	handleBarCodeRead(barCode) {
		AsyncStorage.getItem('token').then(token => {
			if (!token) {
				this.props.navigator.push('login')
			} else {
				Vibration.vibrate()
				axios.patch(
					'https://www.hauntedticketing.com/api/transaction/redeem',
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
						Alert.alert(data.message)
					}
				}).catch(() => Alert.alert('Server error! Please try again.'))
				this.props.navigator.pop()
			}
		})
	}

	logout() {
		AsyncStorage.removeItem('token').then(() => {
			this.props.navigator.push('login')
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
						style={StyleSheet.absoluteFill}
					/>
				</View>
			)
		}
	}
}
