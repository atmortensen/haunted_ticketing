import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import moment from 'moment-timezone'
import DatePicker from 'react-datepicker'
import '../../node_modules/react-datepicker/dist/react-datepicker.min.css'
import { setVisibleTimeSlots } from '../ducks/timeSlots.duck'
import moment2 from 'moment'

moment.tz.setDefault('America/Boise')

const Wrapper = styled.div`
	text-align:center;
`

class DaySelector extends Component {
	constructor() {
		super()
		this.state={
			days: [],
			selectedDay: moment()
		}
	}

	componentWillReceiveProps(nextProps) {
		// Arrange time slots into days.
		if (nextProps.timeSlots) {
			let days = []
			nextProps.timeSlots.forEach(ts => {
				const day = moment.unix(ts.start_time).startOf('day')
				if (moment.unix(ts.end_time).isBefore(moment())) {
					return
				}
				const existingDay = days.find(d => d.day.isSame(day))
				if (existingDay) {
					existingDay.timeSlots.push(ts)
				} else {
					days.push({
						day: day,
						timeSlots: [ ts ]
					})
				}
			})
			days = days.sort((a, b) => {
				if (a.day.isAfter(b.day)) {
					return 1
				} else if (b.day.isAfter(a.day)) {
					return -1
				}

				return 0
			})

			this.props.setVisibleTimeSlots(days[0].timeSlots)
			this.setState({ days: days, selectedDay: days[0].day })
		}
	}

	dayChange(day) {
		this.setState({ selectedDay: day })
		const { timeSlots } = this.state.days.find(d => d.day.isSame(day))
		this.props.setVisibleTimeSlots(timeSlots)
	}

	render() {
		return (
			<Wrapper>
				<DatePicker 
					inline
					selected={this.state.selectedDay}
					onChange={this.dayChange.bind(this)}
					includeDates={this.state.days.map(d => d.day)}
					highlightDates={this.state.days.map(d => moment2(d.day))}	/>
			</Wrapper>
		)
	}
}

export default connect(state => ({
	// Map state to props.
	timeSlots: state.timeSlots.timeSlots
}), {
	// Map dispatch to props.
	setVisibleTimeSlots
})(DaySelector)
