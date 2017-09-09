import axios from 'axios'

// TYPES
const LOAD = 'timeSlots/LOADING'
const ERROR = 'timeSlots/LOGIN'
const SUCCESS = 'timeSlots/SUCCESS'
const SET_TIME_SLOT = 'timeSlots/SET_TIME_SLOT'

// INITIAL STATE
const initialState = {
  loading: false,
  error: null,
  timeSlots: [],
  selectedTimeSlot: null
}

// REDUCER
export default (state = initialState, payload) => {
  switch (payload.type) {
    case LOAD:
      return {...state, loading: true}
    case ERROR:
      return {...state, loading: false, error: payload.error}
    case SUCCESS:
      return {...state, loading: false, timeSlots: payload.timeSlots, error: null}
    case SET_TIME_SLOT:
      return {...state, selectedTimeSlot: payload.selectedTimeSlot}
    default: 
      return state
  }
}

// SET SELECTED TIME SLOT
export function setTimeSlot(timeSlot) {
  return {
    type: SET_TIME_SLOT,
    selectedTimeSlot: timeSlot
  }
}

// GET TIME SLOTS
export function getTimeSlots() {

	return dispatch => {
		dispatch({
      type: LOAD
    })
		axios.get('http://localhost:3001/api/time_slots').then(response => {
      if (response.data.error) {
        dispatch({
          type: ERROR,
          error: response.data.error
        })
      } else {
        dispatch({
          type: SUCCESS,
          timeSlots: response.data
        })
      }
		})
	}
}

// CREATE TIME SLOTS
export function createTimeSlot(jwt, timeSlot, success) {
  
  return dispatch => {
    dispatch({
      type: LOAD
    })
    axios.post('http://localhost:3001/api/time_slot', timeSlot, { headers: {'Authorization': jwt} }).then(response => {
      if (response.data.error) {
        dispatch({
          type: ERROR,
          error: response.data.error
        })
      } else {
        success()
      }
    })
  }
}

// DESTROY TIME SLOTS
export function destroyTimeSlot(jwt, id, success) {
  
  return dispatch => {
    dispatch({
      type: LOAD
    })
    axios.delete('http://localhost:3001/api/time_slot/' + id, { headers: {'Authorization': jwt} }).then(response => {
      if (response.data.error) {
        dispatch({
          type: ERROR,
          error: response.data.error
        })
      } else {
        success()
      }
    })
  }
}
