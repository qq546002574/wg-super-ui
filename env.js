const env = {
  development: '/api',
  production: '',
};

export default {
  baseUrl: env[process.env.NODE_ENV],
};
