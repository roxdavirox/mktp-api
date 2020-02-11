/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable no-console */
// criar promise para as rotas da api do pipedrive
const FormData = require('form-data');
const { pipedriveApi } = require('../../services/api');

const pipedriveToken = process.env.PIPE_DRIVE_TOKEN_API;

const isToday = (d) => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const day = new Date().getDate();
  const [_year, _month, _day] = d.substring(0, d.indexOf(' ')).split('-');
  const date = new Date(_year, _month, _day);
  const todayDate = new Date(year, month, day);
  return date.getTime() === todayDate.getTime();
};

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

const addDeal = (deal) => new Promise((resolve, reject) => {
  const dealsUrl = `deals?api_token=${pipedriveToken}`;
  const formData = new FormData();
  formData.append('title', deal.title);
  formData.append('value', deal.value);
  formData.append('user_id', deal.user_id);
  formData.append('stage_id', deal.stage_id);
  formData.append('person_id', deal.person_id);
  formData.append('add_time', deal.add_time);
  formData.append('status', 'open');
  pipedriveApi.post(
    dealsUrl,
    formData,
    { headers: formData.getHeaders() },
  )
    .then((res) => resolve(res.data))
    .catch(reject);
});

const getDealsByPersonId = (id) => new Promise((resolve, reject) => {
  const dealsUrl = `deals/find?term=Or%C3%A7amento%20online&person_id=${id}&api_token=${pipedriveToken}`;
  pipedriveApi.get(dealsUrl)
    .then((res) => resolve(res.data))
    .catch(reject);
});

const getDealsDetailBy = (id) => new Promise((resolve, reject) => {
  const dealsUrl = `deals/${id}?api_token=${pipedriveToken}`;
  pipedriveApi.get(dealsUrl)
    .then((res) => resolve(res.data))
    .catch(reject);
});

const pipedriveService = {
  async createDeal({
    title,
    name,
    email,
    phone,
    value,
    add_time,
    user_id = 2966454,
    owner_id = 2966454,
    stage_id = 17,
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
      const { data: person } = personResponse;
      const dealResponse = await addDeal({
        title,
        value,
        add_time,
        person_id: person.id,
        user_id,
        stage_id,
      });
      return { personResponse, dealResponse };
    }
    const [person] = data;
    const dealResponse = await addDeal({
      title,
      value,
      add_time,
      person_id: person.id,
      user_id,
      stage_id,
    });

    return { emailResponse, dealResponse };
  },
};

module.exports = pipedriveService;
