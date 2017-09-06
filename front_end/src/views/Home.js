import React, { Component } from 'react'
import { connect } from 'react-redux'
// import styled from 'styled-components'
import { Elements } from 'react-stripe-elements'
// import * as apiActions from '../ducks/apiDuck'
import Form from './Form'

class Home extends Component {
	constructor() {
		super()
		this.state={

		}
	}

	componentWillMount() {
	}

  render() {
    return (
			<Elements>
				<Form />
			</Elements>
    )
  }
}

export default connect(state => ({
	// Map state to props.
	state
}), {
	// Map dispatch to props.
})(Home)
