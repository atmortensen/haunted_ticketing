import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import * as timeSlotActions from '../ducks/timeSlots.duck'
import moment from 'moment'

const Wrapper = styled.div`

`

class TimeSlots extends Component {
	constructor() {
		super()
		this.state={
			timeSlot: 2
		}
	}

	componentDidMount() {
		this.props.getTimeSlots()
	}

	// Input handle function
	updateField(field, event) {
		this.setState({ [ field ]: event.target.value })
	}

	goToPayments() {
		this.props.setTimeSlot(this.props.timeSlots.find(ts => ts.id === +this.state.timeSlot))
		this.props.history.push('/payment')
	}

  render() {
    return (
			<Wrapper>
				<select selected={this.state.timeSlot} onChange={this.updateField.bind(this, 'timeSlot')}>
				{this.props.timeSlots.map(timeSlot => {
					return (
						<option key={timeSlot.id} value={timeSlot.id}>
							{ moment.unix(timeSlot.start_time).format('h:mma MM.DD.YY') } -
							{ ' ' + moment.unix(timeSlot.end_time).format('h:mma MM.DD.YY') }
						</option>
					)
				})}
				</select>
				<button onClick={this.goToPayments.bind(this)}>Continue</button>
	    </Wrapper>
    )
  }
}

export default connect(state => ({
	// Map state to props.
	timeSlots: state.timeSlots.timeSlots
}), {
	// Map dispatch to props.
	getTimeSlots: timeSlotActions.getTimeSlots,
	setTimeSlot: timeSlotActions.setTimeSlot
})(TimeSlots)
