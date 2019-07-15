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

const fs = require("fs");
const path = require("path");
const streamifier = require('streamifier');

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const ACCOUNT_ACCESS_KEY = process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY;

const ONE_MEGABYTE = 1024 * 1024;
const FOUR_MEGABYTES = 4 * ONE_MEGABYTE;
const ONE_MINUTE = 60 * 1000;

async function showContainerNames(aborter, serviceURL) {

  let response;
  let marker;

  do {
      response = await serviceURL.listContainersSegment(aborter, marker);
      marker = response.marker;
      for(let container of response.containerItems) {
          console.log(` - ${ container.name }`);
      }
  } while (marker);
}

async function uploadLocalFile(aborter, containerURL, filePath) {

  filePath = path.resolve(filePath);

  const fileName = path.basename(filePath);
  const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, fileName);

  return await uploadFileToBlockBlob(aborter, filePath, blockBlobURL);
}

async function uploadStream(aborter, containerURL, filePath) {

  filePath = path.resolve(filePath);

  const fileName = path.basename(filePath).replace('.md', '-stream.md');
  const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, fileName);

  const stream = fs.createReadStream(filePath, {
    highWaterMark: FOUR_MEGABYTES,
  });

  const uploadOptions = {
      bufferSize: FOUR_MEGABYTES,
      maxBuffers: 5,
  };

  return await uploadStreamToBlockBlob(
                  aborter, 
                  stream, 
                  blockBlobURL, 
                  uploadOptions.bufferSize, 
                  uploadOptions.maxBuffers);
}

async function showBlobNames(aborter, containerURL) {

  let response;
  let marker;

  do {
      response = await containerURL.listBlobFlatSegment(aborter);
      marker = response.marker;
      for(let blob of response.segment.blobItems) {
          console.log(` - ${ blob.name }`);
      }
  } while (marker);
}

async function uploadImage(imageFile) {
  const { originalname: fileName, buffer } = imageFile;

  const containerName = "fotos-produtos";
  const credentials = new SharedKeyCredential(STORAGE_ACCOUNT_NAME, ACCOUNT_ACCESS_KEY);
  const pipeline = StorageURL.newPipeline(credentials);
  const serviceURL =new ServiceURL(`https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`, pipeline);

  const aborter = Aborter.timeout(30 * ONE_MINUTE);
  
  const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
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
