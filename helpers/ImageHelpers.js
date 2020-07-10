const prepareBlob = async (imageUri) => {
  const blob = await new Promise((resolve, reject) => {
    // new request
    const xml = XMLHttpRequest();

    // On success, resolve it
    xml.onload = function () {
      resolve(xml.response);
    };

    // On error, throw error
    xml.onerror = function (error) {
      console.log(error);
      reject(new TypeError("Image Upload Failed"));
    };

    // set the response type
    xml.responseType = "blob";
    // get the blob
    xml.open("GET", imageUri, true);
    // send the blob
    xml.send();
  });
  console.log(blob);
  return blob;
};

export default prepareBlob;
