const AWS = require('aws-sdk');
exports.uploadToS3 = async(data,filename)=>{
    return new Promise((resolve,reject)=>{
      
        const bucket_name = process.env.bucket_name;
        const IAM_user_key = process.env.IAM_user_key;
        const IAM_user_secret = process.env.IAM_user_secret;

        let s3bucket = new AWS.S3({
           accessKeyId :IAM_user_key,
           secretAccessKey:IAM_user_secret,
        })
           var params = {
               Bucket:bucket_name,
               Key:filename,
               Body:data,
               ACL:'public-read'
           }

           s3bucket.upload(params,(err,s3response)=>{
               if(err){
                   reject(err);
               }
               else {
                   resolve (s3response);
               }
            })
    })
 }