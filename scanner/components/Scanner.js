import React from 'react'
import { Text, View, AsyncStorage, Vibration, Alert } from 'react-native'
import { BarCodeScanner, Permissions } from 'expo'
import axios from './myAxios'
import resetNav from '../resetNavigation'

export default class App extends React.Component {
	constructor() {
		super()
		this.state = {
			hasCameraPermission: false,
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

	redeemTicket(barCode, forceRedeem) {
		AsyncStorage.getItem('token').then(token => {
			axios.patch(
				'/api/transaction/redeem',
				{	qrCode: barCode, forceRedeem: forceRedeem },
				{ headers: { 'Authorization': token } }
			).then(({ data }) => {
				if (data.invalidLogin) {
					Alert.alert(data.error)
					this.logout()
					return
				} else if (data.invalidTimeSlot) {
					Alert.alert(null, data.error, [
						{ text: 'Yes', onPress: this.redeemTicket.bind(this, barCode, true) },
						{ text: 'No' }
					])
				} else if (data.error) {
					Alert.alert(data.error)
				} else {
					Alert.alert(data.name + ' - ' + data.numberOfTickets + ' Ticket(s)')
				}
				this.props.navigation.goBack()
			}).catch(() => Alert.alert('Could not connect to server!'))
		})
	}

	handleBarCodeRead(event) {
		if (this.state.read) { 
			return null
		}
		this.setState({ read: true })
		Vibration.vibrate()
		this.redeemTicket(event.data, false)
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
