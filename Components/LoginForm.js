import React, { Component } from 'react';

export default class LoginForm extends Component {
  state = {
    email: '',
    password: '',
  };
  onChangeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  onSubmitHandler = (e) => {
    e.preventDefault();
    console.log(this.state);
  };
  render() {
    return (
      <div>
        <form onSubmit={this.onSubmitHandler}>
          <div>
            <input type='email' placeholder='Email' name='email' onChange={this.onChangeHandler} />
          </div>
          <div>
            <input type='password' placeholder='Password' name='password' onChange={this.onChangeHandler} />
          </div>
          <button type='submit'>Submit</button>
        </form>
      </div>
    );
  }
}
