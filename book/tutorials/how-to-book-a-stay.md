# How to book a stay

In this tutorial, you will learn how to actually book something.

## Requirements

- [Winding Tree Booking API](https://github.com/windingtree/wt-write-api) URL.
> ####Info
> Learn how to [discover](how-to-pick-environment.md), [setup](how-to-accept-bookings.md) and [make discoverable]()
the Winding Tree ecosystem APIs.

## Step by step

Booking in Winding Tree ecosystem is done in a decentralized way.
Every hotel should advertise a `bookingUri` in its data published
through Write API. This `bookingUri` should be pointing to REST
API which is implementing
<a href="/apis/wt-booking-api.html" target="_blank">the booking protocol</a>.

**Note**: The URI is not the booking endpoint itself. For example,
the Booking API is running on `https://example.com` (that's the `bookingUri`),
but the bookings themselves are supposed to go to `https://example.com/booking`.
The endpoint names are an integral part of the booking protocol.

In order to be able to actually book a room, we have to construct
a booking request in the client application. That has to contain
all of the necessary information so that the hotel can validate and
accept the booking request.

### Customer information

Of course, we have to know who is doing the booking and the hotel has
to have at least some contact information. The minimal customer information
might look like this:

```json
{
  "name": "Elizabeth",
  "surname": "Crown",
  "email": "elizabeth@example.com"
}
```

### Booking information

Then there's the information about the booking itself. Again, the
minimal form looks like this:

```json
{
  "arrival": "2019-03-01",
  "departure": "2019-03-05",
  "guestInfo": [
    { "id": "guest-1" },
    { "id": "guest-2" }
  ],
  "rooms": [
    { "id": "room-1", "guestInfoIds": ["guest-1", "guest-2"] }
  ]
}
```

It might seem unnecessary to pass generic guest `id`, but it's a format
that is easily extensible for more advanced use cases which we support,
such as:

- Booking multiple rooms
- Assigning guests to rooms
- Transferring personal information about guests (name, age)

### Pricing information

The final section of a booking request contains the price and all other
money-related information. What might be new to you is the `cancellationFees`
field that contains conditions under which the booking can
actually be cancelled by the customer. In our example, if a customer cancels
the booking at any time prior to the arrival, it will cost him 30% of the price,
so in this case, the refunded amount will be just about GBP 224.

```json
{
  "currency": "GBP",
  "total": 320,
  "cancellationFees": [
    {
      "from": "2019-02-26",
      "to": "2019-03-01",
      "amount": 30
    }
  ]
}
```

Both the price and cancellation fees are computed from the data distributed
via Winding Tree platform. To compute the data for an actual booking, you can
use our open-source Javascript pricing library
[@windingtree/wt-pricing-algorithms](https://github.com/windingtree/wt-pricing-algorithms).

Optionally, if you need additional pricing information, you can use the `components`
property which can contain a day-by-day and guest-by-guest breakdown of the
price. It might look like this:

```json
{
  "components": {
    "stay": [
      {
        "date": "2019-03-02",
        "subtotal": 80,
        "guests": [
          {
            "guestId": "guest-1",
            "ratePlanId": "early-spring",
            "resultingPrice": 50
          },
          {
            "guestId": "guest-2",
            "ratePlanId": "early-spring",
            "resultingPrice": 30
          }
        ]
      },
      {
        "date": "2019-03-03",
        "subtotal": 80,
        "guests": [
          {
            "guestId": "guest-1",
            "ratePlanId": "early-spring",
            "resultingPrice": 50
          },
          {
            "guestId": "guest-2",
            "ratePlanId": "early-spring",
            "resultingPrice": 30
          }
        ]
      },
      {
        "date": "2019-03-04",
        "subtotal": 80,
        "guests": [
          {
            "guestId": "guest-1",
            "ratePlanId": "early-spring",
            "resultingPrice": 50
          },
          {
            "guestId": "guest-2",
            "ratePlanId": "early-spring",
            "resultingPrice": 30
          }
        ]
      },
      {
        "date": "2019-03-05",
        "subtotal": 80,
        "guests": [
          {
            "guestId": "guest-1",
            "ratePlanId": "early-spring",
            "resultingPrice": 50
          },
          {
            "guestId": "guest-2",
            "ratePlanId": "early-spring",
            "resultingPrice": 30
          }
        ]
      }
    ]
  }
}
```

### Putting everything together

If we combine everything together, we will get a `booking-request.json` which in addition
to everything we've said, contains a hotel's ID (Ethereum address).

```json
{
  "hotelId": "0xD8b8aF90986174d5c5558aAC0905AA1DB2Ee41ce",
  "customer": {
    "name": "Elizabeth",
    "surname": "Crown",
    "email": "elizabeth@example.com"
  },
  "booking": {
    "arrival": "2019-03-01",
    "departure": "2019-03-05",
    "guestInfo": [
      { "id": "guest-1" },
      { "id": "guest-2" }
    ],
    "rooms": [
      { "id": "room-1", "guestInfoIds": ["guest-1", "guest-2"] }
    ]
  },
  "pricing": {
    "currency": "GBP",
    "total": 320.23,
    "cancellationFees": [
      {
        "from": "2019-02-26",
        "to": "2019-03-01",
        "amount": 30
      }
    ]
  }
}
```

Another optional field that you can set is `origin` which can hold a name
or identifier of the system where the booking happens - such as a travel
agency or an online portal. This is useful to track your traffic sources.

And finally, we tell the hotel that we want to book the property.

```sh
$ curl -X POST https://fancy-blockchain-hotel-booking.com/booking \
  -H 'Content-Type: application/json' \
  --data @booking-request.json
```

In case the hotel accepts the proposed conditions, the response should
contain some form of a reference ID and status (currently `accepted` or `pending`).

```json
{
  "id": "booking-id-54687",
  "status": "pending"
}
```

We plan to extend the protocol in the future to accomodate the typical next
steps such as payment processing.

## Where to next

- [How to accept bookings?](how-to-accept-bookings.md)
- [How to build a booking page?](how-to-build-a-booking-page.md)