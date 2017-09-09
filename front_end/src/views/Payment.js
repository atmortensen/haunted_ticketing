import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Elements } from 'react-stripe-elements'
import Form from './StripeForm'
import { Input } from '../globalStyles'

const Wrapper = styled.div`

`

class Payments extends Component {
	constructor() {
		super()
		this.state={

		}
	}

	componentWillMount() {
	}

  render() {
    return (
			<Wrapper>
				<Input placeholder="Full Name" />
				<Input placeholder="Email" />
				<Elements>
					<Form />
				</Elements>
			</Wrapper>
    )
  }
}

export default connect(state => ({
	// Map state to props.
	state
}), {
	// Map dispatch to props.
})(Payments)
