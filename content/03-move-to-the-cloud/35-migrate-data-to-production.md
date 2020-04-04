---
title: "3.5 Migrate Data to Production"
metaTitle: "Migrate Data to Production"
---

We have made good progress. We have a scalable backend that is well secured, and sometimes that’s all we ask for. Sometimes though, we want to keep working locally and shipping our changes to the cloud.

Azure and Hasura give you an arsenal of tools to help you work locally and keep your app up to date. These tools are useful because we want to keep the data on local and production different while making sure that the database schema, as well as things like Hasura authorization, are synched between both environments. Let’s see what we can do about that.


## Objectives
- Setup Hasura CLI
- Generate migration code with Hasura CLI
- Apply migrations both locally and to production


## Exercise 1: Setup Hasura CLI

So far, we have seen one part of what makes up Hasura — the console. There is another part — the CLI tool, which hands you even more power.

First, you need to install it:

```bash
npm install --global hasura-cli@1.2.0-beta.2
```

Initialize Hasura in the same folder where you have the `docker-compose.yml` file:

```bash
## Initialize a Hasura Code project
hasura init --endpoint http://localhost:3100 --directory hasura
```

This will create a `hasura` folder with a `migrations` folder in it as well as a `cofig.yaml` file.


## Exercise 2: Accessing Console from CLI

A migration code is a set of instructions that you can run on any Hasura endpoint to tell Hasura how it should set up the database, relationships, and permissions. It is the perfect tool for synching structure between local and production. That means we can edit the structure of your data from two possible places:

1. Hasura console
2. Hasura CLI

The best practice is that you turn off accessing the console directly so you can have one source of change and make syncing easier. 

**Task 1: Disable Direct Console Access**

To turn off console locally, edit the `docker-compose.yml` file and turn `HASURA_GRAPHQL_ENABLE_CONSOLE` to `false`:

```yml
HASURA_GRAPHQL_ENABLE_CONSOLE: "false"
```

To turn off the console in production, run the following command:

```bash
az webapp config appsettings set \
    --resource-group herm \
    --name hermapi \
    --settings \
    HASURA_GRAPHQL_ENABLE_CONSOLE="false"
```

If you visit `localhost:3100` or `<your-app-name>.azurewebsites.net`, you should get the following:


