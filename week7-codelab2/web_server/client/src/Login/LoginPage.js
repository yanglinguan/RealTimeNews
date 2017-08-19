import React, {PropTypes} from 'react' // React is the default export class in react, but not PropTypes
import Auth from '../Auth/Auth';
import LoginForm from './LoginForm'

class LoginPage extends React.Component {
  constructor(props, context) {
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

    // Post login data
    fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        cache: false,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
          body: JSON.stringify({
          email: email,
          password: password
        })
    }).then(response => {
      if (response.status === 200) {
        this.setState({
          errors: {}
        });
        // response.json is aync, callback needed
        response.json().then(jsonData => {
          console.log(jsonData);
          Auth.authenticateUser(jsonData.token, email);
          // redirect to home page
          this.context.router.replace('/');
        });
      } else {
        console.log('Login failed')
        response.json().then(jsonData => {
          const errors = jsonData.errors ? jsonData.errors : {};
          errors.summary = jsonData.message;
          this.setState({errors});
        });
      }
    });
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

// To make react router work!!!
LoginPage.contextTypes = {
  router: PropTypes.object.isRequired
};

export default LoginPage;
