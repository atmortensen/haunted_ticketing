import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { 
  injectStripe, 
  CardNumberElement,
  CardExpiryElement, 
  CardCVCElement, 
  PostalCodeElement 
} from 'react-stripe-elements'
import { createTransaction } from '../ducks/transactions.duck'
import { Input, Button } from '../globalStyles'

const Wrapper = styled.div`
	width: 100%;
	margin-top: 15px;
`
const CardFlex = styled.div`
  display: flex;
	flex-wrap: wrap;
	width: 100%;
`
const CardWrapper = styled.div`
  background: #fff;
  padding: 5px;
  margin: 0 5px 5px 0;
  border: solid 1px #999;
	flex: 1;
	margin-right: ${props => props.last ? '0' : null}
`
const CustomInput = Input.extend`
  width: calc(50% - 2.5px);
  @media (max-width: 800px) {
    width: 100%;
    margin-right: 0;
  }
`
const Head = styled.h2`
	font-family: 'Special Elite', cursive;
	font-weight: normal;
	font-size: 22px;
	margin: 0;
`

//  DISPLAY LOADING AND STYLE ERROR!!!!!!
class PaymentForm extends Component {
	constructor() {
		super()
		this.state={
      loading: false,
      customerName: '',
      email: '',
      error: ''
		}
	}

  // Input handle function
	updateField(field, event) {
		this.setState({ [ field ]: event.target.value })
	}

	createTransaction(e) {
		e.preventDefault()
    this.setState({ loading: true })
    // Get stripe token.
		this.props.stripe.createToken({name: this.state.customerName}).then(response => {
      this.setState({ loading: false, error: '' })
      if (response.error) {
        this.setState({ error: response.error.message })
      } else {

        const transaction = {
          customerName: this.state.customerName, 
          zipCode: response.token.card.address_zip, 
          email: this.state.email, 
          stripeToken: response.token.id, 
          numberOfTickets: this.props.numberOfTickets,
          expectedPrice: this.totalPrice(
            this.props.numberOfTickets, 
            this.props.selectedPromoCode ? this.props.selectedPromoCode.fixed_discount: null
          ),
          promoCodeId: this.props.selectedPromoCode ? this.props.selectedPromoCode.id : null,
          timeSlotId: this.props.selectedTimeSlot.id
        }
        // Create transaction.
        this.props.createTransaction(transaction, () => {
          this.props.redirectToTicket()
        })

      }
		})
  }

  render() {
    return (
      <Wrapper>
				<Head>Card Info</Head>
        <CustomInput 
          placeholder="Name on Card"
          value={this.state.customerName} 
          onChange={this.updateField.bind(this, 'customerName')} />
        <CustomInput 
          placeholder="Email"
          value={this.state.email} 
          onChange={this.updateField.bind(this, 'email')} />
        
        <CardWrapper last>
          <CardNumberElement style={{base: { fontSize: '18px', fontFamily: 'Alegreya' }}} />
				</CardWrapper>
				
        <CardFlex>
          <CardWrapper>
            <CardExpiryElement style={{base: { fontSize: '18px', fontFamily: 'Alegreya' }}} />
          </CardWrapper>
          <CardWrapper>
            <CardCVCElement style={{base: { fontSize: '18px', fontFamily: 'Alegreya' }}} />
          </CardWrapper>
          <CardWrapper last>
            <PostalCodeElement style={{base: { fontSize: '18px', fontFamily: 'Alegreya' }}} />
          </CardWrapper>
        </CardFlex>

				<Button
					disabled={this.state.loading || this.props.loading} 
					onClick={this.createTransaction.bind(this)}>
					{ this.state.loading || this.props.loading ? 'Loading' : 'Submit' }
				</Button>

        <p>{this.props.error} {this.state.error}</p>

      </Wrapper>
    )
  }
}

export default injectStripe(connect(state => ({
  // Map state to props.
  selectedTimeSlot: state.timeSlots.selectedTimeSlot,
  selectedPromoCode: state.promoCodes.selectedPromoCode,
  loading: state.transactions.loading,
  error: state.transactions.error
}), {
  // Map dispatch to props.
  createTransaction
})(PaymentForm))
