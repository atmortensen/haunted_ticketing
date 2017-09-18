import axios from 'axios'

// TYPES
const LOAD = 'promoCodes/LOADING'
const ERROR = 'promoCodes/LOGIN'
const SUCCESS = 'promoCodes/SUCCESS'
const SET_PROMO_CODE = 'promoCodes/SET_PROMO_CODE'

// INITIAL STATE
const initialState = {
	loading: false,
	error: null,
	promoCodes: [],
	selectedPromoCode: null
}

// REDUCER
export default (state = initialState, payload) => {
	switch (payload.type) {
		case LOAD:
			return { ...state, loading: true }
		case ERROR:
			return { ...state, loading: false, error: payload.error, selectedPromoCode: null }
		case SUCCESS:
			return { ...state, loading: false, promoCodes: payload.promoCodes, error: null }
		case SET_PROMO_CODE:
			return { ...state, loading: false, selectedPromoCode: payload.selectedPromoCode, error: null }
		default: 
			return state
	}
}

// GET PROMO CODE
export function getPromoCode(code) {
	
	return dispatch => {
		dispatch({
			type: LOAD
		})
		axios.get('/api/promo_code/' + code).then(response => {
			if (response.data.error) {
				dispatch({
					type: ERROR,
					error: response.data.error
				})
			} else {
				dispatch({
					type: SET_PROMO_CODE,
					selectedPromoCode: response.data
				})
			}
		})
	}
}

// REMOVE PROMO CODE
export function removePromoCode() {
	return {
		type: SET_PROMO_CODE,
		selectedPromoCode: null
	}
}

// GET PROMO CODES
export function getPromoCodes(jwt) {

	return dispatch => {
		dispatch({
			type: LOAD
		})
		axios.get('/api/promo_codes', { headers: { 'Authorization': jwt } }).then(response => {
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
		axios.post('/api/promo_code', promoCode, { headers: { 'Authorization': jwt } }).then(response => {
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
		axios.delete('/api/promo_code/' + id, { headers: { 'Authorization': jwt } }).then(response => {
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
