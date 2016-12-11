var website = require('s3-website')
var jsonfile = require('jsonfile')
var file = './config.json'

config = jsonfile.readFileSync(file)

website.s3site({
    domain: config.aws.bucket, // required, will be the bucket name
    region: config.aws.region, // optional, default: us-east-1
    index: config.aws.indexDoc, // optional index document, default: index.html
    error: config.aws.errorDoc, // optional error document, default: none
    routes: [{
        Condition: {
                KeyPrefixEquals: 'foo/'
        },
        Redirect: {
                HostName: config.aws.redirectHost
        }
    }]
}, function(err, website) {
    if (err) throw err
    console.log(website)
})