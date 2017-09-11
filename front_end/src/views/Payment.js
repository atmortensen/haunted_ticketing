import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Elements } from 'react-stripe-elements'
import PaymentForm from './PaymentForm'
import Template from './Template'
import { getPromoCode } from '../ducks/promoCodes.duck'
import { Input, Button } from '../globalStyles'
import moment from 'moment'

const FlexBox = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	text-shadow: 0px 0px 10px rgba(0, 0, 0, 1);
`
const Left = styled.div``
const Right = styled.div`
	text-align: right;
	@media (max-width: 800px) {
    width: ${props => props.wrap ? '100%' : null};
  }
`
const Day = styled.h3`
	margin: 0;
`
const Line = styled.div`
	width: 100%;
	height: 2px;
	background: #e6e6e6;
	margin: 5px 0 10px 0;
`
const NumberInput = styled(Input)`
	width: 55px;
	padding-left: 10px;
`
const ErrorMessage = styled.p`
	font-size: 24px;
	color: red;
	text-shadow: 0px 0px 10px rgba(0, 0, 0, 1);
	@media (max-width: 800px) {
    font-size: 24px;
  }
`
const Multiplier = styled.span`
	font-family: Sans-Serif;
	margin: 0 10px 0 5px;
`
const Total = styled.div`
	font-size: 30px;
	line-height: 75%;
`

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
    return ((numberOfTickets * 24) - (numberOfTickets * (discount / 100))).toFixed(2)
  }
  
  applyPromoCode() {
    if (this.state.promoCode) {
      this.props.getPromoCode(this.state.promoCode)
    } else {
      this.props.getPromoCode('NULL')
    }
  }

  render() {
		if (!this.props.selectedTimeSlot) { return <p></p> }

    return (
			<Template>
			<FlexBox>
					<Left>
						<Day>
							{moment.unix(this.props.selectedTimeSlot.end_time).format('dddd, MMMM Do')}
						</Day>
						<p>
							{moment.unix(this.props.selectedTimeSlot.start_time).format('h:mma') + ' - ' +
							moment.unix(this.props.selectedTimeSlot.end_time).format('h:mma')}
						</p>
					</Left>

					<Right wrap>
						$24.00 per ticket <Multiplier>x</Multiplier>
						<NumberInput type="number" 
							value={this.state.numberOfTickets} 
							onChange={this.updateField.bind(this, 'numberOfTickets')} />
						{this.props.selectedPromoCode &&
							<p>-$
								{this.totalDiscount(
									this.state.numberOfTickets, 
									this.props.selectedPromoCode.fixed_discount)}
								{' '} ({ this.props.selectedPromoCode.code })
							</p>
						}
					</Right>
				</FlexBox>

				<Line />

				<FlexBox>
					<Left>{/* Promo Code Input */}
						<Input 
							placeholder="Promo Code" 
							size="10"
							value={this.state.promoCode} 
							onChange={this.updateField.bind(this, 'promoCode')} />
						<Button 
							onClick={this.applyPromoCode.bind(this)}
							disabled={this.props.promoCodeLoading}>
							Apply
						</Button>
					</Left>

					<Right>
						<Total>
							${ this.totalPrice(
								this.state.numberOfTickets, 
								this.props.selectedPromoCode ? this.props.selectedPromoCode.fixed_discount : null
							) }
						</Total>
					</Right>
				</FlexBox>
				{/* Promo Code Error */}
				<ErrorMessage>
					{ this.props.promoCodeError }
					{ this.props.selectedPromoCode && 
						this.props.selectedPromoCode.minimum_purchase > this.state.numberOfTickets &&
						'This promo code is only valid with a purchase of ' + this.props.selectedPromoCode.minimum_purchase + ' tickets or more.'
					}
				</ErrorMessage>

				<Elements>
					<PaymentForm 
						numberOfTickets={this.state.numberOfTickets}
						redirectToTicket={this.props.history.push.bind(this, '/ticket')}
						redirectToTimeSlots={this.props.history.goBack.bind(this)} />
				</Elements>

			</Template>
    )
  }
}

export default connect(state => ({
	// Map state to props.
	selectedTimeSlot: state.timeSlots.selectedTimeSlot,
  selectedPromoCode: state.promoCodes.selectedPromoCode,
	promoCodeError: state.promoCodes.error,
	promoCodeLoading: state.promoCodes.loading
}), {
	// Map dispatch to props.
	getPromoCode
})(Payment)
