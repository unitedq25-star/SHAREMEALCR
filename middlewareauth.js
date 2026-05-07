function authRequired(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : "";

  const expectedToken = process.env.APP_API_TOKEN || "";

  if (!token || token !== expectedToken) {
    return res.status(401).json({
      ok: false,
      message: "Unauthorized. Provide a valid Bearer token.",
    });
  }

  return next();
}

module.exports = {
  authRequired,
};
