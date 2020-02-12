---
title: "1.3 App Shell"
metaTitle: "App Shell"
metaDescription: "Anything that tends to remain the same on a dynamic shell can be considered as part of the app’s shell"
---

We have a project set up, and we are ready to start fleshing out the app UI. First, we need to start with the layout, which all the pages will share. This layout needs to be a component for it to be reusable across pages.


## Objectives

- Install `herm`'s UI library
- Create a layout component
- Add a header and a sidebar


## Exercise 1: Create a layout component

Let’s create our first component.

Add a `components/Layout.js` file with the following content:

```js
import React from 'react';
import { Box, Flex } from 'herm';

import Header from './Header';
import Sidebar from './Sidebar';
import Main from './Main';

function Layout({ children }) {
  return (
    <Box>
      <Header></Header>
      <Flex>
        <Sidebar></Sidebar>
        <Main>{children}</Main>
      </Flex>
    </Box>
  );
}

export default Layout;
```

At this point, you are wondering what the `herm` library is and where the `Header`, `Sidebar`, and `Main` components are coming from. Let’s dig into those.

While I was creating this workshop, I did not want you to spend so much time on styling elements, so I took the liberty and created a set of UI components that you can import, add props and you have a good looking interface.

I created and published them on npm as `herm` so go ahead and install in your app with:

```bash
npm install --save herm
```

To see this layout in action, update your `pages/index.js` to make use of it:

```js
import React from 'react';
import { Text } from 'herm';

import Layout from '../components/Layout';

function Index() {
  return (
    <Layout>
      <Text fontSize="32px">Hello, Herm</Text>
    </Layout>
  );
}

export default Index;
```

Things should blow up with error since some components being used are yet to be created.

## Exercise 2: Create app shell components

App shell components make up the layout. They include headers, sidebars, navigation, footers, etc. Anything that tends to remain the same on a dynamic shell can be considered as part of the app’s shell.

Create a `Header` component by adding the following in a `components/Header.js` file:

```js
import React from 'react';

import { Box, Flex, LogoIcon, User } from 'herm';

function Header() {
  return (
    <Box backgroundColor="#fafafb" paddingLeft="50px" paddingRight="50px">
      <Flex alignItems="center" justifyContent="space-between" height="50px">
        <LogoIcon></LogoIcon>
        <User
          username="Christian Nwamba"
          sub="Scheduled for 16th December at 09:30 AM"
        >
          <Flex alignItems="center">
            <Box>
              <User.Avatar></User.Avatar>
            </Box>
            <Box marginLeft="12px">
              <User.Username></User.Username>
            </Box>
          </Flex>
        </User>
      </Flex>
    </Box>
  );
}

export default Header;
```
 

Create a `Sidebar` component by adding the following in a `components/Sidebar.js` file:

```js
import React from 'react';
import { Box, Nav, NavItem, ScheduleIcon, FeedsIcon, ProfileIcon } from 'herm';

function Sidebar() {
  return (
    <Box
      backgroundColor="#fafafb"
      height="100vh"
      width="270px"
      paddingTop="40px"
      paddingLeft="30px"
      paddingRight="30px"
    >
      <Nav>
        <NavItem Icon={FeedsIcon}>Feeds</NavItem>
        <NavItem Icon={ScheduleIcon}>Schedule</NavItem>
        <NavItem Icon={ProfileIcon}>Account</NavItem>
      </Nav>
    </Box>
  );
}

export default Sidebar;
```

Create a `Main` component by adding the following in a `components/Main.js` file:

```js
import React from 'react';
import { Box } from 'herm';

function Main({ children }) {
  return (
    <Box paddingLeft="40px" paddingTop="40px">
      {children}
    </Box>
  );
}

export default Main;
```

Once you save all these and take another look at your browser, you will see that we are making good progress:


![](https://paper-attachments.dropbox.com/s_1F0ED8DFFEEF1F84DC761018FF646494DFA8F39DF8A1956D7C3FDB86DC604B3D_1579006575893_image.png)


