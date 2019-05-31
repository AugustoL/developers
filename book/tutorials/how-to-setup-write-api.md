# How to setup Winding Tree Write API

In this tutorial, you will learn about
[Winding Tree Write API](https://github.com/windingtree/wt-write-api) and
how to set it up and work with it.

## Requirements

- Installed and running [Docker](https://www.docker.com)
- Chosen Winding Tree ecosystem environment
> #### Info
> [Which Winding Tree ecosystem environments are available?](how-to-pick-environment.md)
- Ethereum wallet
> #### Info
> [How do I generate Ethereum wallet?](how-to-generate-ethereum-wallet.md)
- Own enough ETH for transaction gas
> #### Info
> - [How do I get my first Ether?](how-to-get-first-ether.md)
> - [How much gas do I need?](how-much-does-it-cost.md)

## Step by step

Winding Tree Write API is a REST API that can be used to
upload or register inventory to Winding Tree ecosystem. As
such it is holding the Ethereum wallet that is used to manage
your primary record in Winding Tree Index.

### Running the API

The recommended way of running Winding Tree ecosystem APIs is via
docker images. You can grab the latest stable version of Write API
on [Docker Hub](https://hub.docker.com/u/windingtree/).

First, you need to download the docker image:

```sh
$ docker pull windingtree/wt-write-api
```

And then you need to run it with a configuration meant for the
environment you have chosen. You also need to specify to which
Ethereum Node the API will connect. We recommend to register with
[Infura](https://infura.io/) where you will get an HTTP address such
as `https://ropsten.infura.io/v3/project-id` which you would use as
ETH_NETWORK_PROVIDER. Be careful to choose the node with appropriate
network (i. e. ropsten or mainnet).

```sh
$ docker run -p 8080:8000 -e ETH_NETWORK_PROVIDER=address_to_node -e WT_CONFIG=playground windingtree/wt-write-api
```

The Write API is then exposed on port 8080:

```sh
$ curl localhost:8080
{
   "config" : "playground",
   "dataFormatVersion" : "0.4.0",
   "wtIndexAddress" : "0xfb562057d613175c850df65e435bb0824b65d319",
   "ethNetwork" : "ropsten",
   "info" : "https://github.com/windingtree/wt-write-api/blob/master/README.md",
   "version" : "0.11.0",
   "docs" : "https://playground-write-api.windingtree.com/docs/"
}
```

If you need more control over your setup, you can configure everything with
environment variables passed to `docker run` command. Detailed documentation
can be found in the [source code repository](https://github.com/windingtree/wt-write-api#running-node-against-ropsten-testnet-contract).

### Setting up accounts

Write API is working with the concept of *accounts*. Every account
is a virtual user of the API and has the following properties
associated with it:

- Ethereum wallet that is used to sign and pay for all on-chain transactions
- Uploaders configuration that is used when uploading inventory to Winding Tree
ecosystem.

We recommend to associate a particular wallet with only one account and use that
account to manage only one record in Winding Tree Index. This recommendation
is for security and performance reasons.

Accounts (with associated password protected wallets) are stored in the Write
APIs database. So be careful about who can access the API.

Every account is represented as a JSON object. We will store this one in a file
called `account.json`.

```json
{
  "wallet": {"version":3,"id":"7fe84016-4686-4622-97c9-dc7b47f5f5c6","crypto":{"ciphertext":"ef9dcce915eeb0c4f7aa2bb16b9ae6ce5a4444b4ed8be45d94e6b7fe7f4f9b47","cipherparams":{"iv":"31b12ef1d308ea1edacc4ab00de80d55"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"d06ccd5d9c5d75e1a66a81d2076628f5716a3161ca204d92d04a42c057562541","n":8192,"r":8,"p":1},"mac":"2c30bc373c19c5b41385b85ffde14b9ea9f0f609c7812a10fdcb0a565034d9db"}},
  "uploaders": {
    "root": {
      "swarm": {}
    }
  }
}
```

The `wallet` is in a [Web3 Secret Storage format](https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition)
and is password protected. This one
represents an Ethereum address [0xd037ab9025d43f60a31b32a82e10936f07484246](https://ropsten.etherscan.io/address/0xd037ab9025d43f60a31b32a82e10936f07484246)
and **shall never be used for any production operations**. Password to this
wallet is `windingtree` and we use it accross all of our examples and documentation.

The `uploaders` part tells the Write API where to store the inventory data.
For the sake of brevity, we will use [Swarm](https://swarm-gateways.net/bzz:/theswarm.eth/),
a decentralized file hosting. To check for different storage options, take
a look at [this tutorial](how-to-pick-off-chain-storage.md).

To create an account with this setup, you need to do the following call:

```sh
$ curl -X POST localhost:8000/accounts \
  -H 'Content-Type: application/json' \
  --data @account.json

# accountId and accessKey are generated and will be different every time
{"accountId":"aa43edaf8266e8f8","accessKey":"usgq6tSBW+wDYA/MBF367HnNp4tGKaCTRPy3JHPEqJmFBuxq1sA7UhFOpuV80ngC"}
```

### Account usage

When you are calling any endpoint that requires your account, you have to pass
two headers with such request:

- `X-Access-Key` - The value of `accessKey` returned upon account creation
- `X-Wallet-Password` - Password that decrypts your Ethereum wallet, in our case `windingtree`

For example if you are [creating new record](how-to-publish-inventory.md)
 in Winding Tree Index, you would call:

```sh
$ curl -X POST https://playground-write-api.windingtree.com/hotels \
  -H 'Content-Type: application/json' \
  -H 'X-Access-Key: usgq6tSBW+wDYA/MBF367HnNp4tGKaCTRPy3JHPEqJmFBuxq1sA7UhFOpuV80ngC' \
  -H 'X-Wallet-Password: windingtree' \
  --data @inventory-data.json
```

### Account management

The `accountId` value is used only for account management.

You can change the uploaders configuration:

```sh
$ curl -X PUT localhost:8000/accounts/aa43edaf8266e8f8 \
  -H 'Content-Type: application/json' \
  -H 'X-Access-Key: usgq6tSBW+wDYA/MBF367HnNp4tGKaCTRPy3JHPEqJmFBuxq1sA7UhFOpuV80ngC' \
  --data @account.json
```

Or you can delete the account altogether:

```sh
$ curl -X DELETE localhost:8000/accounts/aa43edaf8266e8f8 \
  -H 'Content-Type: application/json' \
  -H 'X-Access-Key: usgq6tSBW+wDYA/MBF367HnNp4tGKaCTRPy3JHPEqJmFBuxq1sA7UhFOpuV80ngC'
```

## Where to next

- [How to publish inventory](how-to-publish-inventory.md)
- [How to keep the Write API secure](how-to-secure-write-api.md)
- [How do I pick an appropriate off-chain storage?](how-to-pick-off-chain-storage.md)
