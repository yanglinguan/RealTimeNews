2017/07/17

*   cookies: per domain, from server to brower, in the first response: set-cookies, after that, each request will set cookies as a header to server
*   cookies based authentication: server and client should be in the same domain
* Httponly: only server can change cookies
* cookies has size limite
* session cookies: close the tab, then cookies delete
* each cookie is about 4kb
* for each cookie, it must contain Name, Domain, Path

## Auth
* JWT token:
* Head: type, encode algorithm
* Payload: 
* Head and Payload is Base64 
* Signature: encode Head and Payload using secret