import styled, { injectGlobal } from 'styled-components'
import '../node_modules/font-awesome/css/font-awesome.min.css'

// Global styles to be used sparingly...
// eslint-disable-next-line
injectGlobal`
  * {
    font-family: sans-serif;
    box-sizing: border-box;
    font-family: 'Alegreya', serif;
  }
  body {
    margin: 0;
    color: #e6e6e6;
    font-size: 20px;
    @media print {
      color: #000;
    }
  }
  p {
    margin: 0 0 8px 0;
    line-height: 110%;
    @media print {
    background: none;
  }
  }
  a {
    color: #e6e6e6;
    @media print {
      color: #000;
    }
  }
`

export const Input = styled.input`
  padding: 5px;
  margin: 0 5px 5px 0;
  &:last-of-type {
    margin-right: 0;
  }
  border: solid 1px #999;
  font-size: 18px;
  text-align: ${props => props.center ? 'center' : 'left'};
`
export const Button = styled.button`
  padding: 5px 8px;
  border: solid 1px #999;
  margin: 0 5px 5px 0;
  &:last-of-type {
    margin-right: 0;
  }
  font-size: 18px;
  background: #d9d9d9;
  cursor: pointer;
`
