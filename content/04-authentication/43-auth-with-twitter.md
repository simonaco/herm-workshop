---
title: "4.3 Auth with Twitter"
metaTitle: "Auth with Twitter"
---

We are building a Twitter app; hence it only makes sense to authenticate users with their Twitter account. That’s our first step to gaining authorized access to their account and tweeting on their behalf.


## Objectives
- Create a Twitter Developer App
- Setup Twitter login from Auth0
- Disable Email and Password login



## Exercise 1: Create a Twitter Developer App

Just like you created an Auth0 client and got a Client ID and secret, you need a Twitter key and secret to authenticate users with Twitter.

Go to the [Twitter Developer create page](https://developer.twitter.com/en/apps/create) 


![](https://paper-attachments.dropbox.com/s_7D07C43A55ADEAA0FD2721401D80E19A5D924395AB33EB3083B677E9DFBF2299_1583660364811_image.png)


Fill out the form as follows:


- **App Name**: The name you want the app to be recognized with. Eg: Herm
- **App Description**: This is what your users will see if they need more information about your app before approving access
- **Website URL**: Your production URL. Should be the URL you deployed your frontend Next.js app on.
- **Callback URLs**: Should look like https://YOUR_DOMAIN/login/callback where `YOUR_DOMAIN` is your **Auth0 domain.** Auth0 domains look like `<username>.auth0.com`.
- **Tell us how this app will be used**: Twitter needs this to approve your app. It usually gets approved in less than 24hrs, including weekends. Let them know that you are using the app for learning and demo purposes.


Click **Create** once you are done filling the form.

When your app is approved, you can click on the Details of the app to get its credentials.


![](https://paper-attachments.dropbox.com/s_7D07C43A55ADEAA0FD2721401D80E19A5D924395AB33EB3083B677E9DFBF2299_1583734801697_image.png)


When the Details page opens, Click **Keys, and tokens**

![](https://paper-attachments.dropbox.com/s_7D07C43A55ADEAA0FD2721401D80E19A5D924395AB33EB3083B677E9DFBF2299_1583734858835_image.png)


Here you can find all your Twitter app credentials:

![](https://paper-attachments.dropbox.com/s_7D07C43A55ADEAA0FD2721401D80E19A5D924395AB33EB3083B677E9DFBF2299_1583734667083_image.png)



## Exercise 2: Setup Twitter login from Auth0

Auth0 needs the credentials you got from Twitter to authenticate users on your behalf. 

From the sidebar on your Auth0 dashboard, click to expand the **Connections** menu and choose **Social**. Enable Twitter.

![](https://paper-attachments.dropbox.com/s_7D07C43A55ADEAA0FD2721401D80E19A5D924395AB33EB3083B677E9DFBF2299_1583734313655_image.png)


Once you enable, a modal will pop up to enter the credentials from Twitter.


![](https://paper-attachments.dropbox.com/s_7D07C43A55ADEAA0FD2721401D80E19A5D924395AB33EB3083B677E9DFBF2299_1583734505950_image.png)


Paste the **Consumer API Key** and **Consumer API Secret** from Twitter, then click **SAVE**.

Ensure that Twitter Connection is enabled for your specific app by going back to **Applications**, choose the app you created, and click the **Connections** tab


![](https://paper-attachments.dropbox.com/s_7D07C43A55ADEAA0FD2721401D80E19A5D924395AB33EB3083B677E9DFBF2299_1583735223408_image.png)


If Twitter is not enabled already, enable it.

Log out (http://localhost:3000/api/logout) and log in again (http://localhost:3000/api/login). You should see the Twitter option:


![](https://paper-attachments.dropbox.com/s_7D07C43A55ADEAA0FD2721401D80E19A5D924395AB33EB3083B677E9DFBF2299_1583735497069_image.png)

## Exercise 3: Disable Email & Password Login

We don’t need to log in with Email and Password — Twitter is enough for our use-cases.

Go back to **Applications**, choose the app you created, and click the **Connections** tab. Turn off Username-Password-Authentication.


![](https://paper-attachments.dropbox.com/s_7D07C43A55ADEAA0FD2721401D80E19A5D924395AB33EB3083B677E9DFBF2299_1583735845676_image.png)


Log in again, and you should get only Twitter as your login option:


![](https://paper-attachments.dropbox.com/s_7D07C43A55ADEAA0FD2721401D80E19A5D924395AB33EB3083B677E9DFBF2299_1583735889399_image.png)


