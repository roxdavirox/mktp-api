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
  
    const customerCanvasUrlApi = process.env.CUSTOMER_CANVAS_URL_API;
    const ccSecurityKey = process.env.CUSTOMER_CANVAS_SECURITY_KEY;
    const url = `${customerCanvasUrlApi}/ProductTemplates/designs/test`;
    const fd = new FormData();
    console.log('enviando psd para url:', url);
    const { buffer } = psdFile;
    const newBuffer = new Buffer.from(buffer);
    fd.append('file', newBuffer, { filename: newFileName, contentType: 'application/octet-stream' });
    const options = {
        headers: { 
            'X-CustomersCanvasAPIKey': ccSecurityKey, 
            'Content-Type': 'multipart/form-data',
            'Content-Type': fd.getHeaders()['content-type']
        }
    };
    axios.post(url, fd, options)
        .then(res => console.log('response axios cc:', res))
        .catch(err => console.log('erro no request do cc:', err));
}

module.exports = {
    uploadPsdToCustomerCanvas
};
