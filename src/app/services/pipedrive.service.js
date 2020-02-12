/* eslint-disable no-return-await */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable no-console */
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
    .then((res) => {
      const { data: persons } = res.data;
      resolve(persons || [null]);
    })
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
  const dealsUrl = `persons/${id}/deals?start=0&status=all_not_deleted&api_token=${pipedriveToken}`;
  pipedriveApi.get(dealsUrl)
    .then((res) => resolve(res.data))
    .catch(reject);
});

const addNote = (note) => new Promise((resolve, reject) => {
  const notesUrl = `notes?api_token=${pipedriveToken}`;
  const formData = new FormData();
  formData.append('user_id', note.user_id);
  formData.append('person_id', note.person_id);
  formData.append('deal_id', note.deal_id);
  formData.append('content', note.html);
  pipedriveApi.post(notesUrl, formData, { headers: formData.getHeaders() })
    .then((res) => resolve(res.data))
    .catch(reject);
});

const hasDealCreatedToday = async (person) => {
  const personDeals = await getDealsByPersonId(person.id);

  const { data: deals } = personDeals;
  if (!deals) return { hasDealToday: false };

  const hasDealToday = personDeals.some((_deal) => isToday(_deal.add_time));
  const dealMadeToday = personDeals.find((_deal) => isToday(_deal.add_time));
  return { hasDealToday, dealMadeToday };
};

const addNoteIntoDealMadeToday = async (deal, dealMadeToday, person) => addNote({
  user_id: deal.user_id,
  deal_id: dealMadeToday.id,
  html: deal.html,
  person_id: person.id,
});

const addPersonWithDeal = async (deal) => {
  const personResponse = await addPerson(deal);
  const { data: person } = personResponse;

  const dealResponse = await addDeal({
    ...deal,
    person_id: person.id,
  });
  return { personResponse, dealResponse };
};

const pipedriveService = {
  async createDeal(deal) {
    const data = {
      user_id: 2966454,
      owner_id: 2966454,
      stage_id: 17,
      title: 'Orçamento online',
      ...deal,
    };
    const { email } = deal;
    const [person] = await getPersonByEmail(email);
    if (!person) return addPersonWithDeal(data);

    return hasDealCreatedToday(person)
      .then(({ hasDealToday, dealMadeToday }) => (hasDealToday
        ? addNoteIntoDealMadeToday(data, dealMadeToday, person)
        : addDeal({ ...deal, person_id: person.id })))
      .catch(console.error);
  },
};

module.exports = pipedriveService;
