## SNS -> Lambda -> Datadog tutorial

### Required

- nodejs
- [request](https://www.npmjs.com/package/request)
- Datadog API Key

### How to use

- [request](https://www.npmjs.com/package/request) Install

```sh
% npm install request
```

- Chnage config.js

```javascript
var config = {};

config.api_key = 'your_api_key';
config.app_key = 'your_app_key';

module.exports = config;
```

- Creata Lambda function

```sh
% aws lambda --region ap-northeast-1 \
  create-function \
    --function-name your_function \
    --runtime nodejs \
    --role arn:aws:iam::1234567890123:role/lambda_basic_execution \
    --handler index.handler \
    --zip-file fileb://im_kayac.zip 
```

- Update function

```sh
% zip -r your_function.zip index.js config.js node_modules
# Important 'fileb//', See http://docs.aws.amazon.com/cli/latest/reference/lambda/update-function-code.html.
% aws lambda --region ap-northeast-1 update-function-code --function-name your_function --zip-file fileb://your_function.zip 
```

## Sample

### Create Lambda function

```sh
% aws lambda --region ap-northeast-1 \
  create-function \
    --function-name im_kayac_com \
    --runtime nodejs \
    --role arn:aws:iam::1234567890123:role/lambda_basic_execution \
    --handler index.handler \
    --zip-file fileb://im_kayac.zip 
```

output.

```javascript
{
    "FunctionName": "im_kayac_com", 
    "CodeSize": 1140981, 
    "MemorySize": 128, 
    "FunctionArn": "arn:aws:lambda:ap-northeast-1:1234567890123:function:im_kayac_com", 
    "Handler": "index.handler", 
    "Role": "arn:aws:iam::1234567890123:role/lambda_basic_execution", 
    "Timeout": 3, 
    "LastModified": "2015-09-18T23:57:18.536+0000", 
    "Runtime": "nodejs", 
    "Description": ""
}
```

### Create topic

```sh
% aws sns create-topic --name foo
```

output.

```javascript
{
    "TopicArn": "arn:aws:sns:ap-northeast-1:1234567890123:foo"
}
```

### Create subscribe

```sh
% aws sns --region ap-northeast-1 \
  subscribe \
    --topic-arn arn:aws:sns:ap-northeast-1:1234567890123:foo \
    --protocol lambda \
    --notification-endpoint arn:aws:lambda:ap-northeast-1:1234567890123:function:im_kayac_com
```

output.

```javascript
{
    "SubscriptionArn": "arn:aws:sns:ap-northeast-1:1234567890123:foo:714e76d4-9ac0-4b76-aece-124b1aaef68b"
}
```

### Create Message

```sh
% cat << EOT >> message.js
{
  "default": "test",
  "title": "Lambda Message Test",
  "message": "foo bar",
  "url": "http://xxx.example.com/"
}
EOT
```

### Create Event source mapping

- Management console

![2015091902.png](https://qiita-image-store.s3.amazonaws.com/0/87189/b956061d-3fd1-cf1b-8dd1-e48ce87eddd0.png "2015091902.png")

### Publish to topic

```sh
% aws sns --region ap-northeast-1 publish --topic-arn arn:aws:sns:ap-northeast-1:1234567890123:foo --subject "hello lambda\!\!" --message file://message.js
```

output.

```javascript
{
    "MessageId": "18d431ee-dc22-5ab0-a5c2-7f9877071052"
}
```

### Check your Datadog Event Dashboard

![2015091903.png](https://qiita-image-store.s3.amazonaws.com/0/87189/1b83d745-81ad-39e1-653f-8a943aab8cbe.png "2015091903.png")

***

## lambda-local

### reference

- https://github.com/ashiina/lambda-local
- http://ashiina.github.io/2015/01/lambda-local/

### install

```sh
% npm install lambda-local
```

### dependency

```sh
% export NODE_PATH='/path/to/lambda-korya-xxxxxxx/node_modules/lambda-local/node_modules'
% export AWS_ACCESS_KEY_ID='AKXXXXXXXXXXXXXXXXXX'
% export AWS_SECRET_ACCESS_KEY='XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
```

### event source

```javascript
% cat << EOT >> test.js
module.exports = {
  "default": "test",
  "title": "Lambda Message Test",
  "message": "foo bar",
  "url": "http://xxx.example.com/"
};
EOT
```

### execute

```sh
% lambda-local -l index_test.js.test -h handler -e test.js
```

output.

```
% lambda-local -l index_test.js.test -h handler -e test.js
Loading event
Logs
----
START RequestId: 8f1cf24a-6637-11d2-de89-d7c1a17df67c
Sending Datadog event: 
URL: https://app.datadoghq.com/api/v1/events?api_key=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Message: {"title":"Lambda Message Test","text":"foo bar","alert_type":"error"}
Message send successful!  Server responded with: {"status": "ok", "event": {"priority": null, "date_happened": 1442717663, "handle": null, "title": "Lambda Message Test", "url": "https://app.datadoghq.com/event/event?id=12345678901234567", "text": "foo bar", "tags": null, "related_event_id": null, "id": 12345678901234567}}
END


Message
------

```
