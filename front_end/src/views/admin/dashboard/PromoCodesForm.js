import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Button, Input } from '../../../globalStyles'
import * as promoCodeActions from '../../../ducks/promoCodes.duck'

const Wrapper = styled.div`
  padding: 5px;
`
const Form = styled.form`
  margin-top: 10px;
  text-align: center;
`
const Error = styled.p`
  color: red;
  font-weight: bold;
  border: 1px solid red;
  padding: 5px;
  width: 100%;
  text-align: center;
`

class PromoCodes extends Component {
  constructor() {
    super()
    this.state = {
      code: '',
      fixedDiscount: '',
      minimumPurchase: ''
    }
  }

  updateField(field, event) {
		this.setState({ [field]: event.target.value })
	}
  
  createPromoCode(e) {
    e.preventDefault()
    const promoCode = {
      'code': this.state.code,
      'fixed_discount': this.state.fixedDiscount,
      'minimum_purchase': this.state.minimumPurchase
    }
    this.props.createPromoCode(this.props.jwt, promoCode, () => {
      this.props.getPromoCodes(this.props.jwt)
      this.setState({
        code: '',
        fixedDiscount: '',
        minimumPurchase: ''
      })
    })
  }
  
  render() {
    return (
      <Wrapper>
        {this.props.error &&
          <Error>{ this.props.error }</Error>
        }
        <Form onSubmit={this.createPromoCode.bind(this)}>
          <Input
            type="text"
            placeholder="Code"
            value={this.state.code}
            onChange={this.updateField.bind(this, 'code')} />
          <Input
            type="number" 
            placeholder="Fixed Discount"
            value={this.state.fixedDiscount}
            onChange={this.updateField.bind(this, 'fixedDiscount')} />
          <Input
            type="number" 
            placeholder="Minimum Ticket Purchase"
            value={this.state.minimumPurchase}
            onChange={this.updateField.bind(this, 'minimumPurchase')} />
          <Button disabled={this.props.loading}>Create</Button>
        </Form>
	    </Wrapper>
    )
  }
}

export default connect(state => ({
  // Map state to props.
  jwt: state.login.jwt,
  error: state.promoCodes.error,
  loading: state.promoCodes.loading
}), {
  // Map dispatch to props.
  createPromoCode: promoCodeActions.createPromoCode,
  getPromoCodes: promoCodeActions.getPromoCodes
})(PromoCodes)
