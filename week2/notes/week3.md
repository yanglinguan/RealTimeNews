## Redis
* lpush: l means left: add element at beginning of the list
* Rpush: r means right
* every type is string, when assign an integer, we can incr, it will convert to integer, but if it cannot convert to integer, then error 
* single thread nonblocking i/o
* server side cache

## Nginx
* reverse proxy: between internet and server
* IP hash: client from same IP will go the same server, good is server will cache the data client need, but will not balance