import AWS from "aws-sdk";

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
})

const s3 = new AWS.S3();
export const getSignedUrl = (key:any) => {
    const params = {
      Bucket: 'cloud-backup-project',
      Key: key,
      Expires: 60 * 60, // URL expiry time (1 hour)
    };
    
    return s3.getSignedUrl('getObject', params);
}


export default s3;

