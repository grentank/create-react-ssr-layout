export default function resLocals(req, res, next) {
  res.locals.path = req.originalUrl;
  res.locals.user = req.session?.user;
  next();
}
