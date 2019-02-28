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

!!!TODO!!! write down the register hotel without data use case

## Where to next

* [How to keep the Write API secure](how-to-secure-write-api.md)



