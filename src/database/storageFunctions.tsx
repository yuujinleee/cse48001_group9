import { bucketName } from "../main";
import { supabase } from "./supabaseClient"

// List all buckets in the storage
export async function storageListBuckets(){
    // Retrieve data in bucket
    const { data, error} = await supabase.storage.listBuckets()

    if (error) {
        console.error('Error listing buckets:', error);
      } else {
        console.log('List of buckets:', data);
      }
}

// List all files in bucket
export async function storageListBucketFiles(bucketName: string){
  const { data, error } = await supabase.storage.from(bucketName).list();
  if (error) {
    console.error('Error listing files:', error);
  } else {
    console.log('List of files:', data);
    return data
  }
}

// Upload file to bucket
export async function storageUploadBucket(bucketName: string, file: File){
    // const fileName = file.name
    const fileName = 'latest_model.gltf'
    const { data, error } = await supabase
    .storage
    .from(bucketName)
    .upload(`${fileName}`, file, {
        cacheControl: '3600',
        upsert: false
    })
    if (error) {
      console.error('Error for uploading to bucket:', error);
    } else {
      console.log('Upload file to bucket:', data);
    }

    return fileName
}

// Emtpy a bucket
export async function storageEmptyBucket(bucketName: string){
    const { data, error } = await supabase.storage.emptyBucket(bucketName)
    if (error) {
      console.error('Error emptying bucket', error);
    } else {
      console.log('Bucket has been emptied:', data);
    }
}

// Get url for file in bucket
export const getDownloadURL = async (fileName: string): Promise<string> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .download(fileName);
    if (error) {
      throw error;
    }
    const url = URL.createObjectURL(data);
    console.log("URL retrieved correctly: " + url);
    return url;
  } catch (error) {
    if (error instanceof Error){
      console.log("Error downloading file: ", error.message);
      throw error; // Re-throwing the error for handling in the calling code
    } 
    return ''
  }
};
