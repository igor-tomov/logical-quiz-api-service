var env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    endpoint: 'mongodb://localhost/logical-quiz'
  },
  test: {
    endpoint: 'mongodb://localhost/logical-quiz-test'
  }
  // todo: config for rest environments
};

module.exports = config[env];
