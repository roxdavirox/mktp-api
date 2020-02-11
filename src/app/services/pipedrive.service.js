/* eslint-disable camelcase */
/* eslint-disable no-console */
// criar promise para as rotas da api do pipedrive
const FormData = require('form-data');
const { pipedriveApi } = require('../../services/api');

const pipedriveToken = process.env.PIPE_DRIVE_TOKEN_API;

const getPersonByEmail = (email) => new Promise((resolve, reject) => {
  const personEmailUrl = `persons/find?term=${email}&search_by_email=1&api_token=${pipedriveToken}`;
  pipedriveApi.get(personEmailUrl)
    .then((res) => resolve(res.data))
    .catch(reject);
});

const addPerson = (person) => new Promise((resolve, reject) => {
  const personsUrl = `persons?api_token=${pipedriveToken}`;
  const formData = new FormData();
  formData.append('name', person.name);
  formData.append('owner_id', person.owner_id);
  formData.append('email', person.email);
  formData.append('phone', person.phone);
  pipedriveApi.post(
    personsUrl,
    formData,
    { headers: formData.getHeaders() },
  )
    .then((res) => resolve(res.data))
    .catch(reject);
});

const pipedriveService = {
  async createDeal({
    name, owner_id, email, phone,
  }) {
    const emailResponse = await getPersonByEmail(email);
    const { data } = emailResponse;
    if (!data) {
      const personResponse = await addPerson({
        name,
        owner_id,
        email,
        phone,
      });
      console.log('personResponse:', personResponse);
      return personResponse;
    }
    return emailResponse;
  },
};

module.exports = pipedriveService;
