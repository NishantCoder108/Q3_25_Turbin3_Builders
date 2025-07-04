# q3_25_turbin3_builders
Hey there!,
If you are on this repo. I want to clarify this repo is specially made for learning and practicing the concepts in depth that I have learned in the turbin3 cohort.

----
`OnChain_Wallet_Key= ` **"ExUttmYkaNKjTPgg6yRkZdrdCH2VC1N5MDp7L424fCss"**`



### My Learnings:
1. `npx tsc --int` to create tsconfig file
2. `resolveJsonModule` is set to true in tsconfig file to allow importing json files
3. `allowSyntheticDefaultImports` is set to true in tsconfig file to allow importing modules without default export
4. `"module": "esnext"` is set to true in tsconfig file. It fix importing `JSON` files importing error `import wallet from './onchain-wallet-key.json' with { type: "json" };`
5. `v24.3.0` - Node version for this repo