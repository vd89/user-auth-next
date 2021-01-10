const next = require('next');
const express = require('express');
const { default: axios } = require('axios');
const cookieParser = require('cookie-parser');

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 8282;

const app = next({ dev });
const handle = app.getRequestHandler();

const authenticate = async (email, password) => {
  const { data } = await axios.get('https://jsonplaceholder.typicode.com/users');
  return data.find((user) => {
    if (user.email === email && user.website === password) {
      // console.log(' 👽 👽', user);
      return user;
    }
  });
};

const AUTH_USER_TYPE = 'authenticated';
const COOKIE_SECRET = 'THIS_IS_A_COOKIE_SECRET';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: !dev,
  signed: true,
};

app.prepare().then(() => {
  const server = express();
  server.use(express.json());
  server.use(cookieParser(COOKIE_SECRET));
  server.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await authenticate(email, password);
    // console.log(' 👽 👽', user);
    if (!user) {
      return res.status(403).send('Invalid email or password');
    }
    const userData = {
      name: user.name,
      email: user.email,
      type: AUTH_USER_TYPE,
    };
    res.cookie('token', userData, COOKIE_OPTIONS);
    res.json({ msg: 'success', userData });
  });

  server.get('/api/profile', async (req, res) => {
    console.log(' 🥇', req);
    const { signedCookies = {} } = req;
    const { token } = signedCookies;
    console.log(token);
    console.log(signedCookies);
    if (token && token.email) {
      const { data } = await axios.get('https://jsonplaceholder.typicode.com/users');
      const userProfile = data.find((user) => user.email === token.email);
      return res.json({ user: userProfile });
    }
    res.statusCode(404);
  });

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`Listening on PORT ${port}`);
  });
});
