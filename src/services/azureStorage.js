const {
  Aborter,
  BlockBlobURL,
  ContainerURL,
  ServiceURL,
  SharedKeyCredential,
  StorageURL,
  uploadStreamToBlockBlob,
  uploadFileToBlockBlob
} = require('@azure/storage-blob');

const uuid = require('uuid/v1');

const streamifier = require('streamifier');

require("dotenv").config();

const STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const ACCOUNT_ACCESS_KEY = process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY;
console.log('iniciando variaveis de ambiente');

const ONE_MEGABYTE = 1024 * 1024;
const FOUR_MEGABYTES = 4 * ONE_MEGABYTE;
const ONE_MINUTE = 60 * 1000;

function getRandomFileName(originalfilename) {
  const [_, ext] = originalfilename.split('.');
  console.log('extension:', ext);
  const newFileName = `${uuid()}.${ext}`;
  return newFileName;
}

async function uploadImage(imageFile) {
  const { originalname, buffer } = imageFile;

  const containerName = "fotos-produtos";
  console.log('nome do container:', containerName);
  console.log('autenticando azure credentials');
  console.log('NAME:', STORAGE_ACCOUNT_NAME, ' KEY:', ACCOUNT_ACCESS_KEY);
  const credentials = new SharedKeyCredential(STORAGE_ACCOUNT_NAME, ACCOUNT_ACCESS_KEY);
  console.log('autenticado com sucesso...');
  const pipeline = StorageURL.newPipeline(credentials);
  console.log('criando pipeline do azure blobs');
  const serviceURL = new ServiceURL(`https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`, pipeline);
  console.log('iniciando serviços azure blob')
  const aborter = Aborter.timeout(30 * ONE_MINUTE);
  
  const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
  
  const fileName = getRandomFileName(originalname);
  console.log('fileName:', fileName);
  const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, fileName);

  const stream = streamifier.createReadStream(buffer);
  console.log('criando stream');
  const uploadOptions = {
    bufferSize: FOUR_MEGABYTES,
    maxBuffers: 5,
  };
  console.log('enviando arquivo');
  const response = await uploadStreamToBlockBlob(
    aborter, 
    stream, 
    blockBlobURL, 
    uploadOptions.bufferSize, 
    uploadOptions.maxBuffers);
  console.log('arquivo enviado')
  const { url } = serviceURL;
  const imageUrl = `${url}${containerName}/${fileName}`;
  console.log('url da imagem:', imageUrl);
  return {
    imageUrl,
    ...response
  }
}

module.exports = {
  uploadImage
};
