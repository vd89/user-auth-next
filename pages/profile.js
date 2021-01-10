import React, { Component } from 'react';
import { getUserProfile } from '../lib/auth';

export default class profile extends Component {
  state = {
    user: 'Loading profile......',
  };
  componentDidMount() {
    getUserProfile().then((user) => this.setState({ user }));
  }

  render() {
    const { user } = this.state;
    return <pre> {JSON.stringify(user, null, 2)} </pre>;
  }
}
