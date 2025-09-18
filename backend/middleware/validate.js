const {validationResult } = require('express-validator');

function validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array()[0];  
      return res.status(400).json({ error: firstError });
    }
    next();
  }

  module.exports=validate;