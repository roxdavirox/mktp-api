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

async function getPersonByEmail(email) {
  return new Promise((resolve, reject) => {
    const personEmailUrl = `persons/find?term=${email}&search_by_email=1&api_token=${pipedriveToken}`;
    pipedriveApi.get(personEmailUrl)
      .then((res) => {
        const { data: persons } = res.data;
        resolve(persons || [null]);
      })
      .catch(reject);
  });
}

async function addPerson(person) {
  return new Promise((resolve, reject) => {
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
}

async function addActivity(data) {
  return new Promise((resolve, reject) => {
    const activityUrl = `activities?api_token=${pipedriveToken}`;
    const date = new Date(new Date().setMinutes(new Date().getUTCMinutes() + 15));
    const callDate = `${date.getUTCHours()}:${date.getMinutes()}`;
    const formData = new FormData();
    formData.append('subject', 'Ligar');
    formData.append('due_time', callDate);
    formData.append('user_id', data.user_id);
    formData.append('deal_id', data.deal_id);
    formData.append('person_id', data.person_id);
    pipedriveApi.post(activityUrl, formData, { headers: formData.getHeaders() })
      .then((res) => resolve(res.data))
      .catch(reject);
  });
}

async function addDeal(deal) {
  return new Promise((resolve, reject) => {
    const dealsUrl = `deals?api_token=${pipedriveToken}`;
    const formData = new FormData();
    formData.append('title', deal.title);
    formData.append('value', deal.value || 1);
    formData.append('user_id', deal.user_id);
    formData.append('stage_id', deal.stage_id);
    formData.append('person_id', deal.person_id);
    formData.append('status', 'open');
    pipedriveApi.post(
      dealsUrl,
      formData,
      { headers: formData.getHeaders() },
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

async function getDealsByPersonId(id) {
  return new Promise((resolve, reject) => {
    const dealsUrl = `persons/${id}/deals?start=0&status=all_not_deleted&api_token=${pipedriveToken}`;
    pipedriveApi.get(dealsUrl)
      .then(({ data }) => {
        const { data: personDeals } = data;
        resolve(personDeals || null);
      })
      .catch(reject);
  });
}

async function addNote(note) {
  return new Promise((resolve, reject) => {
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
}

async function hasDealCreatedToday(person) {
  const personDeals = await getDealsByPersonId(person.id);

  if (!personDeals) return { hasDealToday: false };

  const hasDealToday = personDeals.some((_deal) => isToday(_deal.add_time));
  const dealMadeToday = personDeals.find((_deal) => isToday(_deal.add_time));
  return { hasDealToday, dealMadeToday };
}

async function addNoteIntoDealMadeToday(deal, dealMadeToday, person) {
  return addNote({
    user_id: deal.user_id,
    deal_id: dealMadeToday.id,
    html: deal.html,
    person_id: person.id,
  });
}

async function addActivityDeal(data) {
  const dealResponse = await addDeal(data);
  const { data: deal } = dealResponse;
  const activityDeal = await addActivity({ ...data, deal_id: deal.id });
  const noteResponse = await addNote({
    user_id: data.user_id,
    deal_id: deal.id,
    html: data.html,
    person_id: data.person_id,
  });
  return { dealResponse, activityDeal, noteResponse };
}

async function addPersonActivityDeal(data) {
  const personResponse = await addPerson(data);
  const { data: person } = personResponse;

  const dealResponse = await addActivityDeal({ ...data, person_id: person.id });

  return { personResponse, dealResponse };
}

const pipedriveService = {
  async createDeal(deal) {
    const data = {
      user_id: 2966454,
      owner_id: 2966454,
      stage_id: 17,
      ...deal,
    };
    const { email } = deal;
    const [person] = await getPersonByEmail(email);
    if (!person) return addPersonActivityDeal(data);

    return hasDealCreatedToday(person)
      .then(({ hasDealToday, dealMadeToday }) => (
        hasDealToday
          ? addNoteIntoDealMadeToday(data, dealMadeToday, person)
          : addActivityDeal({ ...data, person_id: person.id })))
      .catch(console.error);
  },
};

module.exports = pipedriveService;
