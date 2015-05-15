function checkToken(req, res, next){
  if(!req.query.access_token) return res.status(403).json('access token required');
  else return next();
};

export { checkToken };
