import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Button } from '../../global_styles'
import * as loginActions from '../../ducks/login.duck'
// import * as formActions from '../../ducks/forms.duck'

const Wrapper = styled.div`

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

  render() {
    return (
    	<Wrapper>
        <Button onClick={this.props.logout.bind(null, this.redirectToLogin.bind(this))}>Logout</Button>
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
