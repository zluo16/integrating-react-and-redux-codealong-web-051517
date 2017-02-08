Integrating createStore with React
==============

In this lesson, we will learn how to integrate our createStore library with our react application. By the end of the lesson you will be able to:

  * Integrate the createStore method with react.
  * Properly structure a react redux code base.

## Our Goal

Our goal is to rebuild our counter application with the same user experience, but this time to use react to do it. So once again, when we click on a button, and the count should increase.

Ok, so the code for creating our store is in our `./redux-pattern.js` file. Take a look at it. Notice that for responding to events we are just using plain javascript.   

```JavaScript
...

const store = createStore();
let button = document.getElementById('button');
button.addEventListener('click', function(){
  store.dispatch({ type: 'INCREASE_COUNT' });
})
```

If you would like to try it out open the index.html file in your browser.

Now let's create the react side of our application.

## Building Our React Interface

Ok, now let's boot up the app by running `npm install && npm start`. This should open a browser window with the app running. You should only see the test `Counter Component here`. If you look at the `./src/App.js` file, you will see the following code. This is where we'll put our new component called counter.

```JavaScript
// ./src/App.js

import React, { Component } from 'react';

class App extends Component {
  render() {
    return (
      <div className="App" >
        Counter Component here.
      </div>
    );
  }
}

export default App;
```

So now, in `./src/components/Counter.js`, we would like a button and a place where we can display the current count.

```JavaScript

// ./src/components/Counter.js

import React from 'react'

export default (props) => {
  return (
    <div>
      <button>Click Me</button>
      <div>0</div>
    </div>
  )
};
```

We now want to add the _Counter Component_ to to the `./src/App.js` Component and pass in the store as props.

```JavaScript
// ./src/App.js

import React, { Component } from 'react';
import Counter from './components/Counter';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Counter />
      </div>
    );
  };
};

export default App;
```

Ok, now we should see a button on the page.  Looks like the visuals for our react component is complete.  The next thing to do is to integrate some redux.

## Importing Redux

Start by looking at the file `./src/createStore.js`. Take the createStore function from our `./redux-pattern.js` file and move it into the `./src/createStore.js` file. We also need to comment out the `render()` function closure fro the `dispatch()` function. We will come back to that latter.

```JavaScript
// ./src/createStore.js

export default function createStore(reducer) {
  let state;

  function dispatch(action) {
    state = reducer(state, action)
    console.log(`the state is ${state.count}`)
    console.log(`the action is ${action.type}`)
    // render()
  }

  function getState(){
    return state;
  }

  return {
    dispatch,
    getState
  }
}
```

In the `createStore()` function, you will find it calling a closure function called `render()` that we imported form `./src/index.js`. We need that function to re-render our component every time our store is updated.  

Ok, now that we have added our create store method, we will want to use it. But remember that `createStore()` takes an argument of a reducer. So let's move that over too. Open the file `./src/reducers/changeCount.js`. Find the changeCount method from the `./redux-pattern.js` file and move it into the `./src/reducers/changeCount.js`.

```JavaScript
// ./src/reducers/changeCount.js

export default function changeCount(state = {
  count: 0
}, action) {
  switch (action.type) {
    case 'INCREASE_COUNT':
      return { count: state.count + 1 };
    default:
      return state;
  };
};
```

Ok, done and done. We moved our redux code over to our new application, and we already built out our react component, so the only thing left is to tie these two pieces together. Let's do it!

## Integrating Redux

So this is the plan. First, we create our store by passing our reducer to the `createStore()` function. Then we can call `store.dispatch()` from a React component by passing through the store object as a prop to the needed component. Essentially, we want to call `store.dispatch({ type: 'INCREASE_COUNT' })` when we click on the button.  

So we'll do the following:

1. Create the store and pass it through our react app as a prop.

  We will need to import our reducer and a store and set a variable of store that calls our `createStore()` function. We also need to pass our store variable as props to our _App component_. Our `'./src/index.js'` code should now look like this:

  ```Javascript
  // ./src/index.js

  import React from 'react';
  import ReactDOM from 'react-dom';
  import App from './App';
  import changeCount from './reducers/changeCount';
  import createStore from './createStore';

  const store = createStore(changeCount);

  export function render() {
    ReactDOM.render(
      <App store={store} />,
      document.getElementById('root')
    );
  };

  render();
  ```

  Ok, this is pretty good.  Now our app component will have access to the store, and because of this, we can call `store.dispatch({ type: 	'INCREASE_COUNT' })` every time the user clicks on a button.


2. Dispatch an action each time the button is clicked.

	So now that we have access to the store from inside of the _Counter Component_, we can write the following.

  ```JavaScript
  import React from 'react'

  export default (props) => {

    const handleOnClick = () => {
      props.store.dispatch({ type: 'INCREASE_COUNT' });
    }

    return (
      <div>
        <button onClick={handleOnClick}>
          Click Me
        </button>
        <div>{props.store.getState().count}</div>
      </div>
    )
  };

  ```

	What does this code do? Well the button has a callback to the onClick event, and each time a button is clicked it calls our handleOnClick function. Then handleOnClick accesses the store from our props that we passed through, and dispatches an action to increase the count.

  Click on the button! Ok so nothing happens. But take a look at the console. If you click on the button you should see the following.

  the state is 1

  the action is INCREASE_COUNT

  You see that because we added a couple of console.logs in our dispatch method. So it looks like the action is being dispatched and the state is increasing. Why then is our DOM not updating?  The problem is react never here's these updates.

3. Tell react about these updates by re-rendering

	Ok, so the easy way to tell react about these updates is simply to re-render the entire application.  While this is a pretty non-performant practice, its fine for now.  And doing it is fairly straightforward.

	Since our `ReactDom.render()` call is wrapped in a export function called render, in our `./src/index.js`. Then we just need to call render from our dispatch method in createStore. So we need to do the following:

  In our `./src/createStore.js` we need to import the `render()` function from our `./src/index.js` file and uncomment the `render()` function closure in the `dispatch()` function. So ultimately our `./src/createStore.js` file looks like the following.

  ```JavaScript
  // ./src/createStore.js

  import { render } from './index.js';

  export default function createStore(reducer) {
    let state;

    function dispatch(action) {
      state = reducer(state, action)
      console.log(`the state is ${state.count}`)
      console.log(`the action is ${action.type}`)
      render();
    }

    function getState() {
      return state;
    }

    return {
      dispatch,
      getState
    }
  }
  ```

  We also need to initiate a dipsatch method to start the store state in our `./src/index.js` file. Our `./src/index.js` file should now look like the following:

  ```JavaScript
  // ./src/index.js

  import React from 'react';
  import ReactDOM from 'react-dom';
  import App from './App';
  import changeCount from './reducers/changeCount';
  import createStore from './createStore';

  const store = createStore(changeCount);

  export function render() {
    ReactDOM.render(
      <App store={store} />,
      document.getElementById('root')
    );
  };

  store.dispatch({ type: '@@INIT' });

  // remove render() here
  ```

  Ok, now our counter app works!

## Summary

Take a look through the code again. Essentially now the flow is that a React eventHandler calls a callback which then calls `store.dispatch()` to dispatch an action. Inside the dispatch action, we have a call to `render()`, which re-renders our application. So each time someone clicks on our counter button, the store is updated, and then the application is re-rendered.
