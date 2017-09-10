import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import * as timeSlotActions from '../ducks/timeSlots.duck'
import moment from 'moment'
import Template from './Template'
import DaySelector from './DaySelector'
import { Button } from '../globalStyles'

const Head = styled.h2`
	font-family: 'Special Elite', cursive;
	font-weight: normal;
	font-size: 22px;
	margin-bottom: 0;
`
const TimeSlot = styled.div`
	background: #0d0d0d;
	padding: 10px;
	margin: 10px 0;
	box-shadow: 0px 0px 10px 0px rgba(255,255,255,0.65);
	display: flex;
	justify-content: space-between;
`
const Time = styled.p`
	font-size: 26px;
	@media (max-width: 800px) {
    font-size: 20px;
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

	goToPayments() {
		this.props.setTimeSlot(this.props.timeSlots.find(ts => ts.id === +this.state.timeSlot))
		this.props.history.push('/payment')
	}

  render() {
    return (
			<Template>
				<DaySelector />
				<Head>
					{ this.props.visibleTimeSlots[0] ?
					moment.unix(this.props.visibleTimeSlots[0].start_time).format('dddd, MMMM Do') :
					'' }
				</Head>
				{ this.props.visibleTimeSlots.map(timeSlot => {
					return (
						<TimeSlot key={timeSlot.id}>
							<Time>
								{ 
									moment.unix(timeSlot.start_time).format('h:mma') + ' - ' +
									moment.unix(timeSlot.end_time).format('h:mma')
								}
							</Time>
							<Button>Select</Button>
						</TimeSlot>
					)
				})}
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
