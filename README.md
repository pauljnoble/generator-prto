# Static site starter #

Boilerplate with Webpack, Webpack Dev Server, hot reloading, Stylus and optional deploy to S3 static site hosting (requires AWS account and credentials).

### Developing ###
1. Run `npm i` or `yarn install`.
2. Run `gulp` and open your browser to `localhost:4000` to start developing.

### Deploying to S3 (optional) ###

1. Ensure you have a valid AWS configuration file at `~/.aws/credentials` [(More info)](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html#cli-config-files)
2. Update the `config.json` file.
3. Run `npm run deploy`.