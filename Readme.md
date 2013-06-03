
# PinPigeon

Send pins as printed & shipped postcards for 1.95 each.

<http://niftylettuce.com/posts/does-pinterest-own-the-word-pin/>

## Setup

Since I pretty much just open sourced it how it was -- you'll have to follow these steps to get it running locally.

1. Install [Node.js][nodejs] version `0.8.x` or greater.
2. Generate self-signed SSL key pair (requires `openssl` to be installed via apt-get, brew, &hellip;):

    ```bash
    cd ./certs/development
    openssl req -new -x509 -days 365 -nodes -out cert.crt -keyout key.key
    # just fill in random values and don't enter a password, this is just for testing
    ```

3. Install [MongoDB][mongodb] and [Redis][redis].  You might be able to use apt-get or brew, depending on your OS.
4. Sign up for a free [Stripe API key][stripe], then update the API key for `secretKey` and `publishableKey` in `./args/index.js`.
5. Sign up for a free [Sincerely API key][sincerely], then update the API key for `sincerely` in `./args/config.js`.
6. Install the node modules, then start the server.

    ```bash
    npm install
    sudo node app
    ```

7. Visit the site locally (accept SSL warning) at <https://localhost/>.

[nodejs]: http://nodejs.org
[sincerely]: https://dev.sincerely.com/user/signup
[mongodb]: http://www.mongodb.org/downloads
[redis]: http://redis.io/download


## Credits

* [Stamp icon][1]

[1]: http://www.iconfinder.com/icondetails/71656/24/_icon


## License

The MIT License

Copyright (c) 2012- Nick Baugh <niftylettuce@gmail.com> (http://niftylettuce.com/)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
