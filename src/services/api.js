/* eslint-disable no-multi-assign */
/* eslint-disable no-undef */
const axios = require('axios');

const urlPipedriveApi = process.env.PIPE_DRIVE_API;
const pipedriveApi = axios.create({
  baseURL: `${urlPipedriveApi}`,
});

module.exports = { pipedriveApi };
