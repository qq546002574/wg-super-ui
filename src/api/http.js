import Https from './apihttps.js';
import env from '../../env';

const https = new Https({
  baseUrl: env.baseUrl,
});

export default https;
