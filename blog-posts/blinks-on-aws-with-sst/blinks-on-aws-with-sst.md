---
published: false
title: 'Blinks on AWS with SST'
# cover_image: https://raw.githubusercontent.com/YOUR-USERNAME/YOUR-REPO/master/blog-posts/NAME-OF-YOUR-BLOG-POST/assets/your-asset.png
description: 'Develop and deploy Blinks on AWS via SST.'
tags: aws, sst, solana, typescript
series:
canonical_url:
---

Most projects I know that revolves around _Blinks_ or [**Blockchain Links**](https://solana.com/solutions/actions) often use Next.js's [API Routes](https://nextjs.org/docs/app/api-reference/file-conventions/route) to develop and deploy _Blinks_.

## What are Blinks?

> Blockchain Links, or Blinks turn any [Solana Action](https://solana.com/solutions/actions) into a shareable, metadata-rich link. Blinks allow Action-aware clients such as browser extension wallets, bots, etc. to display additional capabilities for the user [(Blockchain Links and Solana Actions)](<https://solana.com/solutions/actions#what-are-solana-actions-and-blockchain-links-(blinks)>).

## What are Solana Actions?

> Solana Actions are specification-compliant APIs that return transactions on the Solana blockchain to be previewed, signed, and sent accross various contexts, including QR codes, buttons + widgets in mobile and desktop application and websites across the internet [(Blockchain Links and Solana Actions)](<https://solana.com/solutions/actions#what-are-solana-actions-and-blockchain-links-(blinks)>).

Given that Solana Actions are just APIs, you can just use Express, Fastify, and other Node.js backends.

And in this blog, we'll develop and deploy our Blinks using SST!

### Now what is SST?

> Serverless Stack (SST) is a framework that makes it easy to build modern full-stack applications on your own infrastructure [(SST)](https://sst.dev).

---

### What we'll build

A simple Donate _Blink_ that allows users to donate to a specific wallet address on [_devnet_](https://solana.com/docs/core/clusters#devnet).

> If you want to know more about how Blinks work, you can check out the [Solana Actions and Blockchain Links](https://solana.com/solutions/actions) documentation.

### Things to assume

1. A wallet with some SOL on [_devnet_](https://solana.com/docs/core/clusters#devnet). No worries, you don't have to spend real money here

### Prerequisites

1. [Node.js](https://nodejs.org/en/download/) installed on your machine.
2. AWS Account

### Project Setup

1. create project
2. install sst
3. project structure
4. file contents

## Outro

This blog does not say that deploying blinks on Next.js is heavy/bloated etc. The purpose of this blog lets you have another method of deploying Blinks.
