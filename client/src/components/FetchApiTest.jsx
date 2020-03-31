import React, { Component, Fragment } from 'react';
import socketIOClient from 'socket.io-client';

class FetchApiTest extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: '', greeting: '' }
  }

  callAPI() {
    fetch('http://localhost:9000/testAPI')
      .then(res => res.text())
      .then(res => this.setState({ ...this.state, apiResponse: res }))
      .catch(err => console.error(err))
  }

  componentDidMount() {
    this.callAPI();
    const socket = socketIOClient('http://localhost:9000/');
    // socket.on()
    socket.emit('emit data!', { data: 'much data!' });
    socket.emit('user', { user: 'Jon' });
    socket.on('greeting message', msg => {
      console.log('msg: ', msg);
      this.setState({ ...this.state, greeting: msg });
    })
  }

  render() {
    return (
    <Fragment>
      <p>
        { this.state.apiResponse }
      </p>
      <p>
        { this.state.greeting }
      </p>
    </Fragment>
    )
  }
}

export default FetchApiTest;