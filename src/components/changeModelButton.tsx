import { getDownloadURL} from "../database/storageFunctions";
import { LoadModelByURL} from "../main";

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

changeModelButton.addEventListener('click', async () => {
  // Call your custom function here

  // fileName should be retrieved from UploadFile function
  const fileName = 'latest_model.gltf'
  const dataURL = getDownloadURL(fileName);
  console.log("dataURL: " + dataURL)
    
  // Update with new model
  LoadModelByURL(await dataURL)
});