# How to publish inventory

In this tutorial, you will learn how tu publish the simplest offering
possible: Your apartment for a period of your vacation.

## Requirements

- [Winding Tree Write API](https://github.com/windingtree/wt-write-api) URL.
> ####Info
> Learn how to [discover](how-to-pick-environment.md), [setup](how-to-setup-write-api.md) and [make discoverable]()
the Winding Tree ecosystem APIs.

## Step by step

Let's say your name is Frank, you are accidentaly living
in NASA offices in Washington, DC and you are going out of town
for a weekend. That's a great moment to offer your apartment to
other travellers.

### Preparing the data

In Winding Tree ecosystem, data is divided into the following
groups:

  - general description
  - inventory
  - prices
  - availability

We are going to construct the data document necessary to register
your apartment in Winding Tree ecosystem and offer it to the world.

#### General description

This part identifies you as a property owner and contains basic information
about both you and the property. In Frank's case, it will look like this:

```json
{
  "description": {
    "name": "Frank's apartment",
    "description": "Beautiful apartment near city center.",
    "contacts": {
      "general": {
        "email": "wt-frank@mailinator.com",
        "phone": "+12023581900"
      }
    },
    "address": {
      "road": "E. Street SW, Suite 5R30",
      "houseNumber": "300",
      "city": "Washington",
      "state": "DC",
      "postcode": "20546",
      "countryCode": "US"
    },
    "timezone": "America/New_York",
    "currency": "USD",
    "defaultCancellationAmount": 100
  }
}
```

The `defaultCancellationAmount` is necessary for handling situations
where the travelers need to cancel their reservation. The value `100`
simply means that cancellations are not possible and the money cannot
be returned.

#### Inventory

Inventory describes the property itself, in our case, we are offering
the apartment as a whole and we do not want more than 3 people there.

```json
{
  "roomTypes": [
    {
      "id": "franks-apartment",
      "name": "Whole apartment",
      "description": "This is a whole apartment",
      "totalQuantity": 1,
      "occupancy": {
        "max": 3
      }
    }
  ]
}
```

#### Prices

Prices are defined as a set of rate plans that can be adjusted and combined
to individual needs. In this instance, we are happy with a fixed price of
125 USD per night.

```json
{
  "ratePlans": [
    {
      "id": "franks-price",
      "name": "Fixed price",
      "price": 125,
      "roomTypeIds": [
        "franks-apartment"
      ]
    }
  ]
}

```

#### Availability

Of course Frank wants to list his apartment only for the weekend when he is
out of town, so we need to set the availability for those dates. The apartment
will be free for three nights - from Thursday to Sunday.

```json
{
  "availability": {
    "roomTypes": [
      {
        "roomTypeId": "franks-apartment",
        "date": "2019-07-04",
        "quantity": 1
      },
      {
        "roomTypeId": "franks-apartment",
        "date": "2019-07-05",
        "quantity": 1
      },
      {
        "roomTypeId": "franks-apartment",
        "date": "2019-07-06",
        "quantity": 1
      }
    ]
  }
}
```

#### Special fields

In addition to the aforementioned sections, the data can contain a few
more special fields.

Since we don't currently offer a way of localizing the textual data,
we at least allow you to declare in which `defaultLocale` the content is.
It can be used to for example translate the text automatically on the client
side.

Another special field is called `booking` and contains URI of the
[Booking API](how-to-accept-bookings.md) instance.

### Uploading the data

The [Write API](https://github.com/windingtree/wt-write-api) wants all
of the data in a single request, so we need to combine everything together.
Notice that the inventory is actually part of the description section.

We will store the data into a file called `franks-apartment.json`.

```json
{
  "description": {
    "name": "Frank's apartment",
    "description": "Beautiful apartment near city center.",
    "contacts": {
      "general": {
        "email": "wt-frank@mailinator.com",
        "phone": "+12023581900"
      }
    },
    "address": {
      "road": "E. Street SW, Suite 5R30",
      "houseNumber": "300",
      "city": "Washington",
      "state": "DC",
      "postcode": "20546",
      "countryCode": "US"
    },
    "roomTypes": [
      {
        "id": "franks-apartment",
        "name": "Whole apartment",
        "description": "This is a whole apartment",
        "totalQuantity": 1,
        "occupancy": {
          "max": 3
        }
      }
    ],
    "timezone": "America/New_York",
    "currency": "USD",
    "defaultCancellationAmount": 100
  },
  "ratePlans": [
    {
      "id": "franks-price",
      "name": "Fixed price",
      "price": 125,
      "roomTypeIds": [
        "franks-apartment"
      ]
    }
  ],
  "availability": {
    "roomTypes": [
      {
        "roomTypeId": "franks-apartment",
        "date": "2019-07-04",
        "quantity": 1
      },
      {
        "roomTypeId": "franks-apartment",
        "date": "2019-07-05",
        "quantity": 1
      },
      {
        "roomTypeId": "franks-apartment",
        "date": "2019-07-06",
        "quantity": 1
      }
    ]
  },
  "defaultLocale": "en",
  "booking": "https://franks.example-booking-domain.com"
}
```

In order to list the apartment, we will call the Write API's `/hotels`
endpoint. To be able to do that, you need to have your Write API
[account ready and configured](how-to-setup-write-api.md).

```sh
$ curl -X POST https://playground-write-api.windingtree.com/hotels \
  -H 'Content-Type: application/json' \
  -H 'X-Access-Key: write-api-account-access-key' \
  -H 'X-Wallet-Password: ethereum-wallet-password' \
  --data @franks-apartment.json
```

In the response, you will get an Ethereum address where Frank's apartment
is registered. That address belongs only to the holder of the used
Ethereum wallet and noone else can modify the record stored there.

```json
{"address":"0xA603FF7EA9A1B81FB45EF6AeC92A323a88211f40"}
```

## Where to next

- [Building hotel booking page](how-to-build-a-booking-page.md)
- [Publishing inventory and availability offering for an entire hotel](how-to-publish-entire-hotel.md)
- [Publishing inventory and availability offering for many hotels](how-to-publish-many-hotels.md)
- [How to accept bookings?](how-to-accept-bookings.md)
<!-- TODO Notification API -->