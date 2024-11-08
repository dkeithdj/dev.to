---
published: false
title: 'Blinks on AWS with SST'
# cover_image: https://raw.githubusercontent.com/YOUR-USERNAME/YOUR-REPO/master/blog-posts/NAME-OF-YOUR-BLOG-POST/assets/your-asset.png
description: 'Develop and deploy Blinks on AWS via SST.'
tags: aws, sst, solana, typescript
series:
canonical_url:
---

Most projects I know that revolves around _Blinks_ or [**Blockchain Links**](https://solana.com/solutions/actions) often use Next.js's [API Routes](https://nextjs.org/docs/app/api-reference/file-conventions/route) to develop and deploy _Blinks_. Apart from Next.js, you can build _Blinks_ on your favorite Node backend! But in this blog, we'll use [**Serverless Stack (SST)**](https://sst.dev) to develop and deploy our Blinks on AWS!

---

## What are Blinks?

<figure>
  <img src="https://www.dialect.to/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fbefore-after.22f7b7f7.png&w=1200&q=75">
  <figcaption>Dialect Blinks</figcaption>
</figure>

Blockchain Links, or Blinks turn any [Solana Action](https://solana.com/solutions/actions) into a shareable, metadata-rich link. Blinks allow Action-aware clients such as browser extension wallets, bots, etc. to display additional capabilities for the user [(Blockchain Links and Solana Actions)](<https://solana.com/solutions/actions#what-are-solana-actions-and-blockchain-links-(blinks)>).

## What are Solana Actions?

<figure>
  <img src="https://solana-developer-content.vercel.app/assets/docs/action-execution-and-lifecycle.png">
  <figcaption>Solana Actions Execution and Lifecycle</figcaption>
</figure>

Solana Actions are **specification-compliant APIs** that return transactions on the Solana blockchain to be previewed, signed, and sent accross various contexts, including QR codes, buttons + widgets in mobile and desktop application and websites across the internet [(Blockchain Links and Solana Actions)](<https://solana.com/solutions/actions#what-are-solana-actions-and-blockchain-links-(blinks)>).

## What is SST?

Serverless Stack (SST) is a framework that makes it easy to build modern full-stack applications on your own infrastructure [(SST)](https://sst.dev).

---

## What we'll build

A simple Donate _Blink_ that allows users to donate to a specific wallet address on [_devnet_](https://solana.com/docs/core/clusters#devnet).

> If you want to know more about how Blinks work, you can check out the [Solana Actions and Blockchain Links](https://solana.com/solutions/actions) documentation.

## Prerequisites

1. [Node.js](https://nodejs.org/en/download/) installed on your machine.
2. AWS Account

## Project Setup

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

## Building the Donate Blink

Now that we've setup the project, let's build the API!

> If want to check out the full code, you can find it [here](https://github.com/dkeithdj/sst-blinks)!

### Configure AWS CLI

SST uses the AWS CLI to deploy your project. Make sure you have the AWS CLI installed and configured to your AWS account as SST will deploy the resources there you can read more [here](https://sst.dev/docs/aws-accounts#configure-aws-cli).

### Create the GET API

<!-- embedme ./src/donate.ts#L12-L50 -->

```ts
export const get: Handler = async (event: APIGatewayProxyEvent, context) => {
  const amountParameterName = 'amount';
  const actionMetadata: ActionGetResponse = {
    icon: 'https://avatars.githubusercontent.com/u/42316655?v=4',
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
  const response = {
    statusCode: 200,
    headers: ACTIONS_CORS_HEADERS,
    body: JSON.stringify(actionMetadata),
  };
  return response;
};

export const options = get;
```

Let's explain the code:

`actionMetadata` is how a blink will be be displayed. You can check its properties [here](https://solana.com/docs/advanced/actions#get-response-body).

<!-- Image here -->

You can take a look at `links.actions` where it specifies the URL for the POST API.

#### Configure the API in `sst.config.ts`

<!-- embedme ./src/sst.config.ts#L3-L25 -->

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
    api.route('POST /api/donate/{amount}', { handler: 'src/donate.post' });

    api.route('GET /actions.json', { handler: 'src/actions.get' });
    api.route('OPTIONS /actions.json', { handler: 'src/actions.options' });
  },
});
```

#### Run the command

```bash
npx sst dev
```

Deploying may take a while but after it is successful, you can now access the URL with the format:

`https://<api-id>.execute-api.<region>.amazonaws.com/<api-endpoint>`

#### Test the blink

You can check the blink by going to [dial.to](https://dial.to) and pasting the link of your API with this format:

`https://dial.to/?action=solana-action:<your-absolute-https-url>`

Example:

`https://dial.to/?action=solana-action:https://<api-id>.execute-api.<region>.amazonaws.com/api/donate`

### Create the POST API

<!-- embedme ./src/donate.ts#L52-L87 -->

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

## Outro

Feel free to create a git repository and push your code to GitHub. You can also deploy your project to AWS by running `npx sst deploy`.

This blog does not say that deploying blinks on Next.js is heavy/bloated etc. The purpose of this blog lets you have another method of deploying Blinks.
