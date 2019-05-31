# How to build a Hotel Booking page

In this tutorial, you will learn how to create a Booking website
for a single hotel registered in Winding Tree.

## Requirements

- Basic knowledge of HTML and Javascript.
- Ethereum address of your selected hotel.
> ####Info
> Learn how to [publish inventory](how-to-publish-inventory.md)
- [Winding Tree Read API](https://github.com/windingtree/wt-read-api) URL.
> ####Info
> Learn how to [discover](how-to-pick-environment.md), [setup](how-to-setup-read-api.md) and [make discoverable]()
the Winding Tree ecosystem APIs.

## Step by step

We will create a single simple HTML page with four parts:

- General description
- Inventory
- Priced offer
- Booking form

### Initial setup

Here's a boilerplate HTML where we will put all of the other code:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Winding Tree simple sample booking page</title>
  </head>
  <body>
    <div id="error"></div>
    <div id="hotel-description">
      <h1 id="hotel-name"></h1>
      <div id="hotel-address"></div>
    </div>
    <div id="stay-details">
      <p>
        <label for="room-types-select">Select a room</label>
        <select id="room-types-select" name="room-types-select"></select>
      </p>
    </div>
    <div id="offer">
      <div id="offer-price"></div>
      <div id="offer-quantity"></div>
    </div>
    <script type="text/javascript"></script>
  </body>
</html>

```

### Getting the hotel data

To make things easy, we will get all of the data in a single `GET` request.
This is not the most optimal way, but it will make this tutorial shorter. In a
real-life application, you would probably load the data about availability and
prices only when needed. We are also not loading everything, because we want to
keep the page as simple as possible.

```html
<script type="text/javascript">
  (() =>{
    const errorDiv = document.getElementById('error');
    const wtReadApi = 'https://playground-api.windingtree.com';
    const hotelId = '0xD8b8aF90986174d5c5558aAC0905AA1DB2Ee41ce';
    const fields = [
      'name',
      'address',
      'currency',
      'cancellationPolicies',
      'defaultCancellationAmount',
      'bookingUri',
      'roomTypes.id',
      'roomTypes.name',
      'roomTypes.occupancy',
      'availability',
      'ratePlans',
    ];
    const displayHotelData = (hotelData) => {
      console.log(hotelData);
    }
    fetch(`${wtReadApi}/hotels/${hotelId}?fields=${fields.join(',')}`)
      .then((response) => {
        if (response.status > 299) {
          throw new Error('Bad server response.');
        }
        return response.json();
      })
      .then(displayHotelData)
      .catch((err) => {
        errorDiv.innerHTML = err.toString();
      })
  })();
</script>
```

After adding this code to the `script` section and refreshing the page in 
your browser, you should see hotel data in the browser's console. Of course,
you can change the `hotelId` and `wtReadApi` variables to work with different hotel
in a different Winding Tree environment.

We would of course like to show the hotel information to the visitor, so let's do
exactly that.

```js
const displayHotelData = (hotelData) => {
  const address = `
    <span>${hotelData.address.road} ${hotelData.address.houseNumber},</span>
    <span>${hotelData.address.city} ${hotelData.address.postcode}</span>
    <span>${hotelData.address.countryCode}</span>
  `;
  document.getElementById('hotel-name').innerHTML = hotelData.name;
  document.getElementById('hotel-address').innerHTML = address;
  const roomTypesSelect = document.getElementById('room-types-select');
  hotelData.roomTypes.map((rt) => {
    roomTypesSelect.insertAdjacentHTML('beforeend', `
      <option id="rt-${rt.id}" value="${rt.id}">${rt.name}</option>
    `);
  });
};
```

After this step, you should see the hotel data in the page itself!

![First checkpoint](../assets/booking-page-0.png)

### Checking availability and getting a price

Now, this part is tricky! To simplify things a little bit, we will
consider this to be a *personal* booking page made for a lovely couple,
let's call them Elizabeth and Philip.

In order to be able to determine availability and price of a particular 
room type, we will use our open-source Javascript pricing library
[@windingtree/wt-pricing-algorithms](https://github.com/windingtree/wt-pricing-algorithms)
which we can easily load from [unpkg](https://unpkg.com).

```html
<script type="text/javascript" src="https://unpkg.com/@windingtree/wt-pricing-algorithms@0.5.3/dist/umd/wt-pricing-algorithms.js"></script>
```

This will make it available under `window.wtPricingAlgorithms`. Make sure to place
it *before* our existing Javascript `script` tag.

Now, to check availability and compute a price, we need certain informations
regarding the travellers:

- Date of arrival
- Date of departure
- List of guests - the prices can be based on number of guests and their age

As said before, to make things a little easier, we will have a list of
guests hardcoded:

```js
const guests = [
  {"name": "Elizabeth", "surname": "Crown", "age": 25},
  {"name": "Philip", "surname": "Crown", "age": 30},
];
```

And for the dates, we will add two user inputs.

```html
<p>
  <label for="arrival-date">Date of arrival</label>
  <input type="date" id="arrival-date" name="arrival-date" />
</p>
<p>
  <label for="arrival-date">Date of departure</label>
  <input type="date" id="departure-date" name="departure-date" />
</p>
```

Now we have to put the pricing library to a good use. We will
do the price computation every time any of the input values change.
We will also use a [dayjs](https://github.com/iamkun/dayjs) library
to smoothly work with various possible date formats used around the
world.

```js
const roomTypesSelect = document.getElementById('room-types-select');
const arrivalDateInput = document.getElementById('arrival-date');
const departureDateInput = document.getElementById('departure-date');
const recomputePriceAndAvailability = () => {
  const roomType = roomTypesSelect.value;
  const arrival = dayjs(arrivalDateInput.value);
  const departure = dayjs(departureDateInput.value);
  // Basic validation
  if (!roomType ||
      !arrival.isValid() ||
      !departure.isValid() ||
      departure.isBefore(arrival) ||
      arrival.isBefore(dayjs())
    ) {
    return;
  }
  const pc = new window.wtPricingAlgorithms.prices.PriceComputer(
    hotelDataFromApi.roomTypes,
    hotelDataFromApi.ratePlans,
    hotelDataFromApi.currency
  );
  const resultingPrice = pc.getBestPrice(
    new Date(), // Booking date
    arrival,
    departure,
    guests,
    hotelDataFromApi.currency,
    roomType
  )
    // We might not get a price - room is meant for a different number of people or pricing data is not available
    .filter((p) => p.id === roomType && p.prices.length);
  if (resultingPrice.length) {
    // Different price resolution strategies might return more than one price
    const actualPrice = resultingPrice[0].prices[0];
    document.getElementById('offer-price').innerHTML = `Price ${actualPrice.total.format()} ${actualPrice.currency}`;
  } else {
    document.getElementById('offer-price').innerHTML = 'Price unavailable';
  }
}
roomTypesSelect.addEventListener('change', recomputePriceAndAvailability);
arrivalDateInput.addEventListener('change', recomputePriceAndAvailability);
departureDateInput.addEventListener('change', recomputePriceAndAvailability);
```

If we are lucky, we will get a price. But what about the availability? Well,
let's add it to the part where we come up with the price.

```js
const indexedAvailability = window.wtPricingAlgorithms.availability.indexAvailability(hotelDataFromApi.availability.roomTypes);
const roomAvailability = window.wtPricingAlgorithms.availability.computeAvailability(
  arrival,
  departure,
  guests.length,
  hotelDataFromApi.roomTypes,
  indexedAvailability
).filter((ra) => ra.roomTypeId === roomType && ra.quantity);
if (roomAvailability.length) {
  const actualQuantity = roomAvailability[0].quantity;
  document.getElementById('offer-quantity').innerHTML = `Available: ${actualQuantity}`;
} else {
  // Room might be sold out, unavailable for arrival or departure on given dates etc.
  document.getElementById('offer-quantity').innerHTML = 'Unavailable';
}
```

After this last step in this section, the website should look like on the
screenshot below. You can play around with it to see that the data gets
recomputed every time the values change.

![Second checkpoint](../assets/booking-page-1.png)

### Sending a booking to the hotel

Now we are almost able to call the [Booking API](https://github.com/windingtree/wt-booking-api).
But if we check the <a href="/apis/wt-booking-api.html" target="_blank">API documentation</a>,
it's obvious that we are still missing a few pieces of information.

First, we need a book button

```html
<button type="button" disabled="disabled" id="book-button">Book a room!</button>
```

that gets activated when the room is available and we know for how much.

```js
if (resultingPrice.length && roomAvailability.length) {
  bookButton.removeAttribute('disabled');
}
```

So what should happen after the button is clicked? We have to assemble
all data required for the Booking API. Let's deal with that one by one.

First are information on the `customer`. Since we consider this to be a private
page, we can hardcode them in.

```js
bookButton.addEventListener('click', () => {
  const customer = {
    name: 'Elizabeth',
    surname: 'Crown',
    email: 'elizabeth@example.com',
  };
});
```
The `booking` information needs to be slightly adjusted from what we already
have.

```js
const booking = {
  arrival: dayjs(arrivalDateInput.value).format('YYYY-MM-DD'),
  departure: dayjs(departureDateInput.value).format('YYYY-MM-DD'),
  guestInfo: guests.map((g, i) => Object.assign({id: `guest-${i}`}, g)),
  rooms: [
    {
      id: roomTypesSelect.value,
      guestInfoIds: ['guest-0', 'guest-1']
    }
  ]
};
```

The only thing we have not yet encountered are `cancellationFees` in the
`pricing` section. They contain conditions under which the booking can
actually be cancelled by the customer. Luckily, the pricing library can
compute them for us. All we have to do is ask.

```js
const actualPrice = resultingPrice[0].prices[0];
const pricing = {
  currency: actualPrice.currency,
  total: actualPrice.total.value,
  cancellationFees: window.wtPricingAlgorithms.cancellationFees.computeCancellationFees(
    new Date(),
    dayjs(arrivalDateInput.value),
    hotelDataFromApi.cancellationPolicies,
    hotelDataFromApi.defaultCancellationAmount
  )
};
```

By combining everything together, we will end up with the booking request
which we can send to the Booking API instance declared by the hotel itself.

```js
fetch(`${hotelDataFromApi.bookingUri}/booking`, {
  method: 'POST',
  body: JSON.stringify({
    customer: customer,
    hotelId: hotelId,
    booking: booking,
    pricing: pricing,
  }),
  headers: {
    'Content-Type': 'application/json',
  },
})
.then((response) => {
  if (response.status > 299) {
    throw new Error('Cannot save booking!');
  }
  return response.json();
})
.then((data) => {
  errorDiv.innerHTML = `Your booking was accepted with the state ${data.status} under ID ${data.id}`;
})
.catch((err) => {
  errorDiv.innerHTML = err.toString();
});
```

![Third checkpoint](../assets/booking-page-2.png)

And that's it - you can see that the majority of heavy-lifting is done
by existing tools and libraries and all we had to do is to work with the 
data in the browser.

## Where to next

- [Full code of this example](https://gist.github.com/JirkaChadima/262c06fbd0e0f00235c5a695c567a64b/45bdff2f17d6b979e76b5e785fb0d1fbb68f0029)
- How to build a Travel Agency
