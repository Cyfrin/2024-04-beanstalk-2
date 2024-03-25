Committed: August 9, 2022

## Submitter

Beanstalk Community Multisig

## Emergency Process Note

Per the process outlined in the [BCM Emergency Response Procedures](https://docs.bean.money/governance/beanstalk/bcm-process#emergency-response-procedures), an emergency hotfix may be implemented by an emergency vote of the BCM if the bug is minor and does not require significant code changes.

Note: Bugs or security vulnerabilities qualify as emergencies. Emergency action will not be taken for any reason related to the economic health of Beanstalk (like a bank run, for example).

## Links

* GitHub PR: https://github.com/BeanstalkFarms/Beanstalk/pull/80
* GitHub Commit Hash: fa8612e3698d932004f45cd3260c5ad71893b006
* Gnosis Transaction: https://etherscan.io/tx/0x7949bdea1864aa66712bac3d57b79f3030c4cafbb91cdca3d56a0921e1496402
* Arweave: https://arweave.net/PV_7zu19NJg1aWzo4IHu8R0t-ptMV6JL2CMaMK7Q3zg

## Issue

If a Farmer performs an action that removed all of their assets from the Silo, all their Earned Beans were forfeited.

## Fix

If a Farmer performs an action that removes all of their assets from the Silo, their Earned Beans remain constant.

## Magnitude

It is estimated that approximately 1717 Beans across 32 accounts have been forfeited so far. Forfeited Earned Beans were redistributed across remaining Stalkholders. 

## Effective

Immediately upon commit by the BCM, which has already happened.
