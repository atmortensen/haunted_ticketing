import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

const Wrapper = styled.div`

`

class Ticket extends Component {
	constructor() {
		super()
		this.state={

		}
	}

	componentDidMount() {

	}

	// Input handle function
	updateField(field, event) {
		this.setState({ [ field ]: event.target.value })
	}

  render() {
    return (
    	<Wrapper>

	    </Wrapper>
    )
  }
}

export default connect(state => ({
	// Map state to props.
}), {
	// Map dispatch to props.
})(Ticket)
