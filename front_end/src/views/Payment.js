import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Elements } from 'react-stripe-elements'
import Form from './StripeForm'
// import { Input } from '../globalStyles'

const Wrapper = styled.div`

`

class Payments extends Component {
	constructor() {
		super()
		this.state={

		}
	}

	componentWillMount() {
		if (!this.props.selectedTimeSlot) {
			this.props.history.push('/')
		}
	}

  render() {
    return (
			<Wrapper>
				<Elements>
					<Form redirectToTicket={this.props.history.push.bind(this, '/ticket')}/>
				</Elements>
			</Wrapper>
    )
  }
}

export default connect(state => ({
	// Map state to props.
	selectedTimeSlot: state.timeSlots.selectedTimeSlot
}), {
	// Map dispatch to props.
})(Payments)
