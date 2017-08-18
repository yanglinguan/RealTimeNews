
class Auth {
  /**
   * Authencate a user, store the token string to localStorage
   */
  static authenticateUser(token, email) {
    // store email so that it is easy to show on the nev bar
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
  }

  /**
   * Check if current user is authenticated
   */
  static isUserAuthenticated() {
    return localStorage.getItem('token') !== null;
  }

  /**
   * Log out a user by deleting token and email from localStorage
   */
  static deauthenticate() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
  }

  /**
   * Get token value so that token will send send together with the request to
   * get more news
   */
   static getToken() {
     return localStorage.getItem('token');
   }

   /**
    * Get email to show on the nav bar
    */
    static getEmail() {
      return localStorage.getItem('email');
    }
}

export default Auth;
