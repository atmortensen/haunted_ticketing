import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

const Wrapper = styled.div`
	width: 50%;
	border: 1px solid #999;
	padding: 5px;
	margin-left: 5px;
`

class TimeSlots extends Component {
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
        <h2 style={{textAlign: 'center'}}>Time Slots</h2>
	    </Wrapper>
    )
  }
}

export default connect(state => ({
	// Map state to props.
}), {
	// Map dispatch to props.
})(TimeSlots)
