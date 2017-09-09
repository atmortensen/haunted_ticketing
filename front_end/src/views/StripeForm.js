import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { injectStripe, CardElement } from 'react-stripe-elements'
import axios from 'axios'

const Form = styled.form`
  width: 100%;
`

class StripeForm extends Component {
	constructor() {
		super()
		this.state={

		}
	}

	componentWillMount() {
	}

	getStripeToken(e) {
		e.preventDefault()

		this.props.stripe.createToken({name: 'Alex Test'}).then(response => {
      console.log(response)
      axios.post('http://localhost:3001/api/test', {token: response.token.id}).then(res => {
        console.log(res)
      }).catch(error => {

      })
		})
	}

  render() {
    return (
      <Form onSubmit={this.getStripeToken.bind(this)}>
        <CardElement style={{base: {fontSize: '20px'}}} />
        <button>Submit</button>
      </Form>
    )
  }
}

export default injectStripe(connect(state => ({
  // Map state to props.
  state
}), {
	// Map dispatch to props.
})(StripeForm))
