var env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    endpoint: 'mongodb://localhost/logical-quiz'
  },
  test: {
    endpoint: 'mongodb://localhost/logical-quiz-test'
  },

  production: {
    endpoint: process.env.MONGODB_URI || 'mongodb://localhost/logical-quiz'
  }
  // todo: config for rest environments
};

module.exports = config[env];
