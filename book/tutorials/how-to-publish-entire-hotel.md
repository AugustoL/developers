# How to publish bulk inventory for an entire hotel

In this slightly contrived example you will learn about
additional data that you can publish to Winding Tree
ecosystem when you are managing an entire hotel.

## Requirements

* Working with the Write API
  > #### Info
  >
  > Learn how to [publish inventory](how-to-publish-inventory.md)

## Step by step

There is no big difference between
[publishing a single apartment](how-to-publish-inventory.md)
and an entire hotel in terms of the process. What is probably
a little different is how rich the provided data will have to be
and how many options of the Winding Tree ecosystem the hotel will
use. We will also cover how to update the ever-changing data such
as prices.

### Preparing the data

#### General description

In addition to the basics covered in [this tutorial](how-to-publish-inventory.md),
you can add more information to the general description.

In the field `images`, you are able to list URLs leading
to images describing your hotels which can later be displayed
on the Travel agency website. There is currently no restriction
as to where to host your pictures, but we recommend to make them
accessible via HTTP. We also recommend to use HD pictures
that look well on modern devices. It should be up to the data
consumer to adjust the sizes of these pictures.

```json
{
  "images": [
    "https://swarm.windingtree.com:443/bzz-raw:/ac9ee64f4324f20e89d7ea219954184f357c9a10ba4de4e1d238053d5f86a9b0",
    "https://swarm.windingtree.com:443/bzz-raw:/d71ca677b699764d378ebf15851ce7bc0161067b44ca8d628760d88d92870941",
    "https://swarm.windingtree.com:443/bzz-raw:/50cbcd7c03d66e0c7be4e76d2e36254494366d7e80d66b9839d588af96a237ff"
  ]
}
```

!!!TODO!!! https://github.com/windingtree/wiki/pull/97
!!!TODO!!! add operator, category, language declaration

You are also able to list hotel-wide `amenities`. So far, it's
a free text, but we plan to change it in the future to make it
easily searchable across many hotels.

```json
{
  "amenities": [
    "restaurant",
    "vending machine",
    "parking"
  ]
}
```

The most complicated part are the cancellation policies. In any case,
you have to specify `defaultCancellationAmount` which is the cost
of cancellation in percents of the total price. 0 means everything
is returned back to the customer, 100 means non-refundable.

Anything more complicated is optional and you can specify multiple
cancellation policies that may differ in the following:

* When are they applicable - for example you may have different policies
  in winter and summer
* How much time before arrival are they applicable - for example you
  may return smaller amount the closer you are to the date of arrival. We
  call this `deadline`.

This information is important as a list of cancellation fees is part
of the Winding Tree's Booking protocol.

The following specification means _for the traveller_ that:

* If you cancel between January 1 and June 30
  * If you cancel more than 30 days prior to arrival, you will get back 90%
  * If you cancel between 30 and 5 days prior to arrival, you will get back 75%
  * If you cancel less than 5 days prior to arrival, you will get back 20%
* If you cancel any time after July 1
  * If you cancel more than 10 days prior to arrival, you will get back 90%
  * If you cancel less than 10 days prior to arrival, you will get back 10%

```json
{
  "defaultCancellationAmount": 10,
  "cancellationPolicies": [
    {
      "from": "2019-01-01",
      "to": "2019-06-30",
      "deadline": 30,
      "amount": 25
    },
    {
      "from": "2019-01-01",
      "to": "2019-06-30",
      "deadline": 5,
      "amount": 80
    },
    {
      "from": "2019-07-01",
      "to": "2019-12-31",
      "deadline": 10,
      "amount": 90
    }
  ]
}
```

#### Inventory

!!!TODO!!! https://github.com/windingtree/wiki/pull/97
!!!TODO!!! add category

You can specify images and amenities also for your room types
in the same way as for the whole hotel.

```json
{
  "images": [
    "https://swarm.windingtree.com:443/bzz-raw:/ac9ee64f4324f20e89d7ea219954184f357c9a10ba4de4e1d238053d5f86a9b0",
    "https://swarm.windingtree.com:443/bzz-raw:/d71ca677b699764d378ebf15851ce7bc0161067b44ca8d628760d88d92870941",
    "https://swarm.windingtree.com:443/bzz-raw:/50cbcd7c03d66e0c7be4e76d2e36254494366d7e80d66b9839d588af96a237ff"
  ],
  "amenities": [
    "TV",
    "phone",
    "internet"
  ]
}
```

#### Prices

There are also many more options in pricing design.

Apart from using a single, primary currency on the hotel level,
you are able to specify a `currency` for every rate plan. With
this feature, you are able to declare prices in multiple currencies
as well. Winding Tree at this moment does not provide any conversion
rates.

You can also easily restrict when the rate plan can be applied. You
have three options how to do it. You can declare when the rate plan can be used:

* based on the date of the booking \(`availableForReservation`\),
* based on the date of stay \(`availableForTravel`\),
* based on other factors \(`restrictions`, we might add more\):
  * length of stay,
  * how many days before the arrival the booking happens \(`bookingCutOff`\).

