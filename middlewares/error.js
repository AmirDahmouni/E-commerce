module.exports = function (msg, req, res, next) {
    console.log(msg);
    return res.status(500).send({ error: msg })
  };