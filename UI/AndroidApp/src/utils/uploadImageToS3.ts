import { RNS3 } from 'react-native-aws3';
import { v4 as uuidv4 } from 'uuid';
import Config from 'react-native-config'; // Import Config from react-native-config
console.log('AWS Bucket:', Config.S3_BUCKET); // Check if the bucket is being read correctly


export const uploadImageToS3 = async (fileUri: string) => {
    const fileExtension = fileUri.split('.').pop();
    const file = {
        uri: fileUri,
        name: `${uuidv4()}.${fileExtension}`,
        type: `image/${fileExtension}`,
    };

    const options = {
        keyPrefix: 'logos/', // Directory within S3 bucket
        // bucket: Config.S3_BUCKET, // This should refer to your S3 bucket name from the .env file
        bucket: 'ims_invoice_bucket', // Manually set the bucket name for testing
        region: Config.AWS_REGION, // AWS region from the .env file
        accessKey: Config.AWS_ACCESS_KEY_ID, // AWS access key from the .env file
        secretKey: Config.AWS_SECRET_ACCESS_KEY, // AWS secret key from the .env file
        successActionStatus: 201,
    };

    console.log('AWS Bucket:', Config.S3_BUCKET); // Log the bucket to ensure it's being read correctly

    return new Promise((resolve, reject) => {
        RNS3.put(file, options)
            .then((response: any) => {
                if (response.status !== 201) {
                    reject(new Error('Failed to upload image to S3'));
                }
                resolve(response.body.postResponse.location); // S3 URL
            })
            .catch((error: any) => reject(error));
    });
};