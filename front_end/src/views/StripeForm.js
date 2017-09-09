import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { injectStripe, CardElement } from 'react-stripe-elements'
import { createTransaction } from '../ducks/transactions.duck'
import { getPromoCode } from '../ducks/promoCodes.duck'

const Wrapper = styled.form`
  width: 100%;
`

class StripeForm extends Component {
	constructor() {
		super()
		this.state={
      loading: false,
      numberOfTickets: 2,
      promoCode: '',
      customerName: '',
      email: ''
		}
	}

	componentWillMount() {
  }

  // Input handle function
	updateField(field, event) {
		this.setState({ [ field ]: event.target.value })
	}

	createTransaction(e) {
		e.preventDefault()
    this.setState({loading: true})
		this.props.stripe.createToken({name: this.state.customerName}).then(response => {
      this.setState({loading: false})
      if (response.error) {
        const errorMessage = response.error.message
        console.log(errorMessage)
      } else {
        const transaction = {
          customerName: this.state.customerName, 
          zipCode: response.token.card.address_zip, 
          email: this.state.email, 
          stripeToken: response.token.id, 
          numberOfTickets: this.state.numberOfTickets,
          expectedPrice: this.totalPrice(
            this.state.numberOfTickets, 
            this.props.selectedPromoCode.fixed_discount
          ),
          promoCodeId: this.props.selectedPromoCode.id,
          timeSlotId: this.props.selectedTimeSlot.id
        }
        console.log(transaction)
      }
		})
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
    }
  }

  render() {
    return (
      <Wrapper>
        <div>
          { JSON.stringify(this.props.selectedTimeSlot) }
          <p>
            $23 x 
            <input type="number" value={this.state.numberOfTickets} onChange={this.updateField.bind(this, 'numberOfTickets')} />
            ${ (23 * this.state.numberOfTickets).toFixed(2) }
            {this.props.selectedPromoCode && 
              ` - $${this.totalDiscount(this.state.numberOfTickets,this.props.selectedPromoCode.fixed_discount) }`}
          </p>
          <input type="text" placeholder="Promo Code" value={this.state.promoCode} onChange={this.updateField.bind(this, 'promoCode')} />
          <button type="button" onClick={this.applyPromoCode.bind(this)}>Apply</button>
          { this.props.promoCodeError }
        </div>
        <input placeholder="Full Name" />
        <input placeholder="Email" />
        <CardElement style={{base: {fontSize: '20px'}}} />
        <button onClick={this.createTransaction.bind(this)}>Submit</button>
      </Wrapper>
    )
  }
}

export default injectStripe(connect(state => ({
  // Map state to props.
  selectedTimeSlot: state.timeSlots.selectedTimeSlot,
  selectedPromoCode: state.promoCodes.selectedPromoCode,
  promoCodeError: state.promoCodes.error,
  loading: state.transactions.loading
}), {
  // Map dispatch to props.
  getPromoCode,
  createTransaction
})(StripeForm))
