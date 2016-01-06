var winston = require('winston');



module.exports = new winston.Logger({
  level: 'debug',
  transports: [
    new (winston.transports.Console)()
  ]
});