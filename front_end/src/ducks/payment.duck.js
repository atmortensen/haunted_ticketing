// import axios from 'axios'

// TYPES
const SET_TIME_SLOT = 'payment/SET_TIME_SLOT'
const ERROR = 'payment/payment'

// INITIAL STATE
const initialState = {
  loading: false,
  error: null,
  selectedTimeSlot: null
}

// REDUCER
export default (state = initialState, payload) => {
  switch (payload.type) {
    case SET_TIME_SLOT:
      return {...state, selectedTimeSlot: payload.timeSlot}
    case ERROR:
      return {...state, loading: false, error: payload.error}
    default: 
      return state
  }
}

// payment ACTION
export function setTimeSlot(timeSlot) {

	return {
    type: SET_TIME_SLOT,
    timeSlot: timeSlot
  }
}
