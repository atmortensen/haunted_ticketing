import axios from 'axios'

// TYPES
const LOGIN = 'login/LOADING'
const ERROR = 'login/LOGIN'
const SUCCESS = 'login/SUCCESS'
const LOGOUT = 'login/LOGOUT'

// INITIAL STATE
const initialState = {
  loading: false,
  jwt: localStorage.getItem('jwt'),
  error: null
}

// REDUCER
export default (state = initialState, payload) => {
  switch (payload.type) {
    case LOGIN:
      return {...state, loading: true, error: null}
    case ERROR:
      return {...state, loading: false, error: payload.error}
    case SUCCESS:
      return {...state, loading: false, jwt: payload.jwt, error: null}
    case LOGOUT:
      return {...state, jwt: null}
    default: 
      return state
  }
}

// LOGIN ACTION
export function login(password, success) {

	return dispatch => {
		dispatch({
      type: LOGIN
    })
		axios.post('http://localhost:3001/api/login', { password }).then(response => {
      if (response.data.error) {
        dispatch({
          type: ERROR,
          error: response.data.error
        })
      } else {
        localStorage.setItem('jwt', response.data)
        dispatch({
          type: SUCCESS,
          jwt: response.data
        })
        success()
      }
		})
	}
}

// LOGOUT ACTION
export function logout(cb) {
  cb()
  localStorage.removeItem('jwt')

  return {
    type: LOGOUT
  }
}
