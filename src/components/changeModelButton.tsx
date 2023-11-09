import { storageDownloadBucketFiles } from "../database/storageFunctions";
import { bucketName } from "../main";
import { LoadModel } from "../main";

export const changeModelButton = document.createElement('button');
changeModelButton.textContent = 'Update model'; // Set the button text
changeModelButton.style.position = 'absolute';
changeModelButton.style.width = '100px';
changeModelButton.style.top = '90px'; // Adjust the top position as needed
changeModelButton.style.right = '10px'; // Adjust the right position as needed

changeModelButton.style.backgroundColor = 'blue';
changeModelButton.style.color = 'white';
changeModelButton.style.fontSize = '16px';
changeModelButton.style.borderRadius = '5px';

// Append the button to the body or another container element
document.body.appendChild(changeModelButton);

changeModelButton.addEventListener('click', () => {
    // Call your custom function here
    
    // CHANGE PATH!
    const path = 'UploadedFile';
    const data = storageDownloadBucketFiles(bucketName, path);
    console.log("change model button works for file: " + data)
    
    // Update with new model
    LoadModel('src/assets/02_Cactus.gltf')
});