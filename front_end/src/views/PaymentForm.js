import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { 
	injectStripe, 
	CardNumberElement,
	CardExpiryElement, 
	CardCVCElement, 
	PostalCodeElement,
	CardElement
} from 'react-stripe-elements'
import { createTransaction, resetError } from '../ducks/transactions.duck'
import { Input, Button } from '../globalStyles'
import swal from 'sweetalert2'
import moment from 'moment'
import '../../node_modules/sweetalert2/dist/sweetalert2.min.css'

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
	margin-right: ${ props => props.last ? '0' : null }
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
const ErrorMessage = styled.p`
	display: inline-block;
	margin-left: 10px;
	color: red;
	font-size: 24px;
	text-shadow: 0px 0px 10px rgba(0, 0, 0, 1);
	@media (max-width: 800px) {
		font-size: 24px;
	}
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

	componentDidMount() {
		this.props.resetError()
	}

	// Input handle function
	updateField(field, event) {
		this.setState({ [ field ]: event.target.value })
	}

	submitHandle(e) {
		e.preventDefault()
		swal({
			title: 'Are you sure?',
			text: `
				You are about to purchase 
				${ this.props.numberOfTickets } ticket(s) for 
				${ moment.unix(this.props.selectedTimeSlot.start_time).format('dddd, MMMM Do') } from 
				${ moment.unix(this.props.selectedTimeSlot.start_time).format('h:mma') } to 
				${ moment.unix(this.props.selectedTimeSlot.end_time).format('h:mma') } for 
				$${ this.totalPrice(	this.props.numberOfTickets, this.props.selectedPromoCode ? this.props.selectedPromoCode.fixed_discount : null	) }.
			`,
			showCancelButton: true,
			confirmButtonText: 'Continue'
		}).then(() => {
			this.createTransaction()
		}, () => { return })
	}

	createTransaction() {
		this.setState({ loading: true })
		// Get stripe token.
		this.props.stripe.createToken({ name: this.state.customerName }).then(response => {
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
						this.props.selectedPromoCode ? this.props.selectedPromoCode.fixed_discount : null
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
	
	totalPrice(numberOfTickets, discount) {
		return ((numberOfTickets * 24) - (numberOfTickets * (discount / 100))).toFixed(2)
	}

	render() {
		const stripeStyles = { base: { fontSize: '18px', fontFamily: 'Alegreya' } }
		
		return (
			<Wrapper>
				<Head>Payment Info</Head>
				<CustomInput 
					placeholder="Name on Card"
					value={this.state.customerName} 
					onChange={this.updateField.bind(this, 'customerName')} />
				<CustomInput 
					placeholder="Email"
					value={this.state.email} 
					onChange={this.updateField.bind(this, 'email')} />
				
				{window.innerWidth <= 800 &&
					<div>
						<CardWrapper last>
							<CardNumberElement 
								placeholder="Card Number"
								style={stripeStyles} />
						</CardWrapper>
						
						<CardFlex>
							<CardWrapper>
								<CardExpiryElement style={stripeStyles} />
							</CardWrapper>
							<CardWrapper>
								<CardCVCElement style={stripeStyles} />
							</CardWrapper>
							<CardWrapper last>
								<PostalCodeElement 
									placeholder="Zip Code" 
									style={stripeStyles} />
							</CardWrapper>
						</CardFlex>
					</div>
				}
				{window.innerWidth > 800 &&
					<CardWrapper last>
						<CardElement style={stripeStyles} />
					</CardWrapper>
				}

				<Button
					disabled={this.state.loading || this.props.loading} 
					onClick={this.submitHandle.bind(this)}>
					{ this.state.loading || this.props.loading ? 'Loading' : 'Submit' }
				</Button>
				<Button onClick={this.props.redirectToTimeSlots}>Cancel</Button>

				<ErrorMessage>{this.props.error} {this.state.error}</ErrorMessage>

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
	createTransaction,
	resetError
})(PaymentForm))
