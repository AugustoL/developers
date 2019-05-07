# How to choose Runtime Environment

The centerpoint of Winding Tree platform runtime environment is the Ethereum Smart contract called Winding Tree Index. It serves as a decentralized registry of participating service providers \(hotels, airlines\) and the tooling is configured to use it.

The tooling for the environment consists of one or more [REST APIs](../apis.md) operated either as a service or on-premise - it typically depends on the necessary security measures. The ecosystem is intentionally open, so you can swap Winding Tree reference implementation and architecture with something completely different that suites your particular use case better.

### Active environments

Winding Tree team is currently operating several environments.

Winding Tree is still in an experimental phase and we are currently running two environments for testing. They are usually identical in versions, but they use a separate Winding Tree Index.

Both environments are using the Ropsten Ethereum testnet, so you don't need to have real ETH or LÍF to start experimenting with it.

**Notice**: Both environments are for technology demonstration purposes only. The production deployment layout is different. Mainly, the Write API is not recommended to be available directly from the internet, because it contains the Ethereum wallet.

#### Playground

* Index: [0xB309875d8b24D522Ea0Ac57903c8A0b0C93C414A](https://ropsten.etherscan.io/address/0xB309875d8b24D522Ea0Ac57903c8A0b0C93C414A)
* Read API: [https://playground-api.windingtree.com](https://playground-api.windingtree.com)
* Write API: [https://playground-write-api.windingtree.com](https://playground-write-api.windingtree.com)
* Notification API: [https://playground-notification-api.windingtree.com](https://playground-notification-api.windingtree.com)
* Search API: [https://playground-search-api.windingtree.com](https://playground-search-api.windingtree.com)
* Hotel explorer: [https://hotel-explorer-playground.windingtree.com](https://hotel-explorer-playground.windingtree.com)

We are populating the Playground environment with curated data from [wt-fixtures](https://github.com/windingtree/wt-fixtures). Availability data gets updated monthly, so it should make sense at all times.

#### Demo

* Index: [0xad98e1eCcB4Db6c4BB5a03ee9989a583F0821473](https://ropsten.etherscan.io/address/0xad98e1eCcB4Db6c4BB5a03ee9989a583F0821473)
* Read API: [https://demo-api.windingtree.com](https://demo-api.windingtree.com)
* Write API: [https://demo-write-api.windingtree.com](https://demo-write-api.windingtree.com)
* Search API: [https://demo-search-api.windingtree.com](https://demo-search-api.windingtree.com)
* Hotel explorer: [https://hotel-explorer-demo.windingtree.com](https://hotel-explorer-demo.windingtree.com)

We are populating the Demo environment with curated data from [wt-fixtures](https://github.com/windingtree/wt-fixtures). Availability data gets updated monthly, so it should make sense at all times.

Notification API is not deployed for Demo environment, because it is environment agnostic. You can reuse the Playground deployment in case you need it.

## How to run another environment?

If you, for some reason, need to run a fresh and separate environment, the key to do it is to deploy your own Winding Tree Index and run all of the necessary tools with the appropriate configuration.

## How to reset an existing environment

Since you are not able to delete any data on behalf of the users, the only way to reset an environment is to deploy a new Winding Tree Index and reconfigure every other tool to point to the new location.

## Where to next

* [How to setup Read API](how-to-setup-read-api.md)
* [How to setup Write API](how-to-setup-write-api.md)



