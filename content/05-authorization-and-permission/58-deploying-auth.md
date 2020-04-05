---
title: "5.8 Deploying Auth"
metaTitle: "Deploying Auth"
---

Since we have made changes locally, we need to redeploy the API and frontend app as well as the new serverless function we created for our action


## Objectives
- Upload Environmental Variables
- Run migrations
- Deploy Serverless Function


## Exercise 1: Deploy a Serverless Function

Let’s get the fun part done first — let’s deploy the serverless function for our action.

**Task 1: Create an Azure Function**

Starting with creating a resource group for managing the serverless function. Run the following to create one:

```bash
az group create \
    --name hermserverless \
    --location uksouth
```

Sometimes a serverless function needs storage to store metadata and execution state. Add a storage in the resource group you just created for the function we will create soon:

```bash
az storage account create \
    --name <STORAGE NAME Eg. hermserverlessstorage> \
    --location uksouth \
    --resource-group <RESOURCE GROUP Eg. hermserverless> \
    --sku Standard_LRS
```

Finally, create a function that will be managed in the resource group we just created and uses the storage we created as well:

```bash
az functionapp create \
    --resource-group <RESOURCE GROUP Eg. hermserverless> \
    --consumption-plan-location uksouth \
    --name <UNIQUE NAME Eg. hermserverless> \
    --storage-account <STORAGE NAME Eg. hermserverlessstorage> \
    --runtime node 
```

**Task 2: Deploy Function**

It’s time to push the code from our local machine to the Azure Function we created. You can publish this function using the `func` CLI tool:

```bash
func azure functionapp publish <UNIQUE NAME Eg. hermserverless>
```

When the deploy is done, you should get the URL in the console:


![](https://paper-attachments.dropbox.com/s_1A3C824EE5CEAB488EFB8EFEC1E956F1BD678367AC8648801B15C780618F7E48_1585943877348_Screen+Shot+2020-04-03+at+11.56.30+PM.png)


Since there is a `GRAPHQL_BASE_API` environmental variable, we need to set it as well. Run the following command to set an env variable in the cloud function:

```bash
az functionapp config appsettings set \
    --name <FUNCTION NAME eg. hermserverless> \
    --resource-group <RESOURCE GROUP eg hermserverless> \
    --settings "GRAPHQL_BASE_API=<GRAPHQL_BASE_API eg https://hermapi.azurewebsites.net>"
```

You can stream the logs from this function by running:

```bash
az webapp log tail \
    --resource-group hermserverless \
    --name hermserverless
```

**Task 3: Update Action Url**

Since we have two different environments now for the serverless function — local and production, we need to find a way to provide the correct URL depending on the API’s environment.

Luckily, Hasura allows you to use placeholders for environmental variables inside the action URL text box. First copy the URL you got after deploying which looks like this:

```
https://hermserverless.azurewebsites.net/api/checkandregisteruser?code=<ACCESS CODE>
```

Replace the base as follows:

```
{{ACTIONS_BASE_URL}}/api/checkandregisteruser?code=<ACCESS CODE>
```

Next open the console by running the following in the `api/hasura` folder:

```bash
hasura console --admin-secret <ADMIN SECRET>
```

Then go to the Actions tab, open the **checkAndRegisterUser** action and paste the edited URL in the **Handler** URL field:


![](https://paper-attachments.dropbox.com/s_1A3C824EE5CEAB488EFB8EFEC1E956F1BD678367AC8648801B15C780618F7E48_1585944135786_image.png)


Now click Save to update the function.

The `ACTIONS_BASE_URL` needs to be set in the local `docker-compose.yml` file as well as in production. 

To set locally, open `api/docker-compose.yml` file and add the following to the env variables:

```yml
environment:
      HASURA_GRAPHQL_JWT_SECRET: '...'
+     ACTIONS_BASE_URL: http://host.docker.internal:7071
```
To set in production run the following command:

```bash
az webapp config appsettings set \
    --resource-group herm \
    --name <API NAME eg. hermapi> \
    --settings \
    ACTIONS_BASE_URL=<SERVERRLESS BASE Eg. https://hermserverless.azurewebsites.net/api/checkAndRegisterUser>
```

## Exercise 2: Redeploy GraphQL API

**Task 1: Update Env Variables**

We added the `HASURA_GRAPHQL_JWT_SECRET` when enabled JWT, which means we need to send these settings to production as well. Run the following to add the same settings to your production API env:

```bash
az webapp config appsettings set \
    --resource-group herm \
    --name <API NAME eg. hermapi> \
    --settings \
    HASURA_GRAPHQL_JWT_SECRET='{"type": "RS512", "key": "-----BEGIN CERTIFICATE---<...KEY HERE...>-----END CERTIFICATE-----\n"}'
```

**Task 2: Run Migrations**

So far, since our last migration, we have made the following changes:


- Add permissions
- Create actions
- Update database schema

We need to run migrations to push these changes to production:

```bash
hasura migrate apply \
    --endpoint <GRAPHQL API ENDPOINT Eg. https://hermapi.azurewebsites.net> \
    --admin-secret <SECRET>
```

## Exercise 3: Redeploy Next.js App

The last step of deploying to push our frontend Next.js app to Github, which will trigger a build. But before that, let’s add all those environmental variables we created locally to production:

```bash
az webapp config appsettings set \
    --resource-group herm \
    --name <FRONTEND APP NAME Eg. hermapp> \
    --settings \
    APP_BASE_URL="<PRODUCTION_FRONTEND_URL>"
    APP_BASE_API="<PRODUCTION_API_URL>"
    AUTH0_DOMAIN="<AUTH0_DOMAIN>"
    AUTH0_CLIENT_ID="<AUTH0_CLIENT_ID>"
    AUTH0_CLIENT_SECRET="<AUTH0_CLIENT_SECRET>"
    AUTH0_COOKIE_SECRET="<AUTH0_COOKIE_SECRET>"
    AUTH0_REDIRECT_URL="<PRODUCTION_FRONTEND_URL>/api/callback"
```

Now go ahead and push to Github then give the build a minute or 2 to complete.

