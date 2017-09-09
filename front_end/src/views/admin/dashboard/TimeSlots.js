import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import TimeSlotsForm from './TimeSlotsForm'
import * as timeSlotActions from '../../../ducks/timeSlots.duck'
import moment from 'moment'

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
const Delete = styled.i`
  cursor: pointer;
  position: absolute;
  top: 5px;
  right: 5px;
`

class TimeSlots extends Component {
  constructor() {
    super()
    this.state = {
      
    }
  }

	componentDidMount() {
    this.props.getTimeSlots(this.props.jwt)
  }

  delete(id) {
    if (confirm('Are you sure you want to delete this time slot?')) {
      this.props.destroyTimeSlot(this.props.jwt, id, () => {
        this.props.getTimeSlots(this.props.jwt)
      })
    }
  }
  
  render() {
    return (
      <Wrapper>
        <Title>Time Slots</Title>
        <TimeSlotsForm />
        <FlexBox>
          {/* Loop though time slots. */}
          { this.props.timeSlots.map(timeSlot => {
            return (
              <Card key={timeSlot.id}>
                <Delete className="fa fa-trash" onClick={this.delete.bind(this, timeSlot.id)} />
                <p><strong>Start:</strong>{' '}
                  { moment.unix(timeSlot.start_time).format('h:mma - MM.DD.YY') }
                </p>
                <p><strong>End:</strong>{' '}
                  { moment.unix(timeSlot.end_time).format('h:mma - MM.DD.YY') }
                </p>
                <p><strong>Length (hrs):</strong>{' '}
                { moment.unix(timeSlot.end_time).diff(moment.unix(timeSlot.start_time), 'h', true) }
              </p>
                <p><strong>Total Number Available:</strong>{' '} 
                  { timeSlot.number_available }
                </p>
                <p><strong>Tickets Sold:</strong>{' '}</p>
                <p><strong>Tickets Redeemed:</strong>{' '}</p>
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
  timeSlots: state.timeSlots.timeSlots
}), {
  // Map dispatch to props.
  getTimeSlots: timeSlotActions.getTimeSlots,
  destroyTimeSlot: timeSlotActions.destroyTimeSlot
})(TimeSlots)

