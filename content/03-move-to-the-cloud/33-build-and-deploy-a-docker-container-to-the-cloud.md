---
title: "3.3 Build & Deploy a Docker Container to the Cloud"
metaTitle: "Build & Deploy a Docker Container to the Cloud"
---

## Objectives

- Create an App Service Plan
- Create a container-based web backend
- Add environmental variables to connect web app backend to Postgres database


## Exercise 1: Create an App Service Plan

An App Service Plan allows you to configure a server independent of whatever kind of app will be deployed to it. You use this plan to tell Azure the size/capacity of the resources (Storage, RAM, CPU, etc) that you need for the app you are building.

To create one, run the following in your terminal:

```bash
az appservice plan create \
  --name hermapiplan \
  --resource-group herm \
  --sku P1V2 \
  --is-linux
```

The `--is-linux` flag sets up this service plan for a Linux server.

Here is what the output of creating a service plan will look like:

![](https://paper-attachments.dropbox.com/s_CF587C16DBFCB550886E57AB2E7BCFF7611E95AB7F653D7F40F3C3CC5B40D207_1581911564841_Screen+Shot+2020-02-17+at+7.52.24+AM.png)

You can confirm if it was created by going to your resource group and taking a look at the listed resources:

![](https://paper-attachments.dropbox.com/s_CF587C16DBFCB550886E57AB2E7BCFF7611E95AB7F653D7F40F3C3CC5B40D207_1581912679530_image.png)


## Exercise 2: Create a Web App (Backend)

A web app resource does not mean a frontend or front-facing app. It means that a resource is created as a server that can serve web requests. Therefore it is perfect for deploying both frontend and backend web apps.

**Task 1: Add a production docker-compose file**

Since our app has been setup as a Docker-based app with a docker-compose file, we need to deploy a Docker container. In the previous chapter, we set up Docker using this file:

```yml
version: '3.6'
services:
  postgres:
    image: postgres:10
    restart: always
    environment:
      POSTGRES_PASSWORD: postgres
    volumes:
    - db_data:/var/lib/postgresql/data
  graphql-engine:
    image: hasura/graphql-engine:v1.2.0-beta.3
    ports:
    - "3100:8080"
    depends_on:
    - "postgres"
    restart: always
    environment:
      HASURA_GRAPHQL_DATABASE_URL: postgres://postgres:postgres@postgres:5432/postgres
      HASURA_GRAPHQL_ENABLE_CONSOLE: "true"
      HASURA_GRAPHQL_ENABLED_LOG_TYPES: startup, http-log, webhook-log, websocket-log, query-log
volumes:
  db_data:
```
We need to change a few things in this file because:

1. Postgres won't scale well in a container, and that is why we created a standalone scalable Azure Postgres database in the previous section.
2. The port, `3100`, is exposed for localhost. In the cloud, your public port will generally be on `80` or `8080`.

I don't want to get rid of our current compose file because of the listed reasons, though —  we are still using it locally. What we can do is create another `docker-compose` file for production.

Create a `docker-compose.prod.yml` with the following content:

```yml
version: '3.6'
services:
  graphql-engine:
    image: hasura/graphql-engine:v1.2.0-beta.3
    ports:
    - "8080:8080"
    restart: always
```

See how there is no database stuff here, including the connection string. We can't have a production connection string in or any environment variable in this file because we intend to commit it to source control. I will show you how to set those up soon using an `az` command.

**Task 2: Create a web app**

Run the following to create a web app with the new compose file:

```bash
az webapp create \
  --resource-group herm \
  --plan hermapiplan \
  --name hermapi \
  --multicontainer-config-type compose \
  --multicontainer-config-file docker-compose.prod.yml
```

`--multicontainer-config-type` sets up the web app resource to be created using a `docker-compose` file while `--multicontainer-config-file` specifies the docker-compose file.

We are also setting the `--plan` to the App Service Plan we created earlier. 

Here is what the output of creating a web app should look like:

![](https://paper-attachments.dropbox.com/s_CF587C16DBFCB550886E57AB2E7BCFF7611E95AB7F653D7F40F3C3CC5B40D207_1581910115345_image.png)


You can also take a look at the app in the portal if you want:

![](https://paper-attachments.dropbox.com/s_CF587C16DBFCB550886E57AB2E7BCFF7611E95AB7F653D7F40F3C3CC5B40D207_1581912731820_image.png)


To see your deployed container settings and details, click on the web app name, as highlighted in the diagram above. On the left sidebar, click **Container settings**:


![](https://paper-attachments.dropbox.com/s_CF587C16DBFCB550886E57AB2E7BCFF7611E95AB7F653D7F40F3C3CC5B40D207_1581921913451_image.png)


**Task 3: Test the web app**

In the **Overview** tab on the left sidebar, click the public **URL** of your app:

![](https://paper-attachments.dropbox.com/s_CF587C16DBFCB550886E57AB2E7BCFF7611E95AB7F653D7F40F3C3CC5B40D207_1581912754431_Screen+Shot+2020-02-17+at+8.09.09+AM.png)


You will be greeted with a sad 500 error.

![](https://paper-attachments.dropbox.com/s_CF587C16DBFCB550886E57AB2E7BCFF7611E95AB7F653D7F40F3C3CC5B40D207_1581912761159_Screen+Shot+2020-02-17+at+8.07.38+AM.png)

Let's take a look at our log and see what we have done wrong:

<iframe src="https://player.vimeo.com/video/391896239" width="640" height="400" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>

As you can see from the one minute video, the web app is trying to connect to a postgres database, but there is no valid connection string.


## Exercise 3: Connect to your database

Here is what a connection URL to a Postgres database should look like

```txt
postgres://<username>@<db-server-name>:<password>@<server>:5432/postgres
```

For example, if you have the following config:

| Config         | Value                              |
| -------------- | ---------------------------------- |
| username       | admin                              |
| db-server-name | hermdb                             |
| password       | 12characterp@ssword                |
| server         | hermdb.postgres.database.azure.com |

Your connection string should look like this:

```txt
postgres://admin%40hermdb:12characterp%40ssword@hermdb.postgres.database.azure.com:5432/postgres
```

Notice how we are replacing the `@` between username and db-sever-name as well as the `@` in the password with a percent-encoding (%40) equivalent. The reason is that the `@` between the password and the server URL is a keyword for Postgres connection strings. In that case, the other @ signs would be parsed incorrectly.

Run the following command to set the connection string:

```bash
az webapp config appsettings set \
  --resource-group herm \
  --name hermapi \
  --settings HASURA_GRAPHQL_DATABASE_URL="postgres://admin%40hermdb:12characterp%40ssword@hermdb.postgres.database.azure.com:5432/postgres"
```

After a few seconds, reload, and you should get a different error:

![](https://paper-attachments.dropbox.com/s_CF587C16DBFCB550886E57AB2E7BCFF7611E95AB7F653D7F40F3C3CC5B40D207_1581923868712_image.png)


Remember when we deleted environmental variables from the production compose file, the database url was NOT the only config that we removed. One of those configs tells Hasura to expose the Hasura console to the public. These are the two configs we removed alongside the database config:

```yml
HASURA_GRAPHQL_ENABLE_CONSOLE: "true"
HASURA_GRAPHQL_ENABLED_LOG_TYPES: startup, http-log, webhook-log, websocket-log, query-log
```

We need to run the `config` command again to add them:

```bash
az webapp config appsettings set \
  --resource-group herm \
  --name hermapi \
  --settings \
    HASURA_GRAPHQL_ENABLE_CONSOLE="true" \
    HASURA_GRAPHQL_ENABLED_LOG_TYPES="startup, http-log, webhook-log, websocket-log, query-log"
```

Reload the page again, and you should finally have a Hasura console in production:


![](https://paper-attachments.dropbox.com/s_CF587C16DBFCB550886E57AB2E7BCFF7611E95AB7F653D7F40F3C3CC5B40D207_1581924138907_image.png)


You can also edit your configs from the web app resource by clicking on **Configuration** from the left sidebar:


![](https://paper-attachments.dropbox.com/s_CF587C16DBFCB550886E57AB2E7BCFF7611E95AB7F653D7F40F3C3CC5B40D207_1582009645303_image.png)


## Exercise 4: Logging

You can monitor what is going on with your API by running:

```bash
az webapp log tail \
  --resource-group herm \
  --name hermapi
```

The log command will show you only logs regarding to deploying and starting up docker. It will not show logs about what is happening internally in your app.

You can enable app logs and to do that, stop the current log process and run the following:

```bash
az webapp log config \
    --name hermapi \
    --resource-group herm \
    --docker-container-logging filesystem
```

Setting `--docker-container-logging` to `filesystem` tells Azure to log the app logs to a file. You can the stream this log with the `tail` command:

```bash
az webapp log tail \
  --resource-group herm \
  --name hermapi
```
