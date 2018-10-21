const LocalHtpasswdStrategy = require('passport-local-htpasswd');

/**
 *
 * @param {Passport} passport The initialized passport object
 * @param {*} csrfMiddleware The middleware use to setup a crsf token (if needed)
 * @param {*} config The configuration for this addon
 */
module.exports = (passport, csrfMiddleware, config) => {
  passport.use(new LocalHtpasswdStrategy({ file: config.authFile }));

  const passportAuth = passport.authenticate('local-htpasswd', {
    successRedirect: '/',
    failureRedirect: config.mountPoint,
    failureFlash: 'Invalid username or password.'
  });

  const mountPoint = config.mountPoint;

  const endpoints = {
    [mountPoint]: {
      link: `<a href="${mountPoint}">Login with local authentication</a>`,
      get: {
        handler: (req, res, next) => {
          const csrfToken = req.csrfToken();
          const scope = {
            csrfToken,
            errors: req.flash().error
          };
          res.render(`${__dirname}/template`, scope);
        },
        middlewares: [csrfMiddleware]
      },
      post: {
        middlewares: [csrfMiddleware, passportAuth]
      }
    }
  };

  return {
    endpoints
  };
};
