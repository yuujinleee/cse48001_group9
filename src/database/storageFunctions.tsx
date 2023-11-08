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
    
    const { data, error } = await supabase
    .storage
    .from(bucketName)
    .upload('UploadedFile', file, {
        cacheControl: '3600',
        upsert: false
    })

    if (error) {
      console.error('Error for uploading to bucket:', error);
    } else {
      console.log('Upload file to bucket:', data);
    }
}


// List all files in bucket
export async function storageListBucketFiles(bucketName: string){
      const { data, error } = await supabase.storage.from(bucketName).list();
      if (error) {
        console.error('Error listing files:', error);
      } else {
        console.log('List of files:', data);
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
export async function storageDownloadBucketFiles(bucketName: string) {
    const { data, error} = await supabase.storage.from(bucketName).download('folder/diagram.png')
    console.log(error||data)
}