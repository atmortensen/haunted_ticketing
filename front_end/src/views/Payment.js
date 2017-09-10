import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Elements } from 'react-stripe-elements'
import PaymentForm from './PaymentForm'
import Template from './Template'
import { getPromoCode } from '../ducks/promoCodes.duck'

class Payment extends Component {
	constructor() {
		super()
		this.state={
      numberOfTickets: 2,
      promoCode: ''
		}
	}

	componentWillMount() {
		if (!this.props.selectedTimeSlot) {
			this.props.history.push('/')
		}
	}

	// Input handle function
	updateField(field, event) {
		this.setState({ [ field ]: event.target.value })
	}

	totalDiscount(numberOfTickets, discount) {
    return (numberOfTickets * (discount / 100)).toFixed(2)
  }

  totalPrice(numberOfTickets, discount) {
    return ((numberOfTickets * 23) - (numberOfTickets * (discount / 100))).toFixed(2)
  }
  
  applyPromoCode() {
    if (this.state.promoCode) {
      this.props.getPromoCode(this.state.promoCode)
    } else {
      this.props.getPromoCode('NULL')
    }
  }

  render() {
    return (
			<Template>
				<div>
					<p>
						$23 x 
						<input type="number" value={this.state.numberOfTickets} onChange={this.updateField.bind(this, 'numberOfTickets')} />
						${ (23 * this.state.numberOfTickets).toFixed(2) }
						{this.props.selectedPromoCode && 
							` - $${this.totalDiscount(this.state.numberOfTickets, this.props.selectedPromoCode.fixed_discount)}`}
					</p>

					<input type="text" placeholder="Promo Code" value={this.state.promoCode} onChange={this.updateField.bind(this, 'promoCode')} />
					<button type="button" onClick={this.applyPromoCode.bind(this)}>Apply</button>
					{ this.props.promoCodeError }
				</div>

				<Elements>
					<PaymentForm redirectToTicket={this.props.history.push.bind(this, '/ticket')}/>
				</Elements>

			</Template>
    )
  }
}

export default connect(state => ({
	// Map state to props.
	selectedTimeSlot: state.timeSlots.selectedTimeSlot,
  selectedPromoCode: state.promoCodes.selectedPromoCode,
  promoCodeError: state.promoCodes.error
}), {
	// Map dispatch to props.
	getPromoCode
})(Payment)
