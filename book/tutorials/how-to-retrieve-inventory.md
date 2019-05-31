# How to query inventory listings

In this tutorial, you will learn how to obtain offerings
published in Winding Tree ecosystem.

## Requirements

- [Winding Tree Read API](https://github.com/windingtree/wt-read-api) URL.
> ####Info
> Learn how to [discover](how-to-pick-environment.md), [setup](how-to-setup-read-api.md) and [make discoverable]()
the Winding Tree ecosystem APIs.

## Step by step

Retrieving information from Winding Tree ecosystem is as easy
as calling a common REST API can be. At this time, there is
no authorization or registration needed.

### List hotels

The basic call to the API will give you back only the basic information.
You can limit the amount of returned results with `limit` query parameter.
The next page (if there is one) is linked in the `next` field. The `items`
field contains the information itself. The `warnings` and `errors` fields contains
possible events that might occur when retrieving the data from various external
storages or data that failed [validation](../data-validation/data-validation.md).

```sh
$ curl 'https://playground-api.windingtree.com/hotels?limit=2'

{
  "items": [
    {
      "location": {
        "latitude": 46.6546544,
        "longitude": 23.8745633
      },
      "name": "Central Hill Apartments",
      "id": "0x2869E8459B73Cd5599726c762053375dc186A0Dc"
    },
    {
      "location": {
        "latitude": 46.4528031,
        "longitude": 23.5229753
      },
      "name": "Guest House One Eyed Badger",
      "id": "0x79C5dD88b385e6822C80aC02461A69d4a04A6703"
    }
  ],
  "warnings": [],
  "errors": [],
  "next": "https://playground-api.windingtree.com/hotels?limit=2&fields=id,location,name&startWith=0xFfC10871d7d8c5648b386E1F6778d132c02Eea33"
}
```

If you would like to get particular details in the hotel listing, you can
with the use of `fields` query parameter. For nested fields, you can use the
dot notation, such as `location.latitude`. The `id` field is always present.

```sh
$ curl 'https://playground-api.windingtree.com/hotels?limit=2&fields=name,address,currency,location.latitude'

{
  "items": [
    {
      "name": "Central Hill Apartments",
      "address": {
        "road": "Park Lane",
        "houseNumber": "554",
        "postcode": "33317",
        "city": "Dragolm",
        "countryCode": "RO"
      },
      "currency": "RON",
      "location": {
        "latitude": 46.6546544
      },
      "id": "0x2869E8459B73Cd5599726c762053375dc186A0Dc"
    },
    {
      "name": "Guest House One Eyed Badger",
      "address": {
        "road": "Oak street",
        "houseNumber": "77",
        "postcode": "33313",
        "city": "Dragolm",
        "countryCode": "RO"
      },
      "currency": "RON",
      "location": {
        "latitude": 46.4528031
      },
      "id": "0x79C5dD88b385e6822C80aC02461A69d4a04A6703"
    }
  ],
  "warnings": [],
  "errors": [],
  "next": "https://playground-api.windingtree.com/hotels?limit=2&fields=name,address,currency,location.latitude&startWith=0xFfC10871d7d8c5648b386E1F6778d132c02Eea33"
}
```

The hotels are sorted by the order of creation in the Winding Tree Index,
there is currently no other sorting option.

### Get hotel's general information

You can of course ask for information on a single hotel by referring to it
with its blockchain address, called `id` in the data.

```sh
$ curl 'https://playground-api.windingtree.com/hotels/0x79C5dD88b385e6822C80aC02461A69d4a04A6703'

{
  "location": {
    "latitude": 46.4528031,
    "longitude": 23.5229753
  },
  "name": "Guest House One Eyed Badger",
  "description": "Small, private guest house in the quiet part of Dragolm. No kids, no pets. Smokers are welcome.",
  "contacts": {
    "general": {
      "email": "astorius.grumpstein@one-eyed-badger.com",
      "phone": "004057666711",
      "url": "https://one-eyed-badger.com"
    }
  },
  "address": {
    "road": "Oak street",
    "houseNumber": "77",
    "postcode": "33313",
    "city": "Dragolm",
    "countryCode": "RO"
  },
  "currency": "RON",
  "images": [
    "https://swarm.windingtree.com:443/bzz-raw:/8223315e04f9ee3ee9fb2c9e6d44dd92a60407bbc6d19430cb51595bf73d9fb0",
    "https://swarm.windingtree.com:443/bzz-raw:/1f9403308dc3d8db27285b7fe1d84695370b91968c935a6dbb4b43ad5d7f251a"
  ],
  "amenities": [
    "lounge",
    "fireplace",
    "bar"
  ],
  "updatedAt": "2019-01-23T09:40:19.626Z",
  "id": "0x79C5dD88b385e6822C80aC02461A69d4a04A6703"
}
```

You can use the query parameter `fields` here as well.

```sh
$ curl 'https://playground-api.windingtree.com/hotels/0x79C5dD88b385e6822C80aC02461A69d4a04A6703?fields=address.city,name'

{
  "address": {
    "city": "Dragolm"
  },
  "name": "Guest House One Eyed Badger",
  "id": "0x79C5dD88b385e6822C80aC02461A69d4a04A6703"
}
```

Similarily to `warnings` and `errors` for lists, when calling a detail endpoint a `x-data-validation-warning` response header informs the client of [data validation](../data-validation/data-validation.md) errors.

### Get hotel's inventory

There is a special endpoint for listing hotel's inventory. The `fields`
query parameter does not work here.

```sh
$ curl 'https://playground-api.windingtree.com/hotels/0x79C5dD88b385e6822C80aC02461A69d4a04A6703/roomTypes'

{
  "items": [
    {
      "name": "Single room",
      "description": "Room with a single bed",
      "totalQuantity": 8,
      "occupancy": {
        "min": 1,
        "max": 1
      },
      "amenities": [
        "ashtray",
        "minibar",
        "TV"
      ],
      "images": [
        "https://swarm.windingtree.com:443/bzz-raw:/29996d00d7b2b9e882ea1ae28ce221a873322de42eeadd5c38bf6a1c5173e7a4",
        "https://swarm.windingtree.com:443/bzz-raw:/49608659632835abf7cb83c068628e13ec39163da5e263c5d3843a1ca4d110d8"
      ],
      "id": "single-room",
      "updatedAt": "2019-01-23T09:40:19.626Z"
    },
    {
      "name": "Twin bed",
      "description": "Room with a twin bed",
      "totalQuantity": 4,
      "occupancy": {
        "min": 2,
        "max": 2
      },
      "amenities": [
        "ashtray",
        "minibar",
        "TV"
      ],
      "images": [
        "https://swarm.windingtree.com:443/bzz-raw:/29996d00d7b2b9e882ea1ae28ce221a873322de42eeadd5c38bf6a1c5173e7a4",
        "https://swarm.windingtree.com:443/bzz-raw:/49608659632835abf7cb83c068628e13ec39163da5e263c5d3843a1ca4d110d8"
      ],
      "id": "twin-bed",
      "updatedAt": "2019-01-23T09:40:19.626Z"
    }
  ],
  "warnings": [],
  "errors": []
}
```

You can also get a single room type on a special endpoint. You would use
the `id` property to address that.

```sh
$ curl 'https://playground-api.windingtree.com/hotels/0x79C5dD88b385e6822C80aC02461A69d4a04A6703/roomTypes/single-room'

{
  "name": "Single room",
  "description": "Room with a single bed",
  "totalQuantity": 8,
  "occupancy": {
    "min": 1,
    "max": 1
  },
  "amenities": [
    "ashtray",
    "minibar",
    "TV"
  ],
  "images": [
    "https://swarm.windingtree.com:443/bzz-raw:/29996d00d7b2b9e882ea1ae28ce221a873322de42eeadd5c38bf6a1c5173e7a4",
    "https://swarm.windingtree.com:443/bzz-raw:/49608659632835abf7cb83c068628e13ec39163da5e263c5d3843a1ca4d110d8"
  ],
  "id": "single-room",
  "updatedAt": "2019-01-23T09:40:19.626Z"
}
```

### Get hotel's pricing information

Pricing information in Winding Tree ecosystem is stored as a list
of rate plans and you can retrieve them for the whole hotel.

```sh
$ curl 'https://playground-api.windingtree.com/hotels/0x79C5dD88b385e6822C80aC02461A69d4a04A6703/ratePlans'

{
  "items": [
    [
      {
        "name": "Single room",
        "description": "Price per night for a standard single room.",
        "currency": "RON",
        "price": 158,
        "roomTypeIds": [
          "single-room"
        ],
        "id": "single-room",
        "updatedAt": "2019-01-23T09:40:19.626Z"
      },
      {
        "name": "Twin bed",
        "description": "Price per person per night for a twin bed room.",
        "currency": "RON",
        "price": 257,
        "roomTypeIds": [
          "twin-bed"
        ],
        "id": "twin-bed",
        "updatedAt": "2019-01-23T09:40:19.626Z"
      }
    ]
  ],
  "warnings": [],
  "errors": []
}
```

You can get a particular rate plan as well by using the `id` property in the
URL.

```sh
$ curl 'https://playground-api.windingtree.com/hotels/0x79C5dD88b385e6822C80aC02461A69d4a04A6703/ratePlans/single-room'

{
  "name": "Single room",
  "description": "Price per night for a standard single room.",
  "currency": "RON",
  "price": 158,
  "roomTypeIds": [
    "single-room"
  ],
  "id": "single-room",
  "updatedAt": "2019-01-23T09:40:19.626Z"
}
```

Or you can retrieve only rate plans matched to a certain room type.

```sh
curl 'https://playground-api.windingtree.com/hotels/0x79C5dD88b385e6822C80aC02461A69d4a04A6703/roomTypes/single-room/ratePlans'

{
  "items": [
    {
      "name": "Single room",
      "description": "Price per night for a standard single room.",
      "currency": "RON",
      "price": 158,
      "roomTypeIds": [
        "single-room"
      ],
      "id": "single-room",
      "updatedAt": "2019-01-23T09:40:19.626Z"
    }
  ],
  "warnings": [],
  "errors": []
}
```

### Get hotel's availability

Read API is serving availability data in a raw form, all aggregations and
any other additional logic has to performed by the API client.

Availability can be retrieved for the whole hotel.

```sh
$ curl 'https://playground-api.windingtree.com/hotels/0x79C5dD88b385e6822C80aC02461A69d4a04A6703/availability'

{
  "items": [
    {
      "roomTypeId": "single-room",
      "date": "2018-12-24",
      "quantity": 0
    },
    {
      "roomTypeId": "single-room",
      "date": "2018-12-25",
      "quantity": 5
    },
    {
      "roomTypeId": "single-room",
      "date": "2018-12-26",
      "quantity": 0
    },
    {
      "roomTypeId": "twin-bed",
      "date": "2018-12-24",
      "quantity": 3
    },
    {
      "roomTypeId": "twin-bed",
      "date": "2018-12-25",
      "quantity": 2
    },
    {
      "roomTypeId": "twin-bed",
      "date": "2018-12-26",
      "quantity": 0
    }
  ],
  "warnings": [],
  "errors": [],
  "updatedAt": "2019-01-23T09:40:19.626Z"
}
```

Or of course for a single room type.

```sh
$ curl 'https://playground-api.windingtree.com/hotels/0x79C5dD88b385e6822C80aC02461A69d4a04A6703/roomTypes/single-room/availability'

{
  "items": [
    {
      "roomTypeId": "single-room",
      "date": "2018-12-24",
      "quantity": 0
    },
    {
      "roomTypeId": "single-room",
      "date": "2018-12-25",
      "quantity": 5
    },
    {
      "roomTypeId": "single-room",
      "date": "2018-12-26",
      "quantity": 0
    }
  ],
  "warnings": [],
  "errors": [],
  "updatedAt": "2019-01-23T09:40:19.626Z"
}
```

## Where to next

- [How to calculate prices](how-to-build-a-booking-page.md#checking-availability-and-getting-a-price)
- Searching for inventory