Last but not least, you can modify the base price of every rate plan when
certain conditions \(`modifiers`\), such as minimal number of guests, age or length of stay,
are met. These come in handy for example when a second person
in the room gets a huge discount. We support the modification either based on percents
or as an absolute amount.

The following example \(when added to the required fields of a rate plan\) means,
that the price is in EUR, can be used for bookings that happen in year 2018 and
book rooms for the first half of 2019. If a single person is travelling, she will
pay 100 EUR. If two people are coming, they will also pay 100 EUR \(two times
half the price\). If three people are coming, they will pay each 50% of base price
or 150 EUR.

```json
{
  "price": 100,
  "currency": "EUR",
  "availableForReservation": {
    "from": "2018-01-01",
    "to": "2018-12-31"
  },
  "availableForTravel": {
    "from": "2019-01-01",
    "to": "2019-06-30"
  },
  "modifiers": [
    {
      "adjustment": -50,
      "unit": "percentage",
      "conditions": {
        "minOccupants": 2
      }
    }
  ]
}
```

#### Availability

For availability, you can gain a bit more control with the concept
called `restrictions`. They basically declare that on certain days,
it's not possible to arrive or depart.

The example is telling the world that it is:

* Possible to arrive on December 23
* Possible to depart on December 23
* Impossible to arrive on December 24
* Possible to depart on December 24
* Possible to arrive on December 25
* Impossible to depart on December 25
* Possible to arrive on December 26
* Possible to depart on December 26

```json
[
  {
    "roomTypeId": "room-1",
    "date": "2018-12-23",
    "quantity": 4
  },
  {
    "roomTypeId": "room-1",
    "date": "2018-12-24",
    "quantity": 4,
    "restrictions": {
      "noArrival": true
    }
  },
  {
    "roomTypeId": "room-1",
    "date": "2018-12-25",
    "quantity": 4,
    "restrictions": {
      "noDeparture": true
    }
  },
  {
    "roomTypeId": "room-1",
    "date": "2018-12-26",
    "quantity": 4
  },
]
```

### Uploading the data

There is no difference in registering your inventory, so in order
to list your hotel offering, we will call the Write API's `/hotels`
endpoint. To be able to do that, you need to have your Write API
[account ready and configured](how-to-setup-write-api.md).

```sh
$ curl -X POST https://playground-write-api.windingtree.com/hotels \
  -H 'Content-Type: application/json' \
  -H 'X-Access-Key: write-api-account-access-key' \
  -H 'X-Wallet-Password: ethereum-wallet-password' \
  --data @hotel.json
```

In the response, you will get an Ethereum address where your hotel
is registered. That address belongs only to the holder of the used
Ethereum wallet and noone else can modify the record stored there.

```json
{"address":"0xA603FF7EA9A1B81FB45EF6AeC92A323a88211f40"}
```

### Updating the data

As your hotel gets some traffic, you will probably become in need
of updating your inventory, prices or availability.
If you are using Write API, you have two options.

#### Partial updates

As we've shown before, when communicating with Write API the data
is separated into three sections: `description`, `ratePlans` and `availability`.
Due to the nature of Winding Tree's ecosystem storage design, you
can only update a section as a whole. It is intentionally not possible to
partially change a single field with a single API call.

So, in order to update the price from 100 EUR to 200 EUR, the workflow with
Write API looks like this:

1. Prepare the data into `update.json` file.

   ```json
    {
      "ratePlans": [
        {
          "price": 200,
          "currency": "EUR",
          "availableForReservation": {
            "from": "2018-01-01",
            "to": "2018-12-31"
          },
          "availableForTravel": {
            "from": "2019-01-01",
            "to": "2019-06-30"
          },
          "modifiers": [
            {
              "adjustment": -50,
              "unit": "percentage",
              "conditions": {
                "minOccupants": 2
              }
            }
          ]
        }
      ]
    }
   ```

2. Send a partial update

   ```sh
    $ curl -X PATCH https://playground-write-api.windingtree.com/hotels/0xA603FF7EA9A1B81FB45EF6AeC92A323a88211f40 \
      -H 'Content-Type: application/json' \
      -H 'X-Access-Key: write-api-account-access-key' \
      -H 'X-Wallet-Password: ethereum-wallet-password' \
      --data @update.json
   ```

#### Full reupload

If you for some reason need to change all of the data at the same time,
you can. Just use `PUT` method instead of `PATCH`.

```sh
$ curl -X PUT https://playground-write-api.windingtree.com/hotels/0xA603FF7EA9A1B81FB45EF6AeC92A323a88211f40 \
  -H 'Content-Type: application/json' \
  -H 'X-Access-Key: write-api-account-access-key' \
  -H 'X-Wallet-Password: ethereum-wallet-password' \
  --data @all-data.json
```

## Where to next

* [Publishing inventory and availability offering for many hotels](how-to-publish-many-hotels.md)
* [How to accept bookings?](how-to-accept-bookings.md)



