
# Q3 2025 – Turbin3 Builders

#### 👋 Welcome to the Repository!

---

### Projects :
1. **Anchor Vault**
    - Live url ➞ [https://storesol.vercel.app ](https://storesol.vercel.app/)
    - Code 👉 ➞ [ anchor-vaults](https://github.com/NishantCoder108/Q3_25_Turbin3_Builders/tree/master/anchor-vaults/app)
    - Vault Demo Video ⤵

https://github.com/user-attachments/assets/68954679-4d09-4f8f-b4d0-232b3854f1e9

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

### 🔐 On-Chain Wallet Key
```env
// Every transaction with below public address
OnChain_Wallet_Key = "ExUttmYkaNKjTPgg6yRkZdrdCH2VC1N5MDp7L424fCss"
````

---

<details>
   <summary>   Explore during learning</summary>


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


