import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import * as timeSlotActions from '../ducks/timeSlots.duck'
import moment from 'moment'
import Template from './Template'
import DaySelector from './DaySelector'
import { Button } from '../globalStyles'

const FlexBox = styled.div`
	display: flex;
	flex-direction: row-reverse;
	padding-top: 15px;
	@media (max-width: 800px) {
		display: block;
		padding-top: 5px;
	}
`
const List = styled.div`
	flex: 1;
	padding-right: 15px;
	@media (max-width: 800px) {
		padding-right: 0;
		padding-top: 25px;
		width: 100%;
	}
`
const Head = styled.h2`
	font-family: 'Special Elite', cursive;
	font-weight: normal;
	font-size: 22px;
	margin: 0;
`
const TimeSlot = styled.div`
	background: #0d0d0d;
	padding: 10px;
	margin: 10px 0;
	box-shadow: 0px 0px 10px 0px rgba(255,255,255,0.65);
	display: flex;
	justify-content: space-between;
	align-items: center;
`
const Info = styled.div`
	font-size: 25px;
	@media (max-width: 800px) {
		font-size: 20px;
	}
`
const RemainingTickets = styled.p`
	font-size: 18px;
	margin: -5px 0 0 0;
	@media (max-width: 800px) {
		font-size: 18px;
	}
`

class TimeSlots extends Component {
	constructor() {
		super()
		this.state={

		}
	}

	componentDidMount() {
		this.props.getTimeSlots()
	}

	updateField(field, event) {
		this.setState({ [ field ]: event.target.value })
	}

	goToPayments(timeSlot) {
		this.props.setTimeSlot(timeSlot)
		this.props.history.push('/payment')
	}

	render() {
		return (
			<Template>
				<p>Welcome to the Haunted Mansions of Albion ticketing portal! Time slots have limited tickets available, so be sure to get yours before you come. You must arrive within your selected time slot to redeem your tickets, but you'll have as much time as you need to go through. Tickets cost $24 and include all 4 buildings. Visit <a href="http://www.hauntedalbion.com">hauntedalbion.com</a> for more info.</p>
				<FlexBox>
					<DaySelector />
					<List>
						<Head>
							{ this.props.visibleTimeSlots[0] ?
							moment.unix(this.props.visibleTimeSlots[0].start_time).format('dddd, MMMM Do') :
							'' }
						</Head>
						{ this.props.visibleTimeSlots.map(timeSlot => {
							return (
								<TimeSlot key={timeSlot.id}>
									<Info>
										<p>{ 
											moment.unix(timeSlot.start_time).format('h:mma') + ' - ' +
											moment.unix(timeSlot.end_time).format('h:mma')
										}</p>
										{ timeSlot.number_available - timeSlot.number_sold >= 100 &&
											<RemainingTickets>100+ remaining</RemainingTickets>
										}
										{ timeSlot.number_available - timeSlot.number_sold < 100 &&
											<RemainingTickets>Only {timeSlot.number_available - timeSlot.number_sold} tickets left!</RemainingTickets>
										}
									</Info>

									<Button
										disabled={!timeSlot.number_available - timeSlot.number_sold > 0}
										onClick={this.goToPayments.bind(this, timeSlot)}>
										{ timeSlot.number_available - timeSlot.number_sold > 0 ? 'Select' : 'Sold Out!' }
									</Button>
									
								</TimeSlot>
							)
						})}
					</List>
				</FlexBox>
			</Template>
		)
	}
}

export default connect(state => ({
	// Map state to props.
	visibleTimeSlots: state.timeSlots.visibleTimeSlots
}), {
	// Map dispatch to props.
	getTimeSlots: timeSlotActions.getTimeSlots,
	setTimeSlot: timeSlotActions.setTimeSlot
})(TimeSlots)
