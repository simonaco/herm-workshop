---
title: "3.4 Protecting App & Data from The Public"
metaTitle: "Protecting App & Data from The Public"
---

It is exciting that at this point, when we visit our public production link, everything works, and we can see the Hasura console live.


![](https://paper-attachments.dropbox.com/s_CF587C16DBFCB550886E57AB2E7BCFF7611E95AB7F653D7F40F3C3CC5B40D207_1581924138907_image.png)


On second thought, this scares me to death. What this means is that anybody can create tables, add data, delete data — everyone in the world is an admin to your app, including your cat.

What you want is to ensure that only selected administrators like you or your manager can have access to this dashboard/console.


## Objectives

- Allow only **admins** to access the Hasura console

## Exercise 1: Set Local Admin Secret

I am going to bring back this local `docker-compose.yml` you have in your `api` folder once more:

```yml
version: '3.6'
services:
  postgres:
    image: postgres:9.6
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

This time, I want you to edit the `HASURA_GRAPHQL_ADMIN_SECRET` env variable and set a secret:

```yml
  environment:
      HASURA_GRAPHQL_DATABASE_URL: postgres://postgres:postgres@postgres:5432/postgres
      HASURA_GRAPHQL_ENABLE_CONSOLE: "true"
      HASURA_GRAPHQL_ENABLED_LOG_TYPES: startup, http-log, webhook-log, websocket-log, query-log
+     HASURA_GRAPHQL_ADMIN_SECRET: mypowerfulsecretthatyoucantotallyhack
volumes:
  db_data:
```

> Since we commit our docker-compose files, make sure that this does not get into the wrong hands. A general rule of thumb is to use different secrets for local and production environments.

If you reload `localhost:3100`, you should see that the page is still public. The reason is that we need to restart Docker before the new env variable can kick in:

```bash
docker-compose up -d
```

Now try to reload again, and you would get a push back from the app asking you to enter a secret:

![](https://paper-attachments.dropbox.com/s_A561BAD08E082D0185135BC53B9406EE0B87CA481FCF5503761F9D9CD8E5C12A_1582008451962_image.png)

    
## Exercise 2: Set Production Admin Secret

You can already guess from the previous section how we could set the production admin secret. We need to use the `az` config command we have been using to set secrets:

```bash
az webapp config appsettings set \
  --resource-group herm \
  --name hermapi \
  --settings \
    HASURA_GRAPHQL_ADMIN_SECRET="<your prod admin secret>"
```

Azure will automatically restart the server for you:

![](https://paper-attachments.dropbox.com/s_A561BAD08E082D0185135BC53B9406EE0B87CA481FCF5503761F9D9CD8E5C12A_1582009327527_image.png)


If you take one more look at your settings, you should see that the `HASURA_GRAPHQL_ADMIN_SECRET` has been set:


![](https://paper-attachments.dropbox.com/s_A561BAD08E082D0185135BC53B9406EE0B87CA481FCF5503761F9D9CD8E5C12A_1582009601711_image.png)


