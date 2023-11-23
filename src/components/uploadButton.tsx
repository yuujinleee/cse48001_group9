import { getDownloadURL, storageEmptyBucket, storageUploadBucket } from "../database/storageFunctions";
import { LoadModelByURL, bucketName } from "../main";


// Create a button element for uploading files
export const uploadButton = document.createElement('input');
uploadButton.setAttribute('type', 'file');
uploadButton.setAttribute('id', 'fileInput'); // Make sure the ID matches your existing file input
uploadButton.style.position = 'absolute';
uploadButton.style.width = '100px';
uploadButton.style.top = '5px'; // Adjust the top position as needed
uploadButton.style.right = '10px'; // Adjust the right position as needed

uploadButton.style.backgroundColor = 'blue';
uploadButton.style.color = 'white';
uploadButton.style.fontSize = '16px';
uploadButton.style.borderRadius = '5px';

// Append the button to the body or another container element
document.body.appendChild(uploadButton);

uploadButton.addEventListener('change', async (event) => {
  const selectedFile = (event.target as HTMLInputElement)?.files?.[0]; // Get the selected file

  if (selectedFile) {
    // Call the storageUploadBucket function with the selected file
    try {

      // Empty bucket
      await storageEmptyBucket(bucketName);

      // Upload model to bucket
      const fileName = selectedFile.name
      const result = await storageUploadBucket(bucketName, selectedFile, fileName);
      console.log('File uploaded successfully:', result);

      //Download model URL
      const dataURL = await getDownloadURL(fileName);
      console.log("dataURL: " + dataURL)

      // Update with new model
      LoadModelByURL(dataURL)
      
    } catch (error) {
      console.error('Error uploading the file:', error);
    }
  }
});