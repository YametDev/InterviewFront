import axios from 'axios'

const API_ROOT = process.env.SERVER_ENDPOINT;

axios.defaults.baseURL = API_ROOT;
axios.defaults.headers.post['Content-Type'] = 'application/json';

export default axios;
