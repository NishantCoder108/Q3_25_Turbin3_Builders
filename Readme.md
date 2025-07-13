
<h2 align="center">👋 Welcome to the Repository!</h2>


### 🧠 About 

This repository contains end-to-end blockchain projects and learnings 

- ✅ Smart Contracts using **Solana**, **Rust**, **Anchor**
- ✅ Development using **Figma**, **Next.js**, **React.js**, **JS**, **TS**, **Node.js**, **TailwindCSS** and so on
- ✅ Demo videos



### 📌 Featured Project
> **🔐 Anchor Vaults** – A secure vault system built on Solana using Anchor + Next.js

https://github.com/user-attachments/assets/0be643bb-7737-4e18-a26c-f48eb69c8fc5


- 🧠 Tech: `Rust` `Anchor` `Next.js` `TailwindCSS` `shadcn/ui`
- 💻 [View Code](https://github.com/NishantCoder108/Q3_25_Turbin3_Builders/tree/master/anchor-vaults/app)
- 🌐 [Live URL](https://storesol.vercel.app)





<details>
   <summary>   Explore during learning</summary>

### 🔐 On-Chain Wallet Key
```env
// Every transaction with below public address
OnChain_Wallet_Key = "ExUttmYkaNKjTPgg6yRkZdrdCH2VC1N5MDp7L424fCss"
````

---

### 🖼️ Creating an NFT Collection

* Run `nft-image.ts` → Uploads the NFT image
* Run `nft-metadata.ts` → Creates the NFT metadata
* Run `nft-mint.ts` → Mints the NFT

![NFT Mint Preview](./onchain-operations/images/mars-travel.png)

---

### 💰 Creating SPL Tokens (like USDC, USDT, etc.)

* Run `spl-init.ts` → Creates a Mint Account
* Run `spl-mintdata.ts` → Adds token metadata
* Run `spl-mint.ts` → Mints tokens

![SPL Token Preview](./onchain-operations/images/token.png)





---
1. Initialize TypeScript project:

   ```bash
   npx tsc --init
   ```

2. Set the following in `tsconfig.json`:

   * `"resolveJsonModule": true` → Allows importing `.json` files
   * `"allowSyntheticDefaultImports": true` → Enables importing modules without default exports
   * `"module": "esnext"` → Fixes issues when importing JSON with `import wallet from './onchain-wallet-key.json' assert { type: "json" };`

3. **Node.js Version:**
   `v24.3.0` is used for this project.

</details>


