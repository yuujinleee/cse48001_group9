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

// Retrieve bucket details
export async function storageRetrieveBucket(bucketName: string){
    const { data, error } = await supabase.storage.getBucket(bucketName);
    if (error) {
      console.error('Error for retrieving bucket details:', error);
    } else {
      console.log('Bucket details:', data);
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

// Emtpy a bucket
export async function storageEmptyBucket(bucketName: string){
    const { data, error } = await supabase.storage.emptyBucket(bucketName)
    if (error) {
      console.error('Error emptying bucket', error);
    } else {
      console.log('Bucket has been emptied:', data);
    }
}

// Download a file from the bucket
export async function storageDownloadBucketFiles(bucketName: string, path: string) {
    const { data, error} = await supabase.storage.from(bucketName).download(path)
    if (error) {
      console.error('Error downloading file', error);
      return error;
    } else {
      console.log('File has been downloaded:', data);
      return data;
    }
}

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
