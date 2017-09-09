import axios from 'axios'

// TYPES
const LOAD = 'transactions/LOADING'
const ERROR = 'transactions/LOGIN'
const SUCCESS = 'transactions/SUCCESS'

// INITIAL STATE
const initialState = {
  loading: false,
  error: null,
  transaction: null
}

// REDUCER
export default (state = initialState, payload) => {
  switch (payload.type) {
    case LOAD:
      return {...state, loading: true}
    case ERROR:
      return {...state, loading: false, error: payload.error}
    case SUCCESS:
      return {...state, loading: false, transaction: payload.transaction, error: null}
    default: 
      return state
  }
}

// CREATE TRANSACTIONS
export function createTransaction(transaction, success) {
  
  return dispatch => {
    dispatch({
      type: LOAD
    })
    axios.post('http://localhost:3001/api/transaction', transaction).then(response => {
      if (response.data.error) {
        dispatch({
          type: ERROR,
          error: response.data.error
        })
      } else {
        dispatch({
          type: SUCCESS,
          transaction: response.data
        })
        success()
      }
    })
  }
}
