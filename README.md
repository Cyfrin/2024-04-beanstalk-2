# Beanstalk Codehawks Part 2

<img src="https://res.cloudinary.com/droqoz7lg/image/upload/q_90/dpr_2.0/c_fill,g_auto,h_320,w_320/f_auto/v1/company/vwkqymxqrtutq4rdvf7w?_a=BATAUVAA0" width="50%" height="auto">

# Contest Details

### Prize Pool

- Total Pool - 35,000
- H/M - 30,000
- Low - 1,500
- Community Judging - 3,500
- Starts: Monday, April 01, 2024 Noon UTC
- Ends: Monday, April 15, 2024 Noon UTC

### Stats

- nSLOC: 1,991
- Complexity Score: 1203

## About

Beanstalk is a permissionless fiat stablecoin protocol built on Ethereum. Its primary objective is to incentivize independent market participants to regularly cross the price of 1 Bean over its dollar peg in a sustainable fashion.

Beanstalk does not have any collateral requirements. Beanstalk uses credit instead of collateral to create Bean price stability relative to its value peg of $1. The practicality of using DeFi is currently limited by the lack of decentralized low-volatility assets with competitive carrying costs. Borrowing rates on USD stablecoins have historically been higher than borrowing rates on USD, even when supply increases rapidly. Non-competitive carrying costs are due to collateral requirements.

In particular, this audit is centered around the BIP (Beanstalk Improvement Proposal) that whitelists the BEAN:wstETH Well in the Silo and migrates liquidity underlying Unripe assets from BEAN:ETH to BEAN:wstETH. You can read more details in the RFC for the update [here](https://github.com/BeanstalkFarms/Beanstalk/issues/731).

You can read an overview of how Beanstalk works [here](https://docs.bean.money/almanac/introduction/how-beanstalk-works).

* [Docs](https://docs.bean.money/)
* [Whitepaper](https://bean.money/beanstalk.pdf)
* [Website](https://bean.money/)
* [Beanstalk Farms Twitter](https://twitter.com/BeanstalkFarms)
* [Beanstalk Public GitHub Repo](https://github.com/BeanstalkFarms/Beanstalk)

## Actors

* Stalkholder / Silo Member
    * Anyone who Deposits assets on the Deposit Whitelist into the Silo, earning the illiquid Stalk token in doing so. Stalkholders participate in governance and earn Bean seigniorage.
* `gm` caller
    * Anyone who calls the `gm` function to start the next Season.
* Unripe holder
    * Anyone who holds Unripe Beans or Unripe LP. These assets were distributed to holders of BDV (Bean Denominated Value) at the time of the April 2022 governance exploit. Most Unripe holders have their Unripe assets Deposited in the Silo, and thus are also Stalkholders.
* Fertilizer holder
    * Anyone who holds Fertilizer, the debt asset earned by participating in Beanstalk's recapitalization.
* Pod holder
    * Anyone who holds Pods, the Beanstalk-native debt asset. Pods are minting when lending Beans to Beanstalk (Sowing Beans). Not particularly relevant for the scope of this audit.

## Scope

Generally, the audit covers the Silo, the Sun and many of their associated libraries. A couple contracts from the Barn (related to Unripe assets) are also in scope. 

Specifically, only the following contracts are in scope.

```js
protocol/
└── contracts/
    ├── beanstalk/
    │   ├── AppStorage.sol
    │   ├── barn/
            ├── FertilizerFacet.sol
    │   │   └── UnripeFacet.sol
    │   ├── init/
    │   │   └── InitMigrateUnripeBeanEthToBeanSteth.sol
    │   ├── silo/
    │   │   ├── BDVFacet.sol
    │   │   └── SiloFacet/
    │   │       └── Silo.sol
    │   └── sun/ 
    │       ├── GaugePointFacet.sol
    │       ├── LiquidityWeightFacet.sol
    │       └── SeasonFacet/
    │           └── Oracle.sol
    └── libraries/
        ├── Convert/ 
        │   ├── LibConvert.sol
        │   └── LibUnripeConvert.sol 
        ├── LibBarnRaise.sol
        ├── LibEvaluate.sol
        ├── LibFertilizer.sol
        ├── Minting/ 
        │   └── LibWellMinting.sol
        ├── Oracle/ 
        │   ├── LibChainlinkOracle.sol
        │   ├── LibEthUsdOracle.sol
        │   ├── LibOracleHelpers.sol
        │   ├── LibUniswapOracle.sol
        │   ├── LibUsdOracle.sol
        │   ├── LibWstethEthOracle.sol
        │   └── LibWstethUsdOracle.sol
        ├── Silo/
        │   └── LibWhitelist.sol
        └── Well/
            ├── LibWell.sol
            └── LibWellBdv.sol
```

## Compatibilities

Beanstalk implements the [ERC-2535 Diamond standard](https://docs.bean.money/developers/overview/eip-2535-diamond). It supports various whitelists for [Deposits](https://docs.bean.money/almanac/farm/silo#deposit-whitelist), [Minting](https://docs.bean.money/almanac/farm/sun#minting-whitelist), [Converts](https://docs.bean.money/almanac/peg-maintenance/convert#convert-whitelist), etc., particularly for LP tokens from [Basin](https://basin.exchange/).

Blockchains:
* Ethereum

Tokens:
* ERC-20 (all are accepted in Farm balances, a whitelist is accepted on the Deposit Whitelist, etc.)
* ERC-1155 (Fertilizer and Deposits are ERC-1155 tokens)

## Setup

Clone repo: 

```bash
git clone https://github.com/Cyfrin/2024-04-beanstalk-2
```
Install dependencies: 
```bash
cd Beanstalk/protocol
yarn
```
Add RPC:
```bash
export FORKING_RPC=https://eth-mainnet.g.alchemy.com/v2/{RPC_KEY}
```

generate: 
```bash
yarn generate
```
Test: 
```bash
yarn test
```

## Known Issues

* The `enrootDeposits` functions do not properly emit ERC-1155 events.
    * `enrootDeposits` updates a user's Unripe Deposits' BDV and issues the corresponding Stalk to the user. The single `enrootDeposit` function correctly emits the ERC-1155 events, but the multiple variant incorrectly emits a `transferSingle` event to the 0 address for each Deposit. Given the Beanstalk subgraph does not use these events, and cannot be used to harm the protocol, the fix will be implmented in a separate upgrade to Beanstalk.

* All findings in the following audit reports
    * [Cyfrin's initial audit report of v0 of the Gauge System](https://arweave.net/tfK_IQlxz1lABDEq4aefN9gPQaynKZKYFvFyU8seYA8) (the version of the Gauge System in this Codehawks audit is substantially different, hence the need for another audit);
    * [Cyfrin's initial Beanstalk report](https://arweave.net/JQodlB-9fil-OWfWOwYy6Q8eqWITJXtyaN5z_Anq1S0);
    * All Beanstalk audit reports listed in this [repository](https://github.com/BeanstalkFarms/Beanstalk-Audits);
    * **TBD: Beanstalk Codehawks Part 1**; and
    * All bug reports from the Immunefi program listed [here](https://community.bean.money/bug-reports).
**Additional Known Issues:**

- LightChaser - [Bot Issues](https://github.com/Cyfrin/2024-04-beanstalk-2/issues/1)
- Valid Issues as Determined by Part 1:
- Beanstalk Part 1 - [Part 1 Audit Preliminary Report](https://www.codehawks.com/report/clsxlpte900074r5et7x6kh96)
