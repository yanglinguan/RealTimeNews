import React, {PropTypes} from 'react' // React is the default export class in react, but not PropTypes

import LoginForm from './LoginForm'

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    // initialize state
    this.state = {
      errors: {},
      user: {
        email: '',
        password: '',
      }
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  // pre-submission
  processForm(event) {
    // prevent browser default behavior
    // when click a button, browser may automatically send a post request
    // we don't want the browser's default behavior
    event.preventDefault();

    const email = this.state.user.email;
    const password = this.state.user.password;

    // TODO post login data
  }

  // update the user info (email and password) when user type the email and password
  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user; // need to bind the changeUser, otherwise 'this' does not define
    user[field] = event.target.value;

    this.setState({ user });
  }

  render() {
    return (
      <LoginForm
        onSubmit={this.processForm}
        onChange={this.changeUser}
        errors={this.state.errors}
        user={this.state.user}
      />
    );
  }
}

export default LoginPage;
