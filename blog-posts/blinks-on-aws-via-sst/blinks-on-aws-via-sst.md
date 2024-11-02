Most projects I know that revolves around _Blinks_ or [**Blockchain Links**](https://solana.com/solutions/actions) often use Next.js's [API Routes](https://nextjs.org/docs/app/api-reference/file-conventions/route) to develop and deploy _Blinks_.

## What are Blinks?

> Blockchain Links, or Blinks turn any [Solana Action](https://solana.com/solutions/actions) into a shareable, metadata-rich link. Blinks allow Action-aware clients such as browser extension wallets, bots, etc. to display additional capabilities for the user [(Blockchain Links and Solana Actions)](<https://solana.com/solutions/actions#what-are-solana-actions-and-blockchain-links-(blinks)>).

## What are Solana Actions?

> Solana Actions are specification-compliant APIs that return transactions on the Solana blockchain to be previewed, signed, and sent accross various contexts, including QR codes, buttons + widgets in mobile and desktop application and websites across the internet [(Blockchain Links and Solana Actions)](<https://solana.com/solutions/actions#what-are-solana-actions-and-blockchain-links-(blinks)>).

Given that Solana Actions are just APIs, you can just use Express, Fastify, and other Node.js backends.

And in this blog, we'll develop and deploy our Blinks on Lambda with API Gateway via SST!

## What is SST?

> Serverless Stack (SST) is an open-source framework that makes it easy to build serverless applications on AWS [(SST)](https://sst.dev).

## Outro

This blog does not say that deploying blinks on Next.js is heavy/bloated etc. The purpose of this blog lets you have another method of deploying these things.
