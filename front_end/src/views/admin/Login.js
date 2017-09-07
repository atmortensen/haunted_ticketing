import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Input, Button } from '../../globalStyles'
import * as loginActions from '../../ducks/login.duck'

const Wrapper = styled.div`
   width: 100%;
   height: 100vh;
   display: flex;
   justify-content: center;
`

const Title = styled.h1`
  font-size: 30px;
  text-transform: uppercase;
`

const Form = styled.form`
  text-align: center;
  margin-top: 20vh;
`

const Error = styled.p`
  color: red;
`

class Login extends Component {
  constructor() {
    super()
    this.state = {
      password: ''
    }
  }

	componentDidMount() {
    if (this.props.jwt) {
      this.redirectToDashboard()
    }
  }
  
  redirectToDashboard() {
    this.props.history.push('/admin/dashboard')
  }

  login(e) {
    e.preventDefault()
    this.props.login(this.state.password, this.redirectToDashboard.bind(this))
  }

  updateField(field, event) {
		this.setState({ [ field ]: event.target.value })
	}

  render() {
    return (
      <Wrapper>
        <Form 
          onSubmit={this.login.bind(this)}>
          <Title>Haunted Ticketing Admin</Title>
          <Input 
            type="password"
            onChange={this.updateField.bind(this, 'password')} 
            value={this.state.password} />
          <Button disabled={this.props.loading}>Login</Button>
          <Error>{this.props.error}</Error>
        </Form>
      </Wrapper>
    )
  }
}

export default connect(state => ({
  // Map state to props.
  jwt: state.login.jwt,
  error: state.login.error,
  loading: state.login.loading
}), {
  // Map dispatch to props.
  login: loginActions.login
})(Login)
