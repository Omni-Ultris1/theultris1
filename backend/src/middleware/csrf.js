/**
 * CSRF protection middleware for cookie-using endpoints.
 *
 * Since we use httpOnly refresh token cookies (sameSite: strict),
 * cross-site requests from other origins cannot include those cookies in
 * modern browsers. As a defence-in-depth measure this middleware also
 * requires a custom request header (`X-Requested-With: XMLHttpRequest`)
 * for any state-mutating request that processes cookies, which cannot be
 * set by a cross-origin HTML form.
 */
const csrfProtect = (req, res, next) => {
  // Skip non-cookie-bearing requests and safe methods
  if (!req.cookies || Object.keys(req.cookies).length === 0) return next();
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();

  const requestedWith = req.headers['x-requested-with'];
  if (!requestedWith || requestedWith.toLowerCase() !== 'xmlhttprequest') {
    return res.status(403).json({
      success: false,
      message: 'CSRF check failed: X-Requested-With header required for cookie-bearing requests',
    });
  }
  next();
};

module.exports = { csrfProtect };
