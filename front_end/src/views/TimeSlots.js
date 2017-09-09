import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import * as timeSlotActions from '../ducks/timeSlots.duck'

const Wrapper = styled.div`

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

	// Input handle function
	updateField(field, event) {
		this.setState({ [ field ]: event.target.value })
	}

  render() {
    return (
    	<Wrapper>
				{this.props.timeSlots.map(timeSlot => {
					return (
						<div key={timeSlot.id}>
							{ timeSlot.id }
						</div>
					)
				})}
	    </Wrapper>
    )
  }
}

export default connect(state => ({
	// Map state to props.
	timeSlots: state.timeSlots.timeSlots
}), {
	// Map dispatch to props.
	getTimeSlots: timeSlotActions.getTimeSlots
})(TimeSlots)
