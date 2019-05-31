# How to pick an appropriate off-chain storage

In this tutorial, you will learn about storage options in Winding
Tree ecosystem.

## Requirements

- [Winding Tree Write API](https://github.com/windingtree/wt-write-api) URL.
> ####Info
> Learn how to [discover](how-to-pick-environment.md), [setup](how-to-setup-write-api.md) and [make discoverable]()
the Winding Tree ecosystem APIs.

## Step by step

When you are uploading inventory to Winding Tree ecosystem, you have
to pick where your data will be stored. This is due to the nature of
Ethereum blockchain, where storing large chunks of data is expensive.
Another problem is, that even the smallest change in data results
in the need of a transaction which might get costly and kind of slow.

That's why the majority of data in Winding Tree is stored elsewhere,
in a so called **off-chain storage**. And there are multiple options,
and as it goes each one has its pros and cons.

Also, because of the [data model](../data-model.md) designed as a
tree of documents interlinked by URIs, you are able to combine
multiple types of storages: Just pick a different storage for each
document.

On the source code level, every storage can be added to Winding Tree
ecosystem as an adapter. They are used for both reading and writing
and are typically plugged into both [Write API](https://github.com/windingtree/wt-write-api)
and [Read API](https://github.com/windingtree/wt-read-api).

On the user level, you have to choose your storage when using the
Write API. When you are creating an account, you specify storages
in the `uploaders` section. A more detailed description can be
found directly in the 
[Write API documentation](https://github.com/windingtree/wt-write-api#uploaders).

For reading, everything should work out of the box and apart from
telling the Read API to use all of the adapters, there are no
additional steps needed.

### HTTPS

For a robust storage system, we support serving the documents via
good old HTTPS. This allows you to even serve the documents dynamically
from your existing backend. You then only need to make sure that your API
speaks the proper data format.

The biggest disadvantage is that you need to host your data somewhere. The
Write API supports upload to [AWS S3](https://aws.amazon.com/s3/) out of the
box, but the Adapter itself does not contain any HTTPS upload specific code.
It is up to you.

While setting up your server, don't forget about proper
[Cross-origin resource sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
setup.


### Swarm

[Swarm](https://swarm-gateways.net/bzz:/theswarm.eth/) is a decentralized
storage developed alongside Ethereum. It is **still in its alpha stage**
and is quite unstable and highly experimental.

Its main advantage is the decentralization aspect - you don't need to 
manage your own servers. However, there are quite a few disadvantages:

- Still an alpha phase - data can get lost or may become unavailable
- Content hash based addressing - even the smallest change in the data
means that it will get a new address.

As the documents in the tree are linked with URIs with each other, every
change will get propagated upwards and will result into an on-chain
transaction.

Swarm is great for rapid prototyping and testing, but due to its alpha
nature I wouldn't use it in production just yet. The addressing issue
can be mitigated by using [Swarm feeds](https://swarm-guide.readthedocs.io/en/latest/usage.html#feeds)
which we want to support eventually.

### More options

There are of course plenty of options available, some more mature than others.
In our [older blogpost](https://blog.windingtree.com/decentralized-storage-for-winding-tree-f86535bee014),
we discuss a lot of them and our reasoning for choosing Swarm and HTTPS in more
detail.

If you'd like to use a so far unsupported storage option, we welcome and third
party contribution. Thank you!

## Where to next

- <a href="https://github.com/windingtree/off-chain-adapter-swarm" target="_blank">Adapter for Swarm storage (Javascript)</a>
- <a href="https://github.com/windingtree/off-chain-adapter-http" target="_blank">Adapter for HTTPS storage (Javascript)</a>
- [How to setup AWS S3]('how-to-setup-aws-s3.md')