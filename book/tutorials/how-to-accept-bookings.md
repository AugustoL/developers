# How to accept bookings?

In this tutorial, you will learn about the booking process
in Winding Tree ecosystem.

## Requirements

- Working with the Write API
> ####Info
> Learn how to [publish inventory](how-to-publish-inventory.md)

## Step by step

Booking in Winding Tree ecosystem is done in a decentralized way.
Every hotel should advertise a `bookingUri` in its data published
through Write API. This `bookingUri` should be pointing to REST
API which is implementing the booking protocol.

While setting up your server, don't forget about proper
[Cross-origin resource sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
setup since the API might be called from various places.

### Booking protocol

The booking protocol is really just a 
<a href="/apis/wt-booking-api.html" target="_blank">description of the REST API</a>.
It currently contains an endpoint to create new booking and an
endpoint to cancel an existing one.

Because this booking scheme is totally decentralized, stateless
and may be quite disconnected in time from the actual offer published
on Winding Tree, the booking request should contain all of the data that
the traveller and the provider agree on.

First, it contains information about the customer itself. Optional fields
include a postal `address` and `phone`. It is absolutely necessary that
the provider gets a means of contact with the actual customer.

```json
{
  "customer": {
    "name": "Elizabeth",
    "surname": "Crown",
    "email": "elizabeth@example.com"
  }
}
```

Then there's the information about the booking itself. It contains mainly
information about the guests and which rooms were booked. It is even ready
for allocating guests into particular rooms.

```json
{
  "booking": {
    "arrival": "2019-02-03",
    "departure": "2019-02-10",
    "guestInfo": [
      {
        "id": "guest-0", "name": "Elizabeth", "surname": "Crown", "age": 25
      },
      {
        "id": "guest-1", "name": "Philip", "surname": "Crown", "age": 30
      }
    ],
    "rooms": [
      {
        "id": "room-1",
        "guestInfoIds": ["guest-0", "guest-1"]
      }
    ]
  }
}
```

And finally the information about the price that the guest is proposing to the
hotel. Apart from the total price, this also contains information about
possible cancellation fees. A hotel can refuse to accept the booking if the
submitted price is just not acceptable.

```json
{
  "pricing": {
    "currency": "EUR",
    "total": 100,
    "cancellationFees": [
      {
        "from": "2019-02-01",
        "to": "2019-02-03",
        "amount": 50
      }
    ]
  }
}
```

All of this information combined (also with the appropriate `hotelId` and an
optional textual note) will be sent to the appropriate endpoint on the
declared `bookingUri`.

```json
{
  "customer": {
    "name": "Elizabeth",
    "surname": "Crown",
    "email": "elizabeth@example.com"
  },
  "booking": {
    "arrival": "2019-02-03",
    "departure": "2019-02-10",
    "guestInfo": [
      {
        "id": "guest-0", "name": "Elizabeth", "surname": "Crown", "age": 25
      },
      {
        "id": "guest-1", "name": "Philip", "surname": "Crown", "age": 30
      }
    ],
    "rooms": [
      {
        "id": "room-1",
        "guestInfoIds": ["guest-0", "guest-1"]
      }
    ]
  },
  "pricing": {
    "currency": "EUR",
    "total": 100,
    "cancellationFees": [
      {
        "from": "2019-02-01",
        "to": "2019-02-03",
        "amount": 50
      }
    ]
  }
}
```

```sh
$ curl -X POST https://hotel-booking.com/booking \
  -H 'Content-Type': 'application/json' \
  --data @booking.json

{
  "id": "some-booking-reference",
  "status": "confirmed"
}
```

The booking server should of course validate all of the incoming data
and if the proposed conditions are OK with the hotel, it should accept
the booking. It can either make it `confirmed` or just `pending` which
means that there might be another process in place.

### Sample Booking API

We have a [sample implementation](https://github.com/windingtree/wt-booking-api)
in NodeJS alongside the Booking protocol specification. *It is definitely
not meant for any production use*, but merely as a demonstration of what
should be going on in a custom implementation of Booking API.

If you already have a Booking system, it should be only a matter of implementing
a data format adapter.

## Where to next

- [How to build a Booking page](how-to-build-a-booking-page.md)
