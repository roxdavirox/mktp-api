/* eslint-disable no-console */
// criar promise para as rotas da api do pipedrive
const FormData = require('form-data');
const { pipedriveApi } = require('../../services/api');

const pipedriveToken = process.env.PIPE_DRIVE_TOKEN_API;

const addPerson = (data) => new Promise((resolve, reject) => {

});

const pipedriveService = {
  async createDeal() {
    const personsUrl = `persons?api_token=${pipedriveToken}`;
    const formData = new FormData();
    formData.append('name', 'Davi Teste');
    formData.append('owner_id', '21028');
    formData.append('email', 'roxdavirox@gmail.com');
    formData.append('phone', '11977689294');
    const res = await pipedriveApi.post(personsUrl, formData, { headers: formData.getHeaders() });
    console.log('response:', res);
  },
};

module.exports = pipedriveService;
