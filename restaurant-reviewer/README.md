# Restaurant Reviewer

Demo: <https://restaurant-reviewer.vercel.app/>

## Start locally

1. The project needs the AWS CDK Toolkit and the Vercel CLI installed:

    - `yarn global add aws-cdk`
    - `yarn global add vercel`

2. Deploy the CDK stack by `cdk deploy`

3. It also needs an Auth0 app registered.

4. Create a `.env` file: `cp .env-example .env`, and fill it.

5. `yarn install`

6. `vercel dev`

## Stack

The app uses React, Nextjs, NextAuth, Auth0, AWS CDK, AWS DynamoDB, Vercel, TailwindCSS, react-query.
