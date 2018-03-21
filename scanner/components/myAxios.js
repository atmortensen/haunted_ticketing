import axios from 'axios'

export default axios.create({
  baseURL: "https://haunted-ticketing.herokuapp.com"
  // baseURL: 'http://192.168.86.244:3001'
});
