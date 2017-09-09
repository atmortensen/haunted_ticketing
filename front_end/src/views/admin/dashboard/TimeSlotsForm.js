import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Button, Input } from '../../../globalStyles'
import * as timeSlotActions from '../../../ducks/timeSlots.duck'
import moment from 'moment'

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

class TimeSlots extends Component {
  constructor() {
    super()
    this.state = {
      startTime: '2017-10-30T00:00',
      endTime: '2017-10-30T00:00',
      numberAvailable: ''
    }
  }

  updateField(field, event) {
		this.setState({ [field]: event.target.value })
	}
  
  createTimeSlot(e) {
    e.preventDefault()
    const timeSlot = {
      'start_time': moment(this.state.startTime).unix(),
      'end_time': moment(this.state.endTime).unix(),
      'number_available': this.state.numberAvailable
    }
    this.props.createTimeSlot(this.props.jwt, timeSlot, () => {
      this.props.getTimeSlots(this.props.jwt)
    })
  }
  
  render() {
    return (
      <Wrapper>
        {this.props.error &&
          <Error>{ this.props.error }</Error>
        }
        <Form onSubmit={this.createTimeSlot.bind(this)}>
          <Input
            type="datetime-local"
            value={this.state.startTime}
            onChange={this.updateField.bind(this, 'startTime')} />
            {this.startTime}
          <Input
            type="datetime-local" 
            value={this.state.endTime}
            onChange={this.updateField.bind(this, 'endTime')} />
          <Input
            type="number" 
            placeholder="Number Available"
            value={this.state.numberAvailable}
            onChange={this.updateField.bind(this, 'numberAvailable')} />
          <Button disabled={this.props.loading}>Create</Button>
        </Form>
	    </Wrapper>
    )
  }
}

export default connect(state => ({
  // Map state to props.
  jwt: state.login.jwt,
  error: state.timeSlots.error,
  loading: state.timeSlots.loading
}), {
  // Map dispatch to props.
  createTimeSlot: timeSlotActions.createTimeSlot,
  getTimeSlots: timeSlotActions.getTimeSlots
})(TimeSlots)
