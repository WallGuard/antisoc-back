const me = async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (err) {
    err.functionName = me.name;
    err.fileName = __filename;
    next(err);
  }
};

export default me;
