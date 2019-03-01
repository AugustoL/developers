# How to setup Read API

In this tutorial, you will learn
about [Winding Tree Read API](https://github.com/windingtre/wt-read-api) and
how to set it up and work with it.

## Requirements

- Installed and running [Docker](https://www.docker.com)
- Chosen Winding Tree ecosystem environment
> #### Info
> [Which Winding Tree ecosystem environments are available?](how-to-pick-environment.md)

## Step by step

Winding Tree Read API is a REST API that can be used
to read inventory registered in Winding Tree ecosystem.
It is a fully stateless and cache-less API that for now
does not require any prior user authentication.

### Running the API

The recommended way of running Winding Tree ecosystem APIs is via
docker images. You can grab the latest stable version of Read API
on [Docker Hub](https://hub.docker.com/u/windingtree/).

First, you need to download the docker image:

```sh
$ docker pull windingtree/wt-read-api
```

And then you need to run it with a configuration meant for the
environment you have chosen. You also need to specify to which
Ethereum Node the API will connect. We recommend to register with
[Infura](https://infura.io/) where you will get an HTTP address such
as `https://ropsten.infura.io/v3/project-id` which you would use as
ETH_NETWORK_PROVIDER. Be careful to choose the node with appropriate
network (i. e. ropsten or mainnet).

```sh
$ docker run -p 8081:3000 -e ETH_NETWORK_PROVIDER=address_to_node -e WT_CONFIG=playground windingtree/wt-read-api
```

The Read API is then exposed on port 8081:

```sh
$ curl localhost:8081
{
   "wtIndexAddress" : "0xfb562057d613175c850df65e435bb0824b65d319",
   "version" : "0.10.0",
   "ethNetwork" : "ropsten",
   "docs" : "https://playground-api.windingtree.com/docs/",
   "info" : "https://github.com/windingtree/wt-read-api/blob/master/README.md",
   "config" : "playground",
   "dataFormatVersion" : "0.2.0"
}
```

If you need more control over your setup, you can configure everything with
environment variables passed to `docker run` command. Detailed documentation
can be found in the [source code repository](https://github.com/windingtree/wt-read-api#running-node-against-ropsten-testnet-contract).

## Where to next

- [How to retrieve inventory](how-to-retrieve-inventory.md)
