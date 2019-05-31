# Architectural overview

This document should shed some light on the overall architecture of
Winding Tree ecosystem and explain some of the design decisions we
have made so far.

![architecture](assets/architecture.png)

Our intention is to create an open layered system where at any level,
anybody can join with their own approach and benefit from the layers below.

## Shared data layer

The core of the whole ecosystem is formed by open data with proper
ownership model. Ideally, all of the data would be stored on a public
blockchain, but that's not economically and technically viable due
to data storage costs and processing time of data changes.

### Smart contracts

The entry point is formed by a smart contract called **Winding Tree Index**.
It's basically just a list of all registered hotels.

Every hotel is represented by a record that is only modifiable by its creator
and holds a single URI that points to a storage where the actual data is
located.

### Off-chain storage

While it would certainly be possible to hold the data in the blockchain itself,
it makes much more sense to keep it elsewhere - we call this an **off-chain
storage**.

Our architecture allows many types of off-chain storages, so the users can
pick whatever they want - decentralized storages such as
[Swarm](http://swarm-gateways.net/bzz:/theswarm.eth/), [IPFS](https://ipfs.io/),
[ZeroNet](https://zeronet.io/), or more traditional ones such as any common
server speaking HTTPS protocol.

The things to consider when choosing the off-chain storage are discussed in
greater detail in
[How to pick off-chain storage](tutorials/how-to-pick-off-chain-storage.md).

The off-chain storages supported out of the box by tooling provided by Winding
Tree [are limited](tooling.md), but community contributions are always welcome.

The data itself should conform to our [data model standard](data-model.md) so
the tooling in the higher levels of the architecture can understand them.

## Convenience layer

Since the data itself can be accessed via Ethereum blockchain, anyone can use
them as they are - the only required piece of information is the address of the
Winding Tree Index smart contract.

But for convenience, we provide a set of libraries that should make working with
the data much easier. We currently provide an implementation in Javascript only.

As separate repositories, we offer [adapters](tooling.md) for a few off-chain
storages. They are used by [wt-js-libs](https://github.com/windingtree/wt-js-libs)
which does all the heavy lifting for you - communication with blockchain, off-chain
URI resolving etc.

The only notable thing missing in the library is writing the data. The adapters
should offer a way of writing data to an off-chain storage, but for instance for
HTTPS there are so many options that it's virtually impossible to cover them all.

If you already have a system in place, the library level might be the place for
you to start the integration with Winding Tree ecosystem.

## REST APIs

The third layer consists of a set of REST APIs which should be familiar to any
developer out there. We have separated the functionality into a few groups
because the requirements are different for various use cases.

While we consider our implementation of the API as reference or sample ones,
the more important are the API definitions. We of course allow anyone to build
any tool they need, but we would like to ask you to keep the API definitions
of the same APIs as uniform as possible, so it's easy to switch between
implementations. This is the key component of a success of a fully distributed system
such as Winding Tree ecosystem.

### Writing

If you want to write the data, you would use the
[Write API](https://github.com/windingtree/wt-write-api). It is intended as an
on-premise installation and you can read more about it
[here](tutorials/how-to-setup-write-api.md) and
[here](tutorials/how-to-secure-write-api.md). The main challenge here is the
private key management that can potentially lead to significant amount of funds
in cryptotokens. That's why we recommend a careful approach to this API.

Part of distributing the data is surely a way of letting the data consumers
know that something has changed. To speed the process up, we provide a sample
implementation of [Notification API](https://github.com/windingtree/wt-notification-api)
which works as a message broker between data producers and data consumers.
Producers can publish notifications about their updates there and consumers
can subscribe to them.

This might seem like a centralized service, but every data producer is free
to choose or even run an instance of Notification API. The used service is
declared in the data stored in the ecosystem - so it can be decentralized as well.

### Reading

For reading the data, we provide a [Read API](https://github.com/windingtree/wt-read-api)
which is a thin API abstracting you from any blockchain or off-chain storage
related stuff. It behaves like any other REST API and it's the easiest way of
getting the data into your system.

For more advanced use cases, we also provide a sample implementation of a
[Search API](https://github.com/windingtree/wt-search-api) which carefully
tracks all available data in Winding Tree Index and gives its users a REST API
for searching for inventory by multiple criteria, such as location.

### Booking

Our current solution for booking consists of a description of a
<a href="apis/wt-booking-api.html" target="_blank">Booking protocol and API</a>.
Again, URI of this API should be provided with the data itself, making
it a decentralized venture.

## Applications

In our thinking, a typical consumer facing application would be using one or more
of the REST APIs, as is doing the [Hotel explorer](https://github.com/windingtree/wt-hotel-explorer)
or the [sample booking app](tutorials/how-to-build-a-booking-page.md).

In the true nature of decentralization, though, it should be perfectly
possible to use the library layer directly in the consumer facing application and
cut any intermediary APIs between the app, the blockchain and the off-chain
storages.
