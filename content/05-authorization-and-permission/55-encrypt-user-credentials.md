---
title: "5.5 Encrypt User Credentials"
metaTitle: "Encrypt User Credentials"
---

To send tweets on behalf of users, we need their access token. When they log in to our app using Auth0, Auth0 fetches their token and secret. You can ask Auth0 to attach this access token and secret to the JWT when they log in.

The problem with attaching the token and secrets to the JWT is that anyone with the JWT can decode it. When the wrong person decodes your JWT and your Twitter credentials on the JWT payload, you have been hacked!

We need to encrypt the token and secret, so even if the wrong person decodes our JWT, we still don’t risk being hacked.



## Objectives
- Encrypt sensitive auth data


## Exercise 1: Encrypt Auth Data

**Task 1: Add Access Token and Secret to JWT**

Watch this video again on how to create rules:

<iframe src="https://player.vimeo.com/video/401259311" width="640" height="400" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>

This time we are not creating a new rule, we are updating the **Hasura Claims** rule we already have. Update the rule as follows:

```js
function(user, context, callback) {
  const hasuraNameSpace = 'https://hasura.io/jwt/claims';
  context.accessToken[hasuraNameSpace] = {};

  context.accessToken[hasuraNameSpace]['x-hasura-default-role'] = 'user';
  context.accessToken[hasuraNameSpace]['X-Hasura-User-Id'] = user.screen_name;
  context.accessToken[hasuraNameSpace]['X-Hasura-Allowed-Roles'] = ['user'];
  
  // Twitter credentials
  context.accessToken[hasuraNameSpace]['X-Hasura-Access-Token'] = user.identities[0].access_token;
  context.accessToken[hasuraNameSpace]['X-Hasura-Access-Token-Secret'] = user.identities[0].access_token_secret;
  callback(null, user, context);
}
```

We added two more properties — `X-Hasura-Access-Token` to hold the token and `X-Hasura-Access-Token-Secret` to hold the secret. 

If you logout and login again, copy the JWT from http://localhost:3000/api/jwt. Decode the token with jwt.io or Hasura console, and you should see your access token and secret there:

```json
{
  "https://hasura.io/jwt/claims": {
    "x-hasura-default-role": "user",
    "X-Hasura-User-Id": "codebeast",
    "x-hasura-allowed-roles": [
      "user"
    ],
    "X-Hasura-Access-Token": "844...",
    "X-Hasura-Access-Token-Secret": "GWZ..."
  },
  "nickname": "...",
  "name": "...",
  "picture": "...",
  "updated_at": "2020-03-24T11:27:36.642Z",
  "iss": "https://chris92.auth0.com/",
  "sub": "twitter|844619452427751424",
  "aud": "I6wmHZNeTcHH1IhFKz7NO5TW7MAq4FOU",
  "iat": 1585049263,
  "exp": 1585085263
}
```

**Task 2: Encode Token and Secret**

We have our token open and naked on this JWT. We are at risk of being hacked. Update the Hasura Claims rule to encrypt the token and secret:

```js
function(user, context, callback) {

  function encrypt(text, password) {
    var algorithm = "aes-256-ctr";
    var cipher = crypto.createCipher(algorithm, password);
    var crypted = cipher.update(text, "utf8", "hex");
    crypted += cipher.final("hex");
    return crypted;
  }
  
  const hasuraNameSpace = 'https://hasura.io/jwt/claims';
  const password = '<VERY_STRONG_PASSWORD>';
  context.accessToken[hasuraNameSpace] = {};

  context.accessToken[hasuraNameSpace]['x-hasura-default-role'] = 'user';
  context.accessToken[hasuraNameSpace]['X-Hasura-User-Id'] = user.screen_name;
  context.accessToken[hasuraNameSpace]['X-Hasura-Allowed-Roles'] = ['user'];
  
  // Twitter credentials
  context.accessToken[hasuraNameSpace]['X-Hasura-Access-Token'] = encrypt(user.identities[0].access_token, password);
  context.accessToken[hasuraNameSpace]['X-Hasura-Access-Token-Secret'] = encrypt(user.identities[0].access_token_secret, password);
  callback(null, user, context);
}
```

The encrypt function uses Node’s crypto to encrypt whatever text you pass to it. The password used for encryption must be provided to decrypt the encryption.

Replace `<VERY_STRONG_PASSWORD>` with your own password.

The encrypt function is then used to encrypt the token and secret:

```js
context.accessToken[hasuraNameSpace]['X-Hasura-Access-Token'] = encrypt(user.identities[0].access_token, password);
context.accessToken[hasuraNameSpace]['X-Hasura-Access-Token-Secret'] = encrypt(user.identities[0].access_token_secret, password);
```

Log out and log in one more time, copy the JWT from http://localhost:3000/api/jwt and decode on jwt.io. You should see that the access token and secret looks different from their originals.


