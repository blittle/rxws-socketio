### Websocket Request Format

```javascript
{
  "header": {
   "access_token": "7fgnasdfvy0afdsjfjdls",
   "resource": "patch.accounts.years.formAnswers",
   "parameters": {"accounts": 333, "years": 12, "formAnswers": 9327645},
   "queryParameters": {"include": "history"},
   "apiVersion": "1.2.1", // application specific headers
   "correlationId": "FUFJ-XHJHF-FFFF-RRRR"
  },
  "body": {
    "formAnswers": {
      "married": "no",
      "numDepenents": 5
    }
  }
}
```

### Websocket Response Format

```javascript
{
  "header": {
   "apiVersion": "1.2.1", // application specific headers
   "correlationId": "FUFJ-XHJHF-FFFF-RRRR",
   "statusCode": 200
  },
  "body": {
    "formAnswers": {
      "married": "no",
      "numDepenents": 5
    }
  }
}
```

### Server push Request format

```javascript
{
  "header": {
   "apiVersion": "1.2.1", // application specific headers
   "correlationId": "FUFJ-XHJHF-FFFF-RRRR",
   "notification": "uniqueEventName"
  },
  "body": {
    "eventData": {
      "numDepenents": 5
    }
  }
}
```

### Server push Response format

```javascript
{
  "header": {
   "apiVersion": "1.2.1", // application specific headers
   "correlationId": "FUFJ-XHJHF-FFFF-RRRR",
   "notification": "uniqueEventName"
  }
}
```


### WebSocket Error Responses
```json
{
  "header": {
   "apiVersion": "1.2.1", 
   "correlationId": "FUFJ-XHJHF-FFFF-RRRR",
   "statusCode": 503
  },
  "body": {
    "errors": {
      "code": 0,
      "message": "Validation errors",
      "details": ["Fields not allowed: field1, field2, field3","another error"]
    }
  }
```

### WebSocket status codes (http-like)

```

Invalid Request: 400 (likely due to schema validation)
Unauthorized: 401
Forbidden: 403
Resource not found: 404
Business validation error: 430

Server error: 503

```


