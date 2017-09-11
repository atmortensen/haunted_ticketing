import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import background from '../assets/skull.jpg'

const Background = styled.div`
  width: 100%;
  height: 100vh;
  background: url(${background});
  background-size: cover;
  background-position: center;
  position: fixed;
  overflow: auto;
  @media print {
    background: none;
  }
`
const Wrapper = styled.div`
  max-width: 800px;
  width: 90vw;
  margin: auto;
  padding: 75px 0;
  position: relative;
  @media (max-width: 800px) {
    padding: 5vw 0 20vw 0;
  }
`
const Content = styled.div`
  background: rgba(0, 0, 0, 0.7);
  padding: 25px;
  border-radius: 15px;
  @media (max-width: 800px) {
    padding: 15px;
  }
  @media print {
    background: none;
  }
`
const Header = styled.h1`
  margin: 0 0 10px 0;
  padding-bottom: 5px;
  text-align: center;
  font-size: 35px;
  font-weight: normal;
  font-family: 'Special Elite', cursive;
  border-bottom: 2px solid #e6e6e6;
  @media (max-width: 800px) {
    font-size: 26px;
  }
`
const Footer = styled.p`
  text-align: center;
  padding-top: 25px;
`

class Template extends Component {
	constructor() {
		super()
		this.state={

		}
	}

	componentDidMount() {

	}

	// Input handle function
	updateField(field, event) {
		this.setState({ [ field ]: event.target.value })
	}

  render() {
    return (
      <Background>
        <Wrapper>
          <Content>
            <Header>
              Haunted Mansions of Albion Ticketing
            </Header>

            {this.props.children}

            <Footer>
              Haunted Ticketing &copy; 2017 | <a href="mailto:support@huntedticketing.com">
                support@hauntedticketing.com
              </a>
            </Footer>
          </Content>
        </Wrapper>
      </Background>
    )
  }
}

export default connect(state => ({
	// Map state to props.
}), {
	// Map dispatch to props.
})(Template)
