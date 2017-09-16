import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { BarCodeScanner, Permissions } from 'expo'

export default class App extends React.Component {
	constructor() {
		super()
		this.state = {
			hasCameraPermission: false
		}
	}

	componentWillMount() {
		Permissions.askAsync(Permissions.CAMERA).then(({ status }) => {
			this.setState({ hasCameraPermission: status === 'granted' })
		}) 
	}

	handleBarCodeRead(barCode) {
		console.log(barCode.data)
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
						onBarCodeRead={this.handleBarCodeRead}
						style={StyleSheet.absoluteFill}
					/>
				</View>
			)
		}
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center'
	}
})
