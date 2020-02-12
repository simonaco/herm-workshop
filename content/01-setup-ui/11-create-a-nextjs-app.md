---
title: "1.1 Create a Next.js App"
metaTitle: "Create a Next.js App"
metaDescription: "When compared with using only React, Next.js already has server-rendering configured out of the box."
---

Before we dive into the main UI stuff, you are probably wondering why Next.js? When compared with using only React, Next.js already has server-rendering configured out of the box. Even if server-side rendering would have been in easy in a basic React app, as soon as you start daring with features like data fetching, routing, etc., things start getting both messy and challenging.

What Next.js has done really well, is to give us a platform to build React apps on while enjoying all the benefits of rendering these apps on the server.


## Objectives


- Create a Next.js app
- Learn how to create Next.js apps using existing templates (e.g., Apollo GraphQL template)


## Exercise 1: Create a Next.js App

**Task 1: Download an Apollo-based Next.js App**

You can either [manually](https://github.com/zeit/next.js/#manual-setup) create a Next.js app or use the `create-next-app` CLI tool. Create a project folder where you want everything regarding herm to live. 

```bash
mkdir herm
```

In the new folder you just created, create Next.js app:

```bash
# Install the CLI tool
npm install -g create-next-app

# Create a new app
create-next-app --example with-apollo
```

Note that I have passed the `--example` argument with a value of `with-apollo`. What this means is that `create-next-app` is going to create a new app based on the Apollo Graphql [template](https://github.com/zeit/next.js/tree/canary/examples/with-apollo).

Using a template saves us the time of setting up Apollo manually. If we did set up manually, we would also have to configure Next.js manually to render Apollo query responses to the server.

Once the setup starts, the CLI tool will ask you to name your project — I called mine app. The setup will also install the npm dependencies, so we don’t have to do that.

![CLI Installation](https://paper-attachments.dropbox.com/s_B020FEEBF4767840022187CA0BA6A0F6CA541E25134EC513599691F5CCDF563A_1578845462086_image.png)


**Task 2: Run the Next.js app**

Change your directory into the app’s directory and run the app:

```bash
# Change directory
cd app

# Run the app
npm run dev
```

You should get a good-looking Hacker News clone:


![First, run with Hacker News UI](https://paper-attachments.dropbox.com/s_B020FEEBF4767840022187CA0BA6A0F6CA541E25134EC513599691F5CCDF563A_1578846258933_image.png)


## Exercise 2: Reset

If only we were building a Hacker News app, we could have just changed the blue to herm’s pink brand color and called it a day. We have to wipe everything except Next.js and Apollo related stuff.

```bash
# Delete components and pages folder
rm -rf components pages
```

Now if you take a look at the app in the browser again, we should be getting a nice 404:


![404 after reset](https://paper-attachments.dropbox.com/s_B020FEEBF4767840022187CA0BA6A0F6CA541E25134EC513599691F5CCDF563A_1578846877978_image.png)


At this point, you are wondering why removing those two folders resulted in a 404 page. Well, the way Next.js works is that every file in the `pages` folder must be a component, and each of these components will serve as web pages.

If Next.js doesn’t find the appropriate file in the pages folder, in this case, `pages/index.js` for `/` route, it will throw a 404. This is nice because you get basic routing stuff for free.

It’s also good to note that, by convention, any other component that does not map to a route should be kept in the `components` folder.

Now re-create those folders, but this time with the bare minimum content:

```bash
# Recreate
mkdir components pages

# Add a file in the pages folder
touch pages/index.js
```

If you retake a look at the app, you should see a more detailed error. The error is telling you that although it sees a page file, that file doesn’t export a valid React component.


![Error after pages/index.js is added](https://paper-attachments.dropbox.com/s_B020FEEBF4767840022187CA0BA6A0F6CA541E25134EC513599691F5CCDF563A_1578847389080_image.png)


Add the following to the `pages/index.js`:

```js
import React from 'react';

function Index() {
 return <h1>Hello, Herm!</h1>;
}

export default Index
```

Once you save, you should get a greeting:


![](https://paper-attachments.dropbox.com/s_B020FEEBF4767840022187CA0BA6A0F6CA541E25134EC513599691F5CCDF563A_1578847588292_image.png)


