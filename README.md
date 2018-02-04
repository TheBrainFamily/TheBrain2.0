# TheBrain 2.0 
This is a repository for TheBrain 2.0 - The app that will make you remember everything forever.
It is live at [https://thebrain.pro], but also currently under a very heavy Work in Progress mode, please give us some time - we will be launching this early February 2018.
## Motivation
We build this because of our passion to effective learning, and also as a showcase of how can you structure, code, and automate test/builds with the great modern tools of JS ecosystem.
## Our stack
* Web: react (create-react-app)
* Mobile: react-native (expo)
* Server: node.js (express/apollo/graphql)
* DB: MongoDB
##### Testing frameworks:
* web - jest with enzyme and cypress both with our custom "universal page objects pattern" (we will give you more info soon! very excited about this stuff)
* mobile - jest with enzyme and detox, again, with our custom "universal page objects pattern"
* server - jest
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
**Recommended way:** Please refer to [https://docs.expo.io/versions/latest/introduction/installation.html] for guidance how to start/develop expo based mobile apps.
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
