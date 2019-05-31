# Data validation

As `wt-read-api` serves upstream data (that was not necessarily uploaded by `wt-write-api`) we can't make
any assumptions about the content. To allow the client to work with fetched data comfortably, a validation
against an [OpenApi definition](../data-model.md) is performed with 3 possible outcomes:
- data validation is ok __and__ the declared `dataFormatVersion` matches the version supported by the `wt-read-api` instance
- data validation is ok __but__ the declared `dataFormatVersion` differs - in that case a warning is returned, which the client
should interpret as "the data is probably ok, but the semantics might have changed". It is up to the client if such data should be considered.
- data validation fails - raises an error and shouldn't be used

The convention is to return 3 separate arrays:
```js
  "items": [ ... ],
  "warnings": [ ... ],
  "errors": [ ... ],
```

Detail endpoints return validation warnings in the `x-data-validation-warning` response header (with 200 HTTP code).
Validation errors are returned with 422 code.

See the [schema definitions](https://github.com/windingtree/wt-read-api/blob/master/docs/swagger.yaml) for more details.

In case of an error only `id` field is returned, warnings contain the whole fetched data.

```js
$ curl 'https://playground-api.windingtree.com/hotels'

{
  "items": [],
  "warnings": [
    {
      "error": "Upstream hotel data format validation failed: Error: Validation did not pass.",
      "originalError": {
        "valid": true,
        "errors": [
          "Unsupported data format version 0.1.0. Supported versions: 0.2.0"
        ]
      },
      "data": {
        "dataFormatVersion": "0.1.0",
        "name": "Mazurka",
        "location": {
          "latitude": 35.89421911,
          "longitude": 139.94637467
        },
        "id": "0x02b11DCf1bBb203C1e7d0b396Ff0d9100131f95C"
      }
    }
  ],
  "errors": [
    {
      "error": "Upstream hotel data format validation failed: Error: Validation did not pass.",
      "originalError": {
        "valid": false,
        "errors": [
          "Error: name is a required field"
        ]
      },
      "data": {
        "id": "0x0a526820F92d8b55553962857a27928Af2C145Dd"
      }
    }
  ]
}
```


At the moment, `wt-read-api` only supports one version at a time. You can find out which one using the `/` endpoint
```js
$ curl 'https://playground-api.windingtree.com/'

{
  "dataFormatVersion": "0.2.0",
  ...
}
```