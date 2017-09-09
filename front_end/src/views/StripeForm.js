import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { injectStripe, CardElement } from 'react-stripe-elements'
import axios from 'axios'
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
      promoCode: ''
		}
	}

	componentWillMount() {
  }

  // Input handle function
	updateField(field, event) {
		this.setState({ [ field ]: event.target.value })
	}

	getStripeToken(e) {
		e.preventDefault()
    this.setState({loading: true})
		this.props.stripe.createToken({name: this.state.customerName}).then(response => {
      this.setState({loading: false})
      if (response.error) {
        const errorMessage = response.error.message
        console.log(errorMessage)
      } else {
        const stripeToken = response.token.id
        const zip = response.token.card.address_zip
        console.log(stripeToken, zip)
      }
      
		})
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
            {this.props.selectedPromoCode && ` - $${(this.props.selectedPromoCode.fixed_discount / 100 * this.state.numberOfTickets).toFixed(2)}`}
          </p>
          <input type="text" placeholder="Promo Code" value={this.state.promoCode} onChange={this.updateField.bind(this, 'promoCode')} />
          <button type="button" onClick={this.applyPromoCode.bind(this)}>Apply</button>
          { this.props.promoCodeError }
          { this.props.selectedPromoCode ? this.props.selectedPromoCode.code : '' }
        </div>
        <input placeholder="Full Name" />
        <input placeholder="Email" />
        <CardElement style={{base: {fontSize: '20px'}}} />
        <button onClick={this.getStripeToken.bind(this)}>Submit</button>
      </Wrapper>
    )
  }
}

export default injectStripe(connect(state => ({
  // Map state to props.
  selectedTimeSlot: state.timeSlots.selectedTimeSlot,
  selectedPromoCode: state.promoCodes.selectedPromoCode,
  promoCodeError: state.promoCodes.error
}), {
  // Map dispatch to props.
  getPromoCode
})(StripeForm))
