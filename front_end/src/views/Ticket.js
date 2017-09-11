import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Template from './Template'
import moment from 'moment'
import { Button } from '../globalStyles'
 
const Info = styled.p`
	text-align: center;
	margin-bottom: 20px;
`
const FlexBox = styled.div`
	display: flex;
	justify-content: center;
	@media screen and (max-width: 800px) {
		display: block;
  }
`
const QRCode = styled.img`
	width: 200px;
	height: 200px;
	margin-right: 15px;
	@media screen and (max-width: 800px) {
		margin: auto;
		display: block;
		padding-bottom: 15px;
  }
`
const PrintButton = styled(Button)`
	display: block;
	:last-of-type {
		margin: 10px auto 0 auto;
	}
	@media screen and (max-width: 800px) {
		display: none;
	}
`

class Ticket extends Component {
	constructor() {
		super()
		this.state = {
			transaction: JSON.parse('{"id":8,"customer_name":"Alexander Mortensen","zip_code":"42424","email":"alextmortensen@gmail.com","stripe_transaction_id":"ch_1B0KjuDRTF9zIYO4oOpaaGTp","square_transaction_id":null,"number_of_tickets":2,"amount_paid":4600,"time_slot_id":2,"promo_code_id":null,"qr_code":"1505008803341650935259137","redeemed_timestamp":null,"transaction_timestamp":1505008803, "time_slot": {"start_time": 1505008803, "end_time": 1505008803}}')
		}
	}

	componentDidMount() {
		if (!this.props.transaction) {
			this.props.history.push('/')
		}
	}

  render() {
		if (!this.props.transaction) { return <p></p> }

    return (
			<Template>
				<Info>Thank you for your purchase. Please print or screen shot this ticket to bring with you. There are no refunds for lost or forgotten tickets. You must arrive within your time slot to redeem your tickets. We look forward to haunting you!</Info>
				
				<FlexBox>
					<QRCode src={'/api/qr/' + this.props.transaction.qr_code} alt="QR Code" />

					<div>
						<p><strong>Name:</strong> { this.props.transaction.customer_name }</p>
						<p><strong>Number of Tickets:</strong> { this.props.transaction.number_of_tickets }</p> 
						<p>
							<strong>Date:</strong> 
							{ ' ' + moment.unix(this.props.transaction.time_slot.start_time).format('dddd, MMM Do') }
						</p>
						<p>
							<strong>Time Slot:</strong>
							{ ' ' + moment.unix(this.props.transaction.time_slot.start_time).format('h:mma') + ' - ' +
							moment.unix(this.props.transaction.time_slot.end_time).format('h:mma') }
						</p>
						<p><strong>Amount Paid:</strong> ${(this.props.transaction.amount_paid / 100).toFixed(2)}</p>
						<p>
							<strong>Address:</strong> {' '}
							<a target="_blank" href="https://www.google.com/maps/place/Haunted+Mansions+of+Albion/">
							437 E North St, Albion, ID 83311
							</a>
						</p>
					</div>
				</FlexBox>
				<PrintButton onClick={window.print}><i className="fa fa-print"></i> Print</PrintButton>
	    </Template>
    )
  }
}

export default connect(props => ({
	// Map props to props.
	transaction: props.transactions.transaction
}), {
	// Map dispatch to props.
})(Ticket)
