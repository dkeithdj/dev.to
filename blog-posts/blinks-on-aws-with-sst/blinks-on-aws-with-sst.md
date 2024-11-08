---
published: false
title: 'Blinks on AWS with SST'
# cover_image: https://raw.githubusercontent.com/YOUR-USERNAME/YOUR-REPO/master/blog-posts/NAME-OF-YOUR-BLOG-POST/assets/your-asset.png
description: 'Develop and deploy Blinks on AWS via SST.'
tags: aws, sst, solana, typescript
series:
canonical_url:
---

Most projects I know that revolves around _Blinks_ or [**Blockchain Links**](https://solana.com/solutions/actions) often use Next.js's [API Routes](https://nextjs.org/docs/app/api-reference/file-conventions/route) to develop and deploy _Blinks_. But did you know that apart from Next.js, you can actually build _Blinks_ on your favorite Node backend? In this blog, we'll use [**Serverless Stack (SST)**](https://sst.dev) to develop and deploy our Blinks on AWS!

---

# What are Blinks?

<figure>
  <img src="https://www.dialect.to/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fbefore-after.22f7b7f7.png&w=1200&q=75">
  <figcaption>Dialect Blinks</figcaption>
</figure>

Blockchain Links, or Blinks turn any [Solana Action](https://solana.com/solutions/actions) into a shareable, metadata-rich link. Blinks allow Action-aware clients such as browser extension wallets, bots, etc. to display additional capabilities for the user [(Blockchain Links and Solana Actions)](<https://solana.com/solutions/actions#what-are-solana-actions-and-blockchain-links-(blinks)>).

# What are Solana Actions?

<figure>
  <img src="https://solana-developer-content.vercel.app/assets/docs/action-execution-and-lifecycle.png">
  <figcaption>Solana Actions Execution and Lifecycle</figcaption>
</figure>

Solana Actions are **specification-compliant APIs** that return transactions on the Solana blockchain to be previewed, signed, and sent accross various contexts, including QR codes, buttons + widgets in mobile and desktop application and websites across the internet [(Blockchain Links and Solana Actions)](<https://solana.com/solutions/actions#what-are-solana-actions-and-blockchain-links-(blinks)>).

# What is SST?

Serverless Stack (SST) is a framework that makes it easy to build modern full-stack applications on your own infrastructure [(SST)](https://sst.dev).

---

# What we'll build

A simple Donate _Blink_ that allows users to donate to a specific wallet address on [_devnet_](https://solana.com/docs/core/clusters#devnet).

> If you want to know more about how Blinks work, you can check out the [Solana Actions and Blockchain Links](https://solana.com/solutions/actions) documentation.

# Prerequisites

1. [Node.js](https://nodejs.org/en/download/) installed on your machine.
2. AWS Account

# Project Setup

> If you want to check the reference code, you can check it out [here](https://github.com/dkeithdj/sst-blinks).

Let's create the project and install the dependencies.

```bash
mkdir sst-blinks && cd sst-blinks
npm init # answer the questions as you see fit

# dependencies
npm i typescript @solana/web3.js @solana/actions aws-sdk
# dev dependencies
npm i typescript @aws-sdk/types @types/aws-lambda --save-dev
```

Initialize typescript

```bash
npx tsc --init
```

Setup `tsconfig.json` by copying this configuration

<!-- embedme ./src/tsconfig.json -->

```ts
{
  "compilerOptions": {
    "types": ["node"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "isolatedModules": true,
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules"]
}

```

Initialize SST.

> As of time of writing, the SST version is `3.3.3`

```bash
npx sst init
# answer the default questions
# Template: js
# Using: aws
```

Don't forget to add a `.gitignore` file, we don't want to commit the `node_modules` and `.sst` folders

```bash
# contents of your .gitignore, feel free to add more

node_modules
.sst
```

After setting up everything, you have this project structure:

```bash
.
├── package-lock.json
├── package.json
├── README.md
├── sst-env.d.ts
├── sst.config.ts
└── tsconfig.json
```

Create a `src` directory and add the following files

```bash
...
├── src
│   ├── actions.ts
│   ├── donate.ts
│   └── util.ts
...
```

Now this is the final project structure

```bash
.
├── package-lock.json
├── package.json
├── README.md
├── src
│   ├── actions.ts
│   ├── donate.ts
│   └── util.ts
├── sst-env.d.ts
├── sst.config.ts
└── tsconfig.json
```

# Building the Donate Blink

Now that we've setup the project, let's build the API!

> If want to check out the full code, you can find it [here](https://github.com/dkeithdj/sst-blinks)!

## Configure AWS CLI

SST uses the AWS CLI to deploy your project. Make sure you have the AWS CLI installed and configured to your AWS account as SST will deploy the resources there you can read more [here](https://sst.dev/docs/aws-accounts#configure-aws-cli).

## Creating the GET & OPTIONS donate endpoint

Let's create the endpoint that will return the metadata of the blink. This will be a `GET` method.

<!-- embedme ./src/donate.get.ts#L1-L48 -->

```ts
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

import { ActionGetResponse, ACTIONS_CORS_HEADERS, createPostResponse, LinkedAction } from '@solana/actions';

import { APIGatewayProxyEvent, Handler } from 'aws-lambda';

const DONATION_DESTINATION_WALLET = 'EQb8LApPTtZFk3cY7WcaAmEvuL6s3Q1q8ozxcPcBJ5dc'; // Replace with your own wallet address
const DONATION_AMOUNT_SOL_OPTIONS = [1, 5, 10];
const DEFAULT_DONATION_AMOUNT_SOL = 1;

export const get: Handler = async (event: APIGatewayProxyEvent, context) => {
  const amountParameterName = 'amount';
  const actionMetadata: ActionGetResponse = {
    icon: 'https://pbs.twimg.com/profile_images/1472933274209107976/6u-LQfjG_400x400.jpg', // Replace with your own icon
    label: `${DEFAULT_DONATION_AMOUNT_SOL} SOL`,
    title: 'Donate',
    description: 'Donate to support the project',
    links: {
      actions: [
        ...DONATION_AMOUNT_SOL_OPTIONS.map(
          (amount): LinkedAction => ({
            type: 'post',
            label: `${amount} SOL`,
            href: `/api/donate/${amount}`,
          }),
        ),
        {
          type: 'post',
          href: `/api/donate/{${amountParameterName}}`,
          label: 'Donate',
          parameters: [
            {
              name: amountParameterName,
              label: 'Enter a custom SOL amount',
            },
          ],
        },
      ],
    },
  };
  return {
    statusCode: 200,
    headers: ACTIONS_CORS_HEADERS,
    body: JSON.stringify(actionMetadata),
  };
};

export const options = get;
```

### Code walkthrough

Under `actionMetadata`, it includes data on how a blink will be displayed. You can check its properties [here](https://solana.com/docs/advanced/actions#get-response-body).

Within `links.actions`, it specifies an array of actions that can be performed. In this case, we have a list of donation amounts (1, 5, 10) and a custom donation amount.

Every action has a corresponding `href` that points to the API endpoint that will handle the action.

The `get` function returns the metadata of the action as well as the CORS headers.

The `options` function is a simple copy of the `get` function. It is used to handle the preflight request for CORS.

### Configure the endpoint in `sst.config.ts`

<!-- embedme ./src/sst.config.get.ts#L3-L50 -->

```ts
export default $config({
  app(input) {
    return {
      name: 'sst-blinks',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      home: 'aws',
    };
  },
  async run() {
    const api = new sst.aws.ApiGatewayV2('Actions');

    api.route('GET /api/donate', {
      handler: 'src/donate.get',
    });
    api.route('OPTIONS /api/donate', {
      handler: 'src/donate.options',
    });
  },
});
```

Upon initializing `sst` in your project, you will have a minimal config of `sst`.

What we've added is in the `run` function where we create an API Gateway with the name `Actions` and add two routes:

| Method  |      url      |
| :-----: | :-----------: |
|   GET   | `/api/donate` |
| OPTIONS | `/api/donate` |

This means that the API will have two endpoints that will handle the `GET` and `OPTIONS` requests.

### Run the command

```bash
# Development mode
npx sst dev
```

SST may take a while to deploy the resources on your AWS Account, but once it is successful, it will output the URL of the API.

`https://<api-id>.execute-api.<region>.amazonaws.com/<api-endpoint>`

### Test the blink

You can check the blink by going to [dial.to](https://dial.to) and pasting the link of your API with this format:

`https://dial.to/developer?url=<your-absolute-https-url>&cluster=devnet`

Example:

`https://dial.to/developer?url=https://<api-id>.execute-api.<region>.amazonaws.com/api/donate&cluster=devnet`

![Donate Blink](./assets/solana-action.png 'Donate Blink')

> You will see a warning that the actions has not yet been registered. That is normal as **Dialect** requires **Blinks** to be registered first before using it on different websites for security purposes.

## Creating the POST donate endpoint

Now that we have the GET and OPTIONS endpoints, let's create the POST endpoint that will handle the donation.

<!-- embedme ./src/donate.ts#L51-L86 -->

```ts
export const post: Handler = async (event: APIGatewayProxyEvent, context) => {
  const amount = event.pathParameters?.amount ?? DEFAULT_DONATION_AMOUNT_SOL.toString();

  const body = await JSON.parse(event.body || '{}');
  let account;

  try {
    account = new PublicKey(body.account);
  } catch (error) {
    return {
      statusCode: 400,
      body: 'Invalid account',
      headers: ACTIONS_CORS_HEADERS,
    };
  }

  const parsedAmount = parseFloat(amount);
  const transaction = await prepareDonateTransaction(
    new PublicKey(account),
    new PublicKey(DONATION_DESTINATION_WALLET),
    parsedAmount * LAMPORTS_PER_SOL,
  );

  const response = await createPostResponse({
    fields: {
      type: 'transaction',
      transaction: transaction,
    },
  });

  return {
    statusCode: 200,
    body: JSON.stringify(response),
    headers: ACTIONS_CORS_HEADERS,
  };
};
```

### Code walkthrough

- We first get the `amount` from the URL path parameters. If it is not present, we use the default donation amount (1 SOL).
- We then parse the body of the request to get the `account` of the user.
- After that, we prepare the transaction using the `prepareDonateTransaction` function.
- The `prepareDonateTransaction` function is a custom function that prepares the transaction to send the donation to the wallet address. For further details, check the docs [here](https://solana.com/docs/core/transactions).

```ts
// ./src/util.ts

import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';
import { clusterApiUrl, Connection } from '@solana/web3.js';

export const connection = new Connection(process.env.SOLANA_RPC! || clusterApiUrl('devnet'));

async function prepareTransaction(instructions: TransactionInstruction[], payer: PublicKey) {
  const blockhash = await connection.getLatestBlockhash({ commitment: 'max' }).then(res => res.blockhash);
  const messageV0 = new TransactionMessage({
    payerKey: payer,
    recentBlockhash: blockhash,
    instructions,
  }).compileToV0Message();
  return new VersionedTransaction(messageV0);
}

export async function prepareDonateTransaction(
  sender: PublicKey,
  recipient: PublicKey,
  lamports: number,
): Promise<VersionedTransaction> {
  const instructions = [
    SystemProgram.transfer({
      fromPubkey: sender,
      toPubkey: new PublicKey(recipient),
      lamports: lamports,
    }),
  ];
  return prepareTransaction(instructions, sender);
}
```

- We then create a response using the `createPostResponse` function.
- Finally, we return the response with the CORS headers.

### Configure the POST endpoint in `sst.config.ts`

<!-- embedme ./src/sst.config.post.ts#L11-L21 -->

```ts
async run() {
  const api = new sst.aws.ApiGatewayV2('Actions');

  api.route('GET /api/donate', {
    handler: 'src/donate.get',
  });
  api.route('OPTIONS /api/donate', {
    handler: 'src/donate.options',
  });
  api.route('POST /api/donate/{amount}', { handler: 'src/donate.post' });
},
```

What we just did is adding a new API route on `api/donate/{amount}`

So the API now has three endpoints:

| Method  |          url           |
| :-----: | :--------------------: |
|   GET   |     `/api/donate`      |
| OPTIONS |     `/api/donate`      |
|  POST   | `/api/donate/{amount}` |

### Run the command

```bash
# Development mode
npx sst dev
```

### Test the blink again

You are now able to try and donate to the wallet address you specified.

`https://dial.to/developer?url=https://<api-id>.execute-api.<region>.amazonaws.com/api/donate&cluster=devnet`

## Create the `actions.json` endpoint

The purpose of the `actions.json` file allows an application to instruct clients on what website URLs support Solana Actions and provide a mapping that can be used to perform GET requests to an Actions API server.

<!-- embedme ./src/actions.ts -->

```ts
import { ACTIONS_CORS_HEADERS } from '@solana/actions';
import { APIGatewayProxyEvent, Handler } from 'aws-lambda';

export const get: Handler = async (event: APIGatewayProxyEvent, context) => {
  return {
    statusCode: 200,
    headers: ACTIONS_CORS_HEADERS,
    body: JSON.stringify({
      rules: [{ pathPattern: '/donate', apiPath: '/api/donate' }],
    }),
  };
};

export const options = get;
```

`actions.json` endpoint is the same as the `donate` endpoint. However in `actions.json` it returns a JSON object that specifies the rules on where to find the _actions_. You can read more about `actions.json` [here](https://solana.com/docs/advanced/actions#actionsjson).

### Configure `actions.json` endpoint in `sst.config.ts`

<!-- embedme ./src/sst.config.ts#L11-L24 -->

```ts
async run() {
  const api = new sst.aws.ApiGatewayV2('Actions');

  api.route('GET /api/donate', {
    handler: 'src/donate.get',
  });
  api.route('OPTIONS /api/donate', {
    handler: 'src/donate.options',
  });
  api.route('POST /api/donate/{amount}', { handler: 'src/donate.post' });

  api.route('GET /actions.json', { handler: 'src/actions.get' });
  api.route('OPTIONS /actions.json', { handler: 'src/actions.options' });
},
```

Finally, our API now has five endpoints:

| Method  |          url           |
| :-----: | :--------------------: |
|   GET   |     `/api/donate`      |
| OPTIONS |     `/api/donate`      |
|  POST   | `/api/donate/{amount}` |
|   GET   |    `/actions.json`     |
| OPTIONS |    `/actions.json`     |

# Deploy to Production

Deploying on production with SST is easy. Just run the following command:

```bash
npx sst deploy --stage production

```

It will output a new URL that you can use to test your blink.

# Demo

Donating 1 SOL

![Demo 1 SOL](./assets/demo-1sol.gif 'Demo 1 SOL')

Donating a custom amount

![Demo custom](./assets/demo-custom.gif 'Demo custom')

# Cleanup

Removing the resources is as easy as deploying them. Just run the following command:

```bash
npx sst remove # to remove the resources in the development stage
npx sst remove --stage production # to remove the resources in the production stage
```

# Conclusion

And that's it! You've successfully deployed your Blinks on AWS using SST. You can now create more Blinks and deploy them on AWS with ease!

Feel free to create a git repository and push your code to GitHub!

If you have any questions or found any issues, feel free to comment below.
