// EXAMPLE DUCK FOR REFERENCE
import axios from 'axios'

// TYPES
const FETCH_CHARS = 'catApi/FETCH_CHARS'
const RECEIVE_CHARS = 'catApi/RECEIVE_CHARS'

// REDUCER
export default (state = {}, payload) => {
  switch (payload.type) {
    case FETCH_CHARS:
      return {...state, message: 'LOADING'}
    case RECEIVE_CHARS:
      return {...state, image: payload.image, message: ''}
    default: 
      return state
  }
}

// ACTIONS
export function getChars() {
	return dispatch => {
		dispatch({type: FETCH_CHARS})
		axios.get('http://thecatapi.com/api/images/get?format=xml').then(response => {
			const imageURL = new DOMParser().parseFromString(response.data, 'text/xml').getElementsByTagName('url')[0].innerHTML
			dispatch({
				type: RECEIVE_CHARS,
				image: imageURL
			})
		})
	}
}

