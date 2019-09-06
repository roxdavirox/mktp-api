const uuid = require('uuid/v1');
const axios = require('axios');
const FormData = require('form-data');

function getRandomFileName(originalfilename) {
    const [_, ext] = originalfilename.split('.');
    console.log('extension:', ext);
    const newFileName = `${uuid()}.${ext}`;
    return newFileName;
}

async function uploadPsdToCustomerCanvas(psdFile) {
    const { originalname } = psdFile;
    const newFileName = getRandomFileName(originalname);
    const newPsdFile = { ...psdFile, originalname: newFileName };
    // console.log('psd File', newPsdFile);
    // fazer request para CC aqui
    const customerCanvasUrlApi = process.env.CUSTOMER_CANVAS_URL_API;
    const ccSecurityKey = process.env.CUSTOMER_CANVAS_SECURITY_KEY;
    const url = `${customerCanvasUrlApi}/ProductTemplates/designs/test`;
    const data = new FormData();
    console.log('enviando psd para url:', url);
    data.append('test', newPsdFile);
    const config = {
        headers: 
        { 
            'X-CustomersCanvasAPIKey': ccSecurityKey, 
            'Content-Type': 'multipart/form-data' 
    }};
    axios.post(url, data, config)
        .then(res => console.log('response axios cc:', res))
        .catch(err => console.log('erro no request do cc:', err));
}

module.exports = {
    uploadPsdToCustomerCanvas
};
