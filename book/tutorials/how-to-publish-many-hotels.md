# How to publish bulk inventory for multiple hotels

Do you manage a system that represents many hotels or properties?
In this tutorial, you will learn how you might integrate with
Winding Tree ecosystem with the existing tooling.

## Requirements

* [Winding Tree Write API](https://github.com/windingtree/wt-write-api) URL.
  > #### Info
  >
  > Learn how to [discover](how-to-pick-environment.md), [setup](how-to-setup-write-api.md) and [make discoverable]()
  > the Winding Tree ecosystem APIs.
* Maintaining data for an entire hotel
  > #### Info
  >
  > Learn how to [publish inventory for an entire hotel](how-to-publish-entire-hotel.md)

## Step by step

Winding Tree's goal is proper data ownership. That is why every hotel can be
manipulated only by the holder of it's owner's Ethereum wallet.

There are multiple ways of managing more than one hotel in a single system. We
will try to give you some advice and recommendations here for such setup.

### Write API setup

Write API is ready to handle multiple hotels at once. It is also capable
of working with multiple separate accounts tied to multiple separate 
Ethereum wallets.

We recommend to set up your system in a way where **one Ethereum wallet =
one Write API account = one hotel**. This is the most secure and most
performant solution. It may be a little bit challenging to distribute ETH
to all of these wallets but you can for example pre-allocate wallets etc.

If multiple hotels would share a wallet, it would mean that they will be
effectively owned by the same entity. It would also mean that you would not
be able to update them simultaneously due to limitations in transaction
concurrency on Ethereum.

In any case, it would be wise to run Write API on-premise and not expose
it to the public internet.

### Hosting data on your own infrastructure

There is quite a big chance that when you are managing many hotels, you
already have some system in place, maybe even a public API that your
consumer facing applications are using.

In order to host the data by yourself, you just need to expose an API
which talks with data that conforms to Winding Tree's
[data model](../data-model.md). In such setup, it of course does not make
sense to publish all of the data via Write API.

For such cases, the Write API offers a shorthand method for registering
hotels by submitting only the entrypoint URI stored on blockchain. The
initial setup is the same as in the [ordinary case](how-to-publish-inventory)
&mdash; you need to create an [account](how-to-setup-write-api.md) in Write API.
However, you don't need to specify any uploaders in this case.

```json
{
  "wallet": {"version":3,"id":"7fe84016-4686-4622-97c9-dc7b47f5f5c6","crypto":{"ciphertext":"ef9dcce915eeb0c4f7aa2bb16b9ae6ce5a4444b4ed8be45d94e6b7fe7f4f9b47","cipherparams":{"iv":"31b12ef1d308ea1edacc4ab00de80d55"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"d06ccd5d9c5d75e1a66a81d2076628f5716a3161ca204d92d04a42c057562541","n":8192,"r":8,"p":1},"mac":"2c30bc373c19c5b41385b85ffde14b9ea9f0f609c7812a10fdcb0a565034d9db"}},
  "uploaders": {}
}
```

```sh
$ curl -X POST localhost:8000/accounts \
  -H 'Content-Type: application/json' \
  --data @account.json

# accountId and accessKey are generated and will be different every time
{"accountId":"aa43edaf8266e8f8","accessKey":"usgq6tSBW+wDYA/MBF367HnNp4tGKaCTRPy3JHPEqJmFBuxq1sA7UhFOpuV80ngC"}
```

Then, you prepare the data document, which in this case, is much shorter.
We will save this file under `hotelWithoutData.json`. The `dataUri` value
should be pointing to your own service which responds with the data
entrypoint (<a href="/data-model/hotels.html" target="_blank">Hotel data index</a>)
for given hotel.

```json
{
  "dataUri": "https://my-custom-api.example.com/hotel-12345"
}
```

And then with a simple request with that data, we register the hotel
in Winding Tree ecosystem.

```sh
$ curl -X POST https://playground-write-api.windingtree.com/hotels \
  -H 'Content-Type: application/json' \
  -H 'X-Access-Key: write-api-account-access-key' \
  -H 'X-Wallet-Password: ethereum-wallet-password' \
  --data @hotelWithoutData.json
```

In the response, you will get an Ethereum address where your hotel
is registered. That address belongs only to the holder of the used
Ethereum wallet and noone else can modify the record stored there.

```json
{"address":"0xA603FF7EA9A1B81FB45EF6AeC92A323a88211f40"}
```

In order to update the dataUri, you just issue a `PATCH` request with
the same data structure.

```sh
$ curl -X PATCH https://playground-write-api.windingtree.com/hotels/0xA603FF7EA9A1B81FB45EF6AeC92A323a88211f40 \
  -H 'Content-Type: application/json' \
  -H 'X-Access-Key: write-api-account-access-key' \
  -H 'X-Wallet-Password: ethereum-wallet-password' \
  --data @hotelWithoutData.json
```

## Where to next

* [How to keep the Write API secure](how-to-secure-write-api.md)



