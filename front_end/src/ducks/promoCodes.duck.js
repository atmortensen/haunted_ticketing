import axios from 'axios'

// TYPES
const LOAD = 'promoCodes/LOADING'
const ERROR = 'promoCodes/LOGIN'
const SUCCESS = 'promoCodes/SUCCESS'

// INITIAL STATE
const initialState = {
  loading: false,
  error: null,
  promoCodes: []
}

// REDUCER
export default (state = initialState, payload) => {
  switch (payload.type) {
    case LOAD:
      return {...state, loading: true}
    case ERROR:
      return {...state, loading: false, error: payload.error}
    case SUCCESS:
      return {...state, loading: false, promoCodes: payload.promoCodes, error: null}
    default: 
      return state
  }
}

// GET PROMO CODES
export function getPromoCodes(jwt) {

	return dispatch => {
		dispatch({
      type: LOAD
    })
		axios.get('http://localhost:3001/api/promo_codes', { headers: {'Authorization': jwt} }).then(response => {
      if (response.data.error) {
        dispatch({
          type: ERROR,
          error: response.data.error
        })
      } else {
        dispatch({
          type: SUCCESS,
          promoCodes: response.data
        })
      }
		})
	}
}

// CREATE PROMO CODES
export function createPromoCode(jwt, promoCode, success) {
  
  return dispatch => {
    dispatch({
      type: LOAD
    })
    axios.post('http://localhost:3001/api/promo_code', promoCode, { headers: {'Authorization': jwt} }).then(response => {
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

// DESTROY PROMO CODES
export function destroyPromoCode(jwt, id, success) {
  
  return dispatch => {
    dispatch({
      type: LOAD
    })
    axios.delete('http://localhost:3001/api/promo_code/' + id, { headers: {'Authorization': jwt} }).then(response => {
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
