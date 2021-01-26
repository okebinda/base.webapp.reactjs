# CircleCI Integration

You can easily use CircleCI (https://circleci.com/) to run unit tests and build release packages as part of a CI/CD pipeline.

## Configuration

Configuration files for CircleCI can be found in `.circleci/`.

Add your git repository as a project to CircleCI.

Go to "Project Settings" > "Environment Variables" and add values for the following:

* `AWS_ACCESS_KEY_ID`
* `AWS_SECRET_ACCESS_KEY`
* `AWS_REGION`
* `PROJECT_NAME` (a good name would be the production domain, e,g.: 'app.domain.com')
* `AWS_S3_PACKAGE_BUCKET` (this will be the name of the S3 bucket to upload release packages to)

## Workflows

The default configuration has three jobs. The first will install the NodeJS dependencies and run the project's unit tests. If that job passes and the Git commit was on the 'dev' branch, the second job will create a dev build and upload to the S3 bucket. Otherwise, if the first job passes and a 'release' tag is committed then the third job will create qa and production builds and upload those to the S3 bucket.
