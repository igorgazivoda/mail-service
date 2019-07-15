# micromailer

A Node.js microservice for sending email

## Example

Start the service and send an email:

```
PORT=3000 node index.js
curl -X POST --data "fromName=Test&subject=Hi&body=Hello&replyTo=test@example.com" http://localhost:3000/send
```

## Installation

Clone somewhere then create an `.env` file:

```
FROM_EMAIL=you@example.com
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=465
SMTP_USER=XXX
SMTP_PASSWORD=XXX
MAX_BODY_SIZE=10000
```
run locally:

```
node index.js
```

## API

```
POST /send
```

The data payload can be JSON or URL-encoded (x-www-form-urlencoded).

* `fromName` - name of sender
* `toEmail` - send-to email
* `subject` - email subject
* `body` - plain-text email body
* `replyTo` (optional) - reply-to email