![](https://paper-attachments.dropbox.com/s_AD6FC2A66231AF879CD7A480344D4C6ECBC6D0690AF08EBAAE67DE2ED8DC3B45_1582178452296_image.png)


**Task 2: Access Console from CLI**

Now you have only one way to access the console, the CLI. To use it, cd into the `hasura` folder you created during initialization:

```bash
cd hasura
```

Then run the following command:

```bash
hasura console \
    --admin-secret <secret>
```

The command will open the local Hasura console:

![](https://paper-attachments.dropbox.com/s_AD6FC2A66231AF879CD7A480344D4C6ECBC6D0690AF08EBAAE67DE2ED8DC3B45_1582178822494_image.png)


If you want to open the production console, you need to specify the `--endpoint` flag:

```bash
hasura console \
    --endpoint https://<YOUR APP NAME>.azurewebsites.net \
    --admin-secret <YOUR SECRET>
```

## Exercise 3: Generating Migration Code

Let’s generate a migration code based on the tables and relationships we created in the previous chapter:

```bash
hasura migrate create "init" \
    --from-server \
    --endpoint http://localhost:3100 \
    --admin-secret <secret>
```

The command will generate a version number that looks like this `1582009940933`

![](https://paper-attachments.dropbox.com/s_AD6FC2A66231AF879CD7A480344D4C6ECBC6D0690AF08EBAAE67DE2ED8DC3B45_1582010156310_Screen+Shot+2020-02-18+at+11.14.56+AM.png)


Look into your `hasura/migrations` folder and should see some generated code including an SQL file.

## Exercise 4: Applying Migrations

You can take this generated migration and apply it to a particular endpoint. Let’s start with applying it locally:

**Task 1: Apply Migration Locally**

```bash
hasura migrate apply \
    --version <VERSION NUMBER FROM EXERCISE 3> \
    --skip-execution \
    --endpoint http://localhost:3100 \
    --admin-secret <secret>
```

Why are we applying migrations to an endpoint we generated the migrations from? I asked this question as well when I was learning about all this stuff. The reason is that if a migration file exists, every endpoint that syncs with that migration must know about it. This way a different source can edit the migration file, and it can still be used to update the endpoint that generated it

Nothing changes on the structure of our database when we run this because of the `--skip-execution` flag. The local Hasura setup just *marks* this migration as applied to the local engine.

**Task 2: Apply Migration in Production**

This is where it gets fun. Remember how empty our production backend was when we created it? Now we are going to move all the database schema we have here to production with the migration file we created.

```bash
hasura migrate apply \
    --endpoint https://<YOUR APP NAME>.azurewebsites.net \
    --admin-secret <secret>
```

Open the console from the terminal to confirm the migration:

```bash
hasura console \
    --endpoint https://<YOUR APP NAME>.azurewebsites.net \
    --admin-secret <YOUR SECRET>
```

You can see that we now have a database structure which in turn generates this GraphQL schema:

![](https://paper-attachments.dropbox.com/s_AD6FC2A66231AF879CD7A480344D4C6ECBC6D0690AF08EBAAE67DE2ED8DC3B45_1582182934031_image.png)


## Exercise 5: Adding Changes

Updating the structure henceforth is more straightforward. Three steps:


1. Open the **source** console (where you will be making changes) using the CLI
2. Make changes to the schema
3. Apply changes to the **destination** console.

Let’s see an example.

**Task 1: Local to Production Changes**

Open the local console:

```bash
hasura console \
    --admin-secret <secret>
```

Go to the **Data** tab and click the **account** table. Next Click on **Modify** tab to change the structure of the table.

![](https://paper-attachments.dropbox.com/s_AD6FC2A66231AF879CD7A480344D4C6ECBC6D0690AF08EBAAE67DE2ED8DC3B45_1582183982587_image.png)


Under the **Add a new column section**, click on **Frequently used columns** to add a `created_at` field. This field will automatically add the date a row was created. Now click **Add column**.

Take a look at the files in you `hasura` folder, you should see that without running the `migration create` command, the change you made generated a `migration` file:

```bash
.
├── config.yaml
└── migrations
    ├── 1582047096565_init
    │   ├── up.sql
    │   └── up.yaml
+   └── 1582184505548_alter_table_public_account_add_column_created_at
+       ├── down.yaml
+       └── up.yaml
```

Apply this migration to your production environment:

```bash
hasura migrate apply \
    --endpoint https://<YOUR APP NAME>.azurewebsites.net \
    --admin-secret <secret>
```

The command will update the schema in production, and you can take a look at it by opening the console again:

```bash
hasura console \
    --endpoint https://<YOUR APP NAME>.azurewebsites.net \
    --admin-secret <YOUR SECRET>
```

You can see in the **Modify** tab that we have a `created_at` field.

![](https://paper-attachments.dropbox.com/s_AD6FC2A66231AF879CD7A480344D4C6ECBC6D0690AF08EBAAE67DE2ED8DC3B45_1582184915414_image.png)


**Task 2: Production to Local Changes**

Migrating from **production** to **local** is as important as **local** to **production**. Imaging a colleague you are working with pushing migrations to production, and you are still working with an older version of the database structure. Migrating from production to local helps keep you up to date.

Since we left off at the production environment, let’s use the opportunity to add `created_at` to the `user` and `account_user` tables.

Take a look at `hasura/migrations` again, and you should see the new changes:

```bash
.
├── config.yaml
└── migrations
    ├── 1582047096565_init
    │   ├── up.sql
    │   └── up.yaml
    ├── 1582184505548_alter_table_public_account_add_column_created_at
    │   ├── down.yaml
    │   └── up.yaml
+   ├── 1582185257741_alter_table_public_user_add_column_created_at
+   │   ├── down.yaml
+   │   └── up.yaml
+   └── 1582185280513_alter_table_public_account_user_add_column_created_at
+       ├── down.yaml
+       └── up.yaml
```

Apply the migrations to your local environment:

```bash
hasura migrate apply \
    --endpoint http://localhost:3100 \
    --admin-secret <secret>
```

Launch the console once more:

```bash
hasura console \
    --admin-secret <secret>
```

You should see the updates as well:

![](https://paper-attachments.dropbox.com/s_AD6FC2A66231AF879CD7A480344D4C6ECBC6D0690AF08EBAAE67DE2ED8DC3B45_1582184915414_image.png)



