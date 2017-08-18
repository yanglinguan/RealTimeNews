import React, {PropTypes} from 'react' // React is the default export class in react, but not PropTypes

import SignUpForm from './SignUpForm'

class SignUpPage extends React.Component {
  constructor(props) {
    super(props);
    // initialize state
    this.state = {
      errors: {},
      user: {
        email: '',
        password: '',
        confirm_password: ''
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
    const confirm_password = this.state.user.confirm_password;

    if (password !== confirm_password) {
      return;
    }
    // TODO post login data
  }

  // update the user info (email and password) when user type the email and password
  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user; // need to bind the changeUser, otherwise 'this' does not define
    user[field] = event.target.value;

    this.setState({ user }); // setState will change state and reload UI

    if (this.state.user.password !== this.state.user.confirm_password) {
      const errors = this.state.errors;
      errors.password = "Password and Confirm Password don't match.";
      this.setState({errors})
    } else {
      const errors = this.state.errors;
      errors.password = '';
      this.setState({errors});
    }
  }

  render() {
    return (
      <SignUpForm
        onSubmit={this.processForm}
        onChange={this.changeUser}
        errors={this.state.errors}
        user={this.state.user}
      />
    );
  }
}

export default SignUpPage;
