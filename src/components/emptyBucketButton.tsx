import { storageEmptyBucket } from "../database/storageFunctions";
import { bucketName } from "../main";

export const emptyBucketButton = document.createElement('button');
emptyBucketButton.textContent = 'Empty bucket'; // Set the button text
emptyBucketButton.style.position = 'absolute';
emptyBucketButton.style.width = '100px';
emptyBucketButton.style.top = '30px'; // Adjust the top position as needed
emptyBucketButton.style.right = '10px'; // Adjust the right position as needed

emptyBucketButton.style.backgroundColor = 'blue';
emptyBucketButton.style.color = 'white';
emptyBucketButton.style.fontSize = '16px';
emptyBucketButton.style.borderRadius = '5px';

// Append the button to the body or another container element
document.body.appendChild(emptyBucketButton);

emptyBucketButton.addEventListener('click', () => {
  // Call your custom function here
  storageEmptyBucket(bucketName);
});