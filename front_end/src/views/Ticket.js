import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

const Wrapper = styled.div`

`

class Ticket extends Component {
	constructor() {
		super()
		this.state={
			fake: JSON.parse('{"id":8,"customer_name":"Alexander Mortensen","zip_code":"42424","email":"alextmortensen@gmail.com","stripe_transaction_id":"ch_1B0KjuDRTF9zIYO4oOpaaGTp","square_transaction_id":null,"number_of_tickets":2,"amount_paid":4600,"time_slot_id":2,"promo_code_id":null,"qr_code":"1505008803341650935259137","redeemed_timestamp":null,"transaction_timestamp":1505008803}')
		}
	}

	componentDidMount() {
		if (!this.props.transaction) {
			// this.props.history.push('/')
		}
	}

	// Input handle function
	updateField(field, event) {
		this.setState({ [ field ]: event.target.value })
	}

  render() {
    return (
    	<Wrapper>
				<img src={'/api/qr/' + this.state.fake.qr_code} alt="QR Code" />
	    </Wrapper>
    )
  }
}

export default connect(state => ({
	// Map state to props.
	transaction: state.transactions.transaction
}), {
	// Map dispatch to props.
})(Ticket)
