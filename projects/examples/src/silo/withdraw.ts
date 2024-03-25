import { BeanstalkSDK, Token, TokenValue } from "@beanstalk/sdk";
import { Crate } from "@beanstalk/sdk/dist/types/lib/silo";

import chalk from "chalk";
import { account as _account, impersonate } from "../setup";

main().catch((e) => {
  console.log("FAILED:");
  console.log(e);
});

let sdk:BeanstalkSDK;

async function main() {
  const account = process.argv[3] || _account;
  console.log(`${chalk.bold.whiteBright("Account:")} ${chalk.greenBright(account)}`);
  let { sdk: _sdk, stop } = await impersonate(account);
  sdk = _sdk;
  sdk.DEBUG = false;

  const amount = 100
  await go(sdk.tokens.BEAN, sdk.tokens.BEAN.amount(amount));
  await go(sdk.tokens.BEAN_CRV3_LP, sdk.tokens.BEAN_CRV3_LP.amount(amount));
  await go(sdk.tokens.UNRIPE_BEAN, sdk.tokens.UNRIPE_BEAN.amount(amount));
  await go(sdk.tokens.UNRIPE_BEAN_CRV3, sdk.tokens.UNRIPE_BEAN_CRV3.amount(amount));
  
  await stop();
}

async function go(token: Token, amount: TokenValue) {
  console.log(`Withdrawing ${amount.toHuman()} from ${token.symbol} Silo`);
  const tx = await sdk.silo.withdraw(token, amount)
  await tx.wait();

  console.log('Done');
}
