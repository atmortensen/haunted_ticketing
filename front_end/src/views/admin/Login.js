import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Input, Button } from '../../global_styles'
import * as loginActions from '../../ducks/login.duck'
import * as formActions from '../../ducks/forms.duck'

const Wrapper = styled.div`
   width: 100%;
   height: 100vh;
   display: flex;
   align-items: center;
   justify-content: center;
`

const Title = styled.h1`
  font-size: 30px;
  text-transform: uppercase;
`

const Form = styled.form`
  text-align: center;
`

const Error = styled.p`
  color: red;
`

class Login extends Component {

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
    this.props.login(this.props.password, this.redirectToDashboard.bind(this))
    this.props.clearField('password')
  }

  render() {
    return (
      <Wrapper>
        <Form 
          onSubmit={this.login.bind(this)}>
          <Title>Haunted Ticketing Admin</Title>
          <Input 
            type="password"
            onChange={this.props.updateField.bind(null, 'password')} 
            value={this.props.password} />
          <Button disabled={this.props.loading}>{this.props.loading ? 'Loading' : 'Login'}</Button>
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
  loading: state.login.loading,
  password: state.forms.password
}), {
  // Map dispatch to props.
  login: loginActions.login,
  updateField: formActions.updateField,
  clearField: formActions.clearField
})(Login)
