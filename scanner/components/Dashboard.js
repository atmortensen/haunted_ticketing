import React from 'react'
import styled from 'styled-components/native'
import { AsyncStorage, Alert, RefreshControl } from 'react-native'
import axios from './myAxios'
import resetNav from '../resetNavigation'
import moment from 'moment'

const Wrapper = styled.View`
	flex: 1;
`
const TicketSales = styled.ScrollView`
	flex: 1;
`
const Button = styled.Button``
const Card = styled.View`
	padding: 5px;
	border-bottom-width: 1px;
	border-bottom-color: #999;
`
const Day = styled.Text`
`
const Info = styled.Text`
`

export default class Dashboard extends React.Component {
	constructor() {
		super()
		this.state = {
			ticketSales: [],
			refreshing: false
		}
	}

	componentWillMount() {
		this.loadTickets()
	}

	loadTickets() {
		axios.get('/api/time_slots').then(({ data }) => {
			if (data.error) {
				Alert.alert(data.error)
				if (data.invalidLogin) {
					this.logout()
				}
			} else {
				let ticketSales = []
				data.forEach(timeSlot => {
					const day = moment.unix(timeSlot.start_time).startOf('day')
					const existing = ticketSales.find(sales => sales.day.isSame(day))
					if (existing) {
						existing.ticketsSold += +timeSlot.number_sold
						existing.ticketsRedeemed += +timeSlot.number_redeemed
					} else {
						ticketSales.push({
							day: day,
							ticketsSold: +timeSlot.number_sold,
							ticketsRedeemed: +timeSlot.number_redeemed
						})
					}
				}) 
				ticketSales = ticketSales.sort((a, b) => {
					if (a.day.isBefore(b.day)) {
						return -1 
					} else {
						return 1
					}
				})
				this.setState({ ticketSales, refreshing: false })
			}
		})
	}

	logout() {
		AsyncStorage.removeItem('token').then(() => {
			this.props.navigation.dispatch(resetNav('LoggedOut'))
		})
	}

	onRefresh() {
		this.setState({ refreshing: true })
		this.loadTickets()
	}

	render() {
		return (
			<Wrapper>
				<Button 
					onPress={() => this.props.navigation.navigate('Scanner')}
					title="Scan Ticket" />
				<TicketSales
					refreshControl={
						<RefreshControl
							refreshing={this.state.refreshing}
							onRefresh={this.onRefresh.bind(this)}
						/>
					}>
					{this.state.ticketSales.map((sales, i) => {
						return (
							<Card key={i}>
								<Day>{ sales.day.format('dddd, MMMM Do') }</Day>
								<Info>Tickets Sold: {sales.ticketsSold} Tickets Redeemed: {sales.ticketsRedeemed}</Info>
							</Card>
						)
					})}
				</TicketSales>
				<Button 
					onPress={this.logout.bind(this)}
					title="Logout" />
			</Wrapper>
		)
	}
}
