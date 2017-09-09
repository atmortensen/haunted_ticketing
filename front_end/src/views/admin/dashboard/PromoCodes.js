import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import PromoCodesForm from './PromoCodesForm'
import * as promoCodeActions from '../../../ducks/promoCodes.duck'

const Wrapper = styled.div`
  width: 50%;
  padding: 5px;
  border: 1px solid #999;
  margin-right: 5px;
`
const Card = styled.div`
  border: 1px solid #999;
  padding: 5px;
  width: 250px;
  float: left;
  margin: 5px;
  position: relative;
  min-height: 80px;
`
const FlexBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`
const Title = styled.h2`
 text-align: center;
`
const Code = styled.h2`
  margin: 0 0 5px 0;
`
const Delete = styled.i`
  cursor: pointer;
  position: absolute;
  top: 5px;
  right: 5px;
`

class PromoCodes extends Component {
  constructor() {
    super()
    this.state = {

    }
  }

	componentDidMount() {
    this.props.getPromoCodes(this.props.jwt)
  }

  delete(id) {
    if (confirm('Are you sure you want to delete this promo code?')) {
      this.props.destroyPromoCode(this.props.jwt, id, () => {
        this.props.getPromoCodes(this.props.jwt)
      })
    }
  }
  
  render() {
    return (
      <Wrapper>
        <Title>Promo Codes</Title>
        <PromoCodesForm />
        <FlexBox>
          {/* Loop though promo codes. */}
          { this.props.promoCodes.map(promoCode => {
            return (
              <Card key={promoCode.id}>
                <Delete className="fa fa-trash" onClick={this.delete.bind(this, promoCode.id)} />
                <Code>{promoCode.code}</Code>
                <p>${promoCode.fixed_discount / 100} Discount</p>
                {!!promoCode.minimum_purchase &&
                  <p>{promoCode.minimum_purchase} Ticket Minimum</p>
                }
              </Card>
            )
          }) }
        </FlexBox>
	    </Wrapper>
    )
  }
}

export default connect(state => ({
  // Map state to props.
  jwt: state.login.jwt,
  promoCodes: state.promoCodes.promoCodes
}), {
  // Map dispatch to props.
  getPromoCodes: promoCodeActions.getPromoCodes,
  destroyPromoCode: promoCodeActions.destroyPromoCode
})(PromoCodes)
