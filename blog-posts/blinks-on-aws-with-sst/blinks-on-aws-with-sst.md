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

Blockchain Links, or Blinks turn any [Solana Action](https://solana.com/solutions/actions) into a shareable, metadata-rich link. Blinks allow Action-aware clients such as browser extension wallets, bots, etc. to display additional capabilities for the user [(Blockchain Links and Solana Actions)](<https://solana.com/solutions/actions#what-are-solana-actions-and-blockchain-links-(blinks)>).

## What are Solana Actions?

![Solana Actions Execution and Lifecycle](https://solana-developer-content.vercel.app/assets/docs/action-execution-and-lifecycle.png)

<center>Solana Actions Execution and Lifecycle</center>

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

```ts
// ./code/tsconfig.json

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

> If want to check out the full code, you can find it[here](https://github.com/dkeithdj/sst-blinks)!

###

## Outro

Feel free to create a git repository and push your code to GitHub. You can also deploy your project to AWS by running `npx sst deploy`.

This blog does not say that deploying blinks on Next.js is heavy/bloated etc. The purpose of this blog lets you have another method of deploying Blinks.
