## Requirements

### How to install
- `npm install`
- `bower install`
- Download the Chrome LiveReload plugin

### Development
1. `npm run dev`
2. Go to local IP, not localhost, e.g. http://10.0.0.1:3000
3. Changes to `state.json` will automatically restart node

### Proxy to backend
1. Configure IP to backend in `config.json`
2. `npm run proxy`
3. Go to local IP, not localhost, e.g. http://10.0.0.1:3000

### Build for production
1. `gulp deploy`
2. Files are available in `dist/` folder

## Application flow
1. index.html is received
2. Client creates cookie (WebsocketService.js)
3. Client connects to websocket on port 23112
4. Client receives a state object that maps to a route state transition and state put on the $rootScope, making it available to the whole application
5. Client can trigger an action `AppService.action('whatever', {foo: 'bar'})` where backend returns a brand new state object, making the client do transitions etc.

## Building an app

### Creating a view
1. In `main.js` add a new abstract state (app.weight) and point to a controller (WeightController)
2. Create the WeightController and use this to capture clicks and trigger actions
3. Create a specific state (app.weight.weighing) that points to a template ('weight/weighing.html')
4. Add content to HTML

### Trigger actions
In a template
```html
<button ng-click="nextPage()" disabled="!allowAction">Next page</button>
```
The global **allowAction** state is used to identify when it is actually allowed to do an action. Use it on elements to indicate that an action is being processed.

```javascript
.controller('SomeCtrl', function ($scope, AppService) {
  $scope.nextPage = function () {
    AppService.action('nextPage', {foo: 'bar'});
  };
});
```

### Adding state
You grab state from server in any template by default using:
```html
<button>{{state.foo}}</button>
```
To change the state delivered you can go into `server/controller.js` and change the
default state object. This will restart the server and you will instantly see the change.

=======

### FAQ

#### What websocket port is used?
It is hard coded to 23112

#### Where is the index.html file?
You can find it in the `assets/` folder. It is copied into build and dist respectively

#### How to get home screen icons?
Put image files into assets folder and reference them in the `index.html` file in the assets folder

#### The server does not deliver the app
Remember to install npm and bower deps. Also remember to run `gulp` before running the server the first time
