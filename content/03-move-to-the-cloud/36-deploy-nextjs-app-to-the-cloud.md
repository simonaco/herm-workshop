---
title: "3.6 Deploy Next.js App to the Cloud"
metaTitle: "Deploy Next.js App to the Cloud"
---

We are coming close to the end of this chapter. I hope it was a great learning experience for you as it was for me while making the chapter. Before we close off completely, I would like to show you how to also move your Next.js SSR, frontend web app, to the cloud.


## Objectives
- Deploy Next.js app to the cloud
- Setup continuous delivery


## Exercise 1: Deploy Next.js to Azure

A web app is an app that can handle a request and send responses efficiently. The GraphQL API we deployed is an excellent example of a web app, which is why we deployed it to the Azure Web App service.

The Next.js app we had in Chapter 1 is also a web app and is a good fit for Azure Web App service. To get ready for the deploy process, move into the folder where your Nextjs app is.

```bash
cd herm/app
```

**Task 1: Create a Service Plan**

Create a service plan to manage pricing and runtime for the Next.js app:

```bash
az appservice plan create \
 --name hermappplan \
 --resource-group herm \
 --sku P1V2 \
 --is-linux
```

**Task 2: Create a Web App in Azure**

Use the plan we just created and the resource group we have been creating resources under, to create a new empty web app:

```bash
az webapp create \
 --name <APP NAME> \
 --plan hermappplan \
 --runtime "node|12.9" \
 --resource-group herm
```

**Task 3: Preview Web App**

The web app you just created is currently empty and just shows a default greeting message from Azure. You can confirm this by running the following command to open the site:

```bash
az webapp browse \
 --name <APP NAME> \
 --resource-group herm
```

![](https://paper-attachments.dropbox.com/s_BC403D2BFE0C3B066DBCCFD377C1B34BBCE7654080CD72F324A50E5BF331E423_1582546529369_image.png)


We need to push our own code instead.

**Task 4: Generate Github Access Token**

We can pull code from Github into our Web App service, but what would be cool is to set up continuous delivery so that every push event on the Github repo would update the site.

To give Azure Web App the privileges to fetch code from our Github account, we need to get an access token from Github.

1. Click on → https://github.com/settings/tokens/new
2. Give the token a **name** and **access to your repositories** before generating:

![](https://paper-attachments.dropbox.com/s_BC403D2BFE0C3B066DBCCFD377C1B34BBCE7654080CD72F324A50E5BF331E423_1582546864523_image.png)

> Copy the token and store it somewhere safe. This is the only time Github will show you this token.

**Task 5: Update Scripts**

Remove the `build` script and update the `start` script to build and start the app:

```json
"scripts": {
 "dev": "next",
- "build": "next build"
+ "start": "next build && next start -p $PORT",
 "export": "next export",
 "deploy": "npm run build && npm run export"
},
```

**Task 6: Push Code to Github and Setup Continuous Delivery**


1. First, push your code to Github
2. Then use the Github repo (private or public) link and the access token to set up continuous deployment/delivery:

```bash
az webapp deployment source config \
 --branch master \
 --name hermapp \
 --repo-url <REPO URL eg: https://github.com/christiannwamba/herm-app> \
 --resource-group herm \
 --git-token <GITHUB ACCESS TOKEN>
```

Wait for 3-5 minutes for the build process to complete and run the following command to show your running app:

```bash
az webapp browse \
 --name <APP NAME> \
 --resource-group herm
```

![](https://paper-attachments.dropbox.com/s_BC403D2BFE0C3B066DBCCFD377C1B34BBCE7654080CD72F324A50E5BF331E423_1582547409727_image.png)

## Exercise 2: Staging Deployment Slot

It is never a good practice anywhere to push directly to master or production. Azure Deployment Slots lets you set up different slots for things like testing, reviews, etc. Let's create one for staging where you can test things out before pushing it to production.

**Task 1: Create a Slot**

Azure creates a default slot called **production**. You can see it by opening the app from the Azure portal and clicking the Deployment slots:

![](https://paper-attachments.dropbox.com/s_BC403D2BFE0C3B066DBCCFD377C1B34BBCE7654080CD72F324A50E5BF331E423_1582547887054_image.png)


To add one more (e.g. staging), run the following:

```bash
az webapp deployment slot create \
 --name <YOUR APP NAME> \
 --resource-group herm \
 --slot staging
```

**Task 2: Create a Staging Branch**

Create a staging branch on your Next.js app that you can push to the staging slot:

```bash
git checkout -b staging
```

You can make visual changes to this branch if you like, then push it to Github:

```bash
git push origin staging
```

**Task 3: Deploy Staging Branch to Staging Slot**

Finally, deploy the branch you just created to the staging slot:

```bash
az webapp deployment source config \
 --branch staging \
 --name <APP NAME> \
 --repo-url <REPO URL eg: https://github.com/christiannwamba/herm-app> \
 --resource-group herm \
 --git-token <GITHUB_ACCESS_TOKEN> \
 --slot staging
```

