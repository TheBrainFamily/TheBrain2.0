This is a repository for TheBrain 2.0 - The app that will make you remember everything forever.

We build this because of our passion to effective learning, and also as a showcase of how can you structure, code, and automate test/builds with the great modern tools of JS ecosystem.

We are using here:

react (create-react-app) - for web,
react-native (expo) - for ios/android,
express/apollo/graphql - for server

for testing web - jest with enzyme and cypress both with our custom "universal page objects pattern" (we will give you more info soon! very excited about this stuff)

for testing mobile - jest with enzyme and detox, again, with our custom "universal page objects pattern"

for testing server - jest

This is live at https://thebrain.pro, but also currently under a very heavy Work in Progress mode, please give us some time - we will be launching this early February 2018.


### Requirements

- XCode version 9.2
- Docker
- applesimutils (`brew tap wix/brew && brew install --HEAD applesimutils`)
- watchman (`brew install watchman`)
- NodeJS version 8.9.4


### Prepering application
- Type `npm run buildAll` for build all necessary packages.


### Starting local mongodb server
From main application directory type:
```
cd server
npm run startLocalDB
```

### Filling local mongodb server by default data
From main application directory type:
```
npm run createDefaultDevDB
```

### Starting server
From main application directory type:
```
cd server
npm start
```

### Starting mobile application
From main application directory type:
```
cd mobile
npm start
```

### Starting web
From main application directory type:
```
cd web
npm start
```
