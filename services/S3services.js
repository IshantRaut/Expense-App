const AWS = require('aws-sdk');
exports.uploadToS3 = async(data,filename)=>{
    return new Promise((resolve,reject)=>{
        const bucket_name='expensetracker7351';
        const IAM_user_key ='AKIATCKATXJEYTEQNNSK';
        const IAM_user_secret='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';

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