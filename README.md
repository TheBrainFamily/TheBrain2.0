# TheBrain 2.0 
This is a repository for TheBrain 2.0 - The app that will make you remember everything forever.
It is live at [thebrain.pro](https://thebrain.pro), but also currently under a very heavy Work in Progress mode, please give us some time - we will be launching this early summer 2018.
## Motivation
We build this because of our passion to effective learning, and also as a showcase of how can you structure, code, and automate test/builds with the great modern tools of JS ecosystem.
What's unique about this project (besides the testing stack that allows for a huge amount of code reusability between unit/integration/end to end tests and also mobile/web/server, more about those soon ) - is the fantastic CI/CD pipeline - on every commit we deploy our app (mobile/web/server) to a serverless architecture, and our Friendly Bot publishes those information in a PR. You can then test the whole stack in a given version, end to end, before merging, and without even checking out the branch :-)

You pick up your phone, scan the QR code and you play around with the app connected to the server of a version matching your mobile. This is very powerful.

This is how this looks like (please don't try with the links from the screenshot, go to open PR if you want to check and see how it works) 

![friendly bot](http://i63.tinypic.com/ilccvs.jpg)

Our architecture also solves the problem of code reuse between different platforms. IN MANY CASES, including this one, the functionality of the web and mobile apps are so close to each other that it makes sense to reuse the business logic/queries (in our case mostly graphql queries/mutations) between them. 

## Our stack
* Web: [react](https://reactjs.org/) (create-react-app)
* Mobile: [react-native](https://facebook.github.io/react-native/), ([expo](https://expo.io/))
* Server: [node.js](https://nodejs.org) ([express](https://expressjs.com/)/[apollo/graphql](https://www.apollographql.com/))
* DB: [MongoDB](https://www.mongodb.com)
##### Testing frameworks:
* web - [jest](https://facebook.github.io/jest/) with [enzyme](https://github.com/airbnb/enzyme) and [cypress](https://www.cypress.io/) both with our custom "universal page objects pattern" (we will give you more info soon! very excited about this stuff)
* mobile - [jest](https://facebook.github.io/jest/) with [enzyme](https://github.com/airbnb/enzyme) and [detox](https://github.com/wix/detox), again, with our custom "universal page objects pattern"
* server - [jest](https://facebook.github.io/jest/)
## Getting Started
#### Prerequisites
```
- NodeJS version 8.9.4
- XCode version >= 9.0
- Docker or MongoDB version 3.4
- applesimutils (`brew tap wix/brew && brew install --HEAD applesimutils`)
- watchman (`brew install watchman`)
```
#### Prepering application
- Type `npm run buildAll` for build all necessary packages.

#### Starting local mongodb server
You can either use your local mongodb installation or start dockerized mongodb version. 
* To do so type following commands:
```
cd server
npm run startDockerizedMongo
```
#### Filling local mongodb server with default data
You need to fill your db with some predefined data. Otherwise your client app will have nothing to show.
 * From main application directory type:
```
npm run createDefaultDevDB
```
#### Starting server
You need to start server in order to web or mobile apps work correctly.
```
cd server
npm start
```
#### Starting web client
```
cd web
npm start
```
#### Starting mobile client
*Recommended way:* Please refer to [expo docs](https://docs.expo.io/versions/latest/introduction/installation.html) for guidance how to start/develop expo based mobile apps.
* You can also start react-native packager yourself by typing:
```
cd mobile
npm start
```
## Development
For development purposes please consider running in background following commands. 
* From main application directory type:
```
npm run testAll -- --watch
```

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
