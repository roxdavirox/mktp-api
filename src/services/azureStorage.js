/* eslint-disable no-return-await */
/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
const {
  Aborter,
  BlockBlobURL,
  ContainerURL,
  ServiceURL,
  SharedKeyCredential,
  StorageURL,
  uploadStreamToBlockBlob,
} = require('@azure/storage-blob');

const uuid = require('uuid/v1');

const streamifier = require('streamifier');

const STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const ACCOUNT_ACCESS_KEY = process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY;
console.log('[mktp] iniciando variaveis de ambiente');

const ONE_MEGABYTE = 1024 * 1024;
const FOUR_MEGABYTES = 4 * ONE_MEGABYTE;
const ONE_MINUTE = 60 * 1000;

function getRandomFileName(originalfilename) {
  const [, ext] = originalfilename.split('.');
  console.log('extension:', ext);
  const newFileName = `${uuid()}.${ext}`;
  return newFileName;
}

async function productImageUpload(imageFile) {
  return await uploadImage(imageFile, 'fotos-produtos');
}

async function templatePreviewUpload(imageFile) {
  return await uploadImage(imageFile, 'preview-templates');
}

async function uploadImage(imageFile, containerName) {
  const { originalname, buffer } = imageFile;

  // const containerName = "fotos-produtos";
  console.log('[mktp] nome do container:', containerName);
  console.log('[mktp] autenticando azure credentials');
  console.log('[mktp] NAME:', STORAGE_ACCOUNT_NAME, ' KEY:', ACCOUNT_ACCESS_KEY);
  const credentials = new SharedKeyCredential(STORAGE_ACCOUNT_NAME, ACCOUNT_ACCESS_KEY);
  console.log('[mktp] autenticado com sucesso...');
  const pipeline = StorageURL.newPipeline(credentials);
  console.log('[mktp] criando pipeline do azure blobs');
  const serviceURL = new ServiceURL(`https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`, pipeline);
  console.log('[mktp] iniciando serviços azure blob');
  const aborter = Aborter.timeout(30 * ONE_MINUTE);

  const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);

  const fileName = getRandomFileName(originalname);
  console.log('[mktp] fileName:', fileName);
  const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, fileName);

  const stream = streamifier.createReadStream(buffer);
  console.log('[mktp] criando stream');
  const uploadOptions = {
    bufferSize: FOUR_MEGABYTES,
    maxBuffers: 5,
  };
  console.log('[mktp] enviando arquivo');
  const response = await uploadStreamToBlockBlob(
    aborter,
    stream,
    blockBlobURL,
    uploadOptions.bufferSize,
    uploadOptions.maxBuffers,
  );
  console.log('[mktp] arquivo enviado');
  const { url } = serviceURL;
  const imageUrl = `${url}${containerName}/${fileName}`;
  console.log('[mktp] url da imagem:', imageUrl);
  return {
    imageUrl,
    ...response,
  };
}

module.exports = {
  productImageUpload,
  templatePreviewUpload,
  uploadImage,
};
