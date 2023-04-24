# Keypom Javascript SDK integration for Pipar Escrow Marketplace

Pipar is an escrow marketplace for buying and selling of goods without the need for the buyer to trust the seller or the seller needing to trust the buyer to pay for the product when shipped. To generate a successful transaction on pipar, the buyer must first prove that he/she has the funds to purchase the product by locking the funds in the pipar smart contract. Then the seller goes ahead to deliver the product, which after the buyer approves the transaction.

## Watch video of Pipar keypom feature in action
[Watch Here](https://www.loom.com/share/0635bfdff03b4ea9a51d4c5104eb7f69)

## Pipar Website Link
[Click Here](https://www.pipar.xyz)

### What Problem Is Pipar Solving?
To understand the problem pipar is aiming to solve, you must understand what it feels like to live in a Low Trust Society(most found in developing economies). Businesses struggle to ship out products to customers far from where they reside because most of the customers won’t actually buy the product, they cancel last minute leaving the seller to cover the shipping cost.
For buyers, it is the fact that majority of the sellers won’t deliver the promised product but rather a counterfeit or they won’t deliver at all scamming the buyer. Since cost of litigation is high and stressful, buyer’s wont want to take such risk to their own detriment.

### Solution?
Pipar aims to remove all these headaches between the buyer and seller, ensuring every party meets their obligations before a transaction can go through. Removing the risks entirely.

### Challenges?
Since we’re building a web3 goods marketplace(first of its kind), we need a way to abstract the whole technical barrier to owning a web3 wallet. We want our users to quickly jumpstart buying and selling on the platform without owning wallet.
We’re currently exploring KEYPOM js sdk to solving this big problem. We’re preloading the keypom linkdrops with specific assets and let users pay for the assets using a web2 infra then claim the link drop.

There are couple of issues we’re trying to resolve with keypom so far. 100 Tgas has been limiting on actions our users can call on the platform. So far, keypom has been helpful to us eliminating this problem to great length.
