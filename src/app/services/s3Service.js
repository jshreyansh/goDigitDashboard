const aws = require('aws-sdk')
const path = require('path')
const config = require('../../config')

// config AWS
aws.config.update({
    accessKeyId: config.AWS_KEYID,
    secretAccessKey: config.AWS_SECRET,
    region: config.AWS_REGION
});

// Create S3 service object
let s3 = new aws.S3({apiVersion: '2006-03-01'});

exports.uploadToS3 = async (file) => {
    var uploadParams = {
        "ACL": "public-read",
        "ContentType": file.mimetype,
        Bucket: config.AWS_BUCKET,
        Key: file.folder + path.basename(file.originalname, path.extname(file.originalname)) + '-' + Date.now() + path.extname(file.originalname),
        Body: file.buffer
    };

    return new Promise(function(resolve, reject) {
        s3.upload(uploadParams, function(err, data) {
            if (err !== null) {
                console.log("S3 upload error: ",err);
                reject(err);
            }
            else resolve(data);
        });
    })
}

exports.listObjects = async (req) => {
    var params = {
        Bucket: "fangame-stg",
        Prefix: 'admin/files/',
        MaxKeys: 100
    };
    return new Promise(function(resolve, reject) {
        s3.listObjects(params, function(err, data) {
            if (err !== null) {
                console.log(err);
                return(reject(err));
            }
            else return(resolve(data));
        });
    })
}