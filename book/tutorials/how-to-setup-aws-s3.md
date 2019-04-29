# How to setup AWS S3

Winding Tree [Write API](https://github.com/windingtree/wt-write-api) supports
[AWS S3](https://aws.amazon.com/s3/) as an off-chain HTTPS storage out of the box.
In this tutorial, you will learn how to set it up properly.

## Requirements

- [Winding Tree Write API](https://github.com/windingtree/wt-write-api) URL.
> ####Info
> Learn how to [discover](how-to-pick-environment.md), [setup](how-to-setup-write-api.md) and [make discoverable]()
the Winding Tree ecosystem APIs.
- [Selected HTTPS off-chain storage](how-to-pick-off-chain-storage.md).

## Step by step

### Getting an AWS account

An [official tutorial](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/)
describes this quite well.

### Create and setup an S3 bucket

Navigate to [S3 management console](https://s3.console.aws.amazon.com/s3/home)
and click the *Create bucket* button. Pick a name for your bucket.
The most important thing here is to setup the bucket so it is accessible from
the internet. Without it, nobody will be able to read your data.

So in the *Set permissions* section, make sure that all of the boxes are unticked.

![S3 Bucket permission dialogue](../assets/aws-s3-0.png)

Another thing to do on your newly created bucket is to properly setup
[Cross-origin resource sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).
While this is not needed for API communication, it will allow the platform users
to access your data files directly from the browser.

In the bucket detail, navigate to the *Permissions* tab and under *CORS configuration*,
fill in this XML snippet. This allows any webpage to read the data directly from
your bucket.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
<CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <MaxAgeSeconds>3000</MaxAgeSeconds>
    <AllowedHeader>Authorization</AllowedHeader>
</CORSRule>
</CORSConfiguration>
```

### Create new user with appropriate permission policy

Since AWS credentials are stored in the Write API, you should create a separate
AWS user for each hotel that is using your S3 storage. Navigate to the 
[IAM section](https://console.aws.amazon.com/iam/) and go to *Users*. Click the
*Add user* button. Be sure to tick the *Programmatic access* checkbox.

![Create new user dialogue - basic setup](../assets/aws-s3-1.png)

Leave the permissions and tags empty for now, we will set it up in a minute.

On the last screen of the Add user wizard, be sure to copy **Access key ID** and
**Secret access key** somewhere safe, you will need it to setup the Write API.

![Create new user dialogue - access keys](../assets/aws-s3-2.png)

Navigate to the user detail and click the *Add inline policy* button. On the next screen,
select the JSON tab. This is the place where we allow the user to work with the files
in the S3 bucket we created earlier. In our case, we named the bucket `test-hotels`.

![User detail](../assets/aws-s3-3.png)

Copy and paste the following JSON snippet in the textarea. Change the `test-hotels`
bucket name accordingly to your actual configuration. If you are hosting multiple hotels
in the same bucket, you can specify a path prefix here as well, just change the
`"arn:aws:s3:::test-hotels/*"` to something like `"arn:aws:s3:::test-hotels/my-fancy-hotel/*"`.
This will prevent this particular AWS user from touching files that belong to other hotels.


```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VisualEditor1",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:DeleteObjectVersion",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::test-hotels/*"
      ]
    }
  ]
}
```

![User detail](../assets/aws-s3-4.png)

After clicking the *Review policy* button, you will have to name the policy. After that, click 
the *Create policy* button.

If everything went correctly, you now have an AWS user that can only work with the files in
the specific S3 bucket or even subdirectory. That's everything you need to do on AWS.

### Create an account in the Write API

The next step is to actually publish some data into the bucket. We will test
it with the Write API.

Write API is working with the concept of *accounts*. Every account
is a virtual user of the API and has the following properties
associated with it:

- Ethereum wallet that is used to sign and pay for all on-chain transactions
- Uploaders configuration that is used when uploading inventory to Winding Tree
ecosystem.

In our case, we need to configure the `uploaders` section to use the S3. The fields
are pretty self-explanatory:

- `accessKeyId` - Piece of AWS credentials for the user saved during the user creation
- `secretAccessKey` - Piece of AWS credentials for the user saved during the user creation
- `region` - AWS S3 bucket region
- `bucket` - Name of the S3 bucket
- `keyPrefix` - Optional directory to upload hotel data to

Every account is represented as a JSON object. We will store this one in a file
called `account.json`.

```json
{
  "wallet": {"version":3,"id":"7fe84016-4686-4622-97c9-dc7b47f5f5c6","crypto":{"ciphertext":"ef9dcce915eeb0c4f7aa2bb16b9ae6ce5a4444b4ed8be45d94e6b7fe7f4f9b47","cipherparams":{"iv":"31b12ef1d308ea1edacc4ab00de80d55"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"d06ccd5d9c5d75e1a66a81d2076628f5716a3161ca204d92d04a42c057562541","n":8192,"r":8,"p":1},"mac":"2c30bc373c19c5b41385b85ffde14b9ea9f0f609c7812a10fdcb0a565034d9db"}},
  "uploaders": {
    "root": {
      "s3": {
        "accessKeyId": "AKIAQNXI4SLEJIKRTYHK",
        "secretAccessKey": "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",
        "region": "eu-west-1",
        "bucket": "test-hotels",
        "keyPrefix": "my-fancy-hotel"
      }
    }
  }
}
```

To create an account with this setup, you need to do the following call:

```sh
$ curl -X POST localhost:8000/accounts \
  -H 'Content-Type: application/json' \
  --data @account.json

# accountId and accessKey are generated and will be different every time
{"accountId":"aa43edaf8266e8f8","accessKey":"usgq6tSBW+wDYA/MBF367HnNp4tGKaCTRPy3JHPEqJmFBuxq1sA7UhFOpuV80ngC"}
```

If you then try to [create a hotel](how-to-publish-inventory.md) with this account,
all of its data should get safely stored in your AWS S3 bucket.

## Where to next

- [Publishing inventory and availability offering](how-to-publish-inventory.md)
- [Publishing inventory and availability offering for an entire hotel](how-to-publish-entire-hotel.md)
- [Publishing inventory and availability offering for many hotels](how-to-publish-many-hotels.md)
