import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Elements } from 'react-stripe-elements'
import Form from './PaymentForm'
import Template from './Template'


class Payment extends Component {
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
			<Template>
				<Elements>
					<Form redirectToTicket={this.props.history.push.bind(this, '/ticket')}/>
				</Elements>
			</Template>
    )
  }
}

export default connect(state => ({
	// Map state to props.
	selectedTimeSlot: state.timeSlots.selectedTimeSlot
}), {
	// Map dispatch to props.
})(Payment)
