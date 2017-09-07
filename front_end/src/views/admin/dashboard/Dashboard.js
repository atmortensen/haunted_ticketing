import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Button } from '../../../globalStyles'
import * as loginActions from '../../../ducks/login.duck'
import PromoCodes from './PromoCodes'
import TimeSlots from './TimeSlots'

const Wrapper = styled.div`
  padding: 10px;
`
const LogoutButton = Button.extend`
  position: absolute;
  top: 10px;
  right: 10px;
`
const Title = styled.h1`
 text-align: center;
`
const FlexBox = styled.div`
  display: flex;
`

class Dashboard extends Component {

	componentDidMount() {
    if (!this.props.jwt) {
      this.redirectToLogin()
    }
  }
  
  redirectToLogin() {
    this.props.history.push('/admin')
  }

  logout() {
    this.props.logout(this.redirectToLogin.bind(this))
  }

  render() {
    return (
      <Wrapper>
        <Title>Haunted Ticketing Dashboard</Title>
        <LogoutButton onClick={this.logout.bind(this)}>Logout</LogoutButton>
        <FlexBox>
          <PromoCodes />
          <TimeSlots />
        </FlexBox>
	    </Wrapper>
    )
  }
}

export default connect(state => ({
  // Map state to props.
  jwt: state.login.jwt
}), {
  // Map dispatch to props.
  logout: loginActions.logout
})(Dashboard)
