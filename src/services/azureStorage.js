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

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const ACCOUNT_ACCESS_KEY = process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY;

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
  const credentials = new SharedKeyCredential(STORAGE_ACCOUNT_NAME, ACCOUNT_ACCESS_KEY);
  const pipeline = StorageURL.newPipeline(credentials);
  const serviceURL =new ServiceURL(`https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`, pipeline);

  const aborter = Aborter.timeout(30 * ONE_MINUTE);
  
  const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
  
  const fileName = getRandomFileName(originalname);
  const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, fileName);

  const stream = streamifier.createReadStream(buffer);

  const uploadOptions = {
    bufferSize: FOUR_MEGABYTES,
    maxBuffers: 5,
  };

  const response = await uploadStreamToBlockBlob(
    aborter, 
    stream, 
    blockBlobURL, 
    uploadOptions.bufferSize, 
    uploadOptions.maxBuffers);

  const { url } = serviceURL;
  const imageUrl = `${url}${containerName}/${fileName}`;
  
  return {
    imageUrl,
    ...response
  }
}

module.exports = {
  uploadImage
};
