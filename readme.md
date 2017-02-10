Integrating createStore with React
==============

In this lesson, we will learn how to integrate our `createStore` library with our React application.  By the end of the lesson you will be able to:

  * Integrate the `createStore` method with React.
  * Properly structure a React-Redux code base.

## Our Goal
Our goal is to rebuild our counter application with React while maintaining the same user experience. So once again, when we click on a button, the count should increase.

The code for creating our store is in our `createStore.js` file.  Take a look at it.  Notice that for responding to events we are just using plain JavaScript.   

      ...
      let button = document.getElementById('button');
      button.addEventListener('click', function(){
        store.dispatch({type: 'INCREASE_COUNT'})
      })

Instead we want to use React to trigger calls to our `dispatch` function.  But first things first.  Let's create the React side of our application.

## Building Our React Interface
Move over to the counter folder, and boot up the app.  If you look at the `src/App.js` file, you will see the following.  That's where we'll put our new component called `Counter`.

```javscript

render() {
      return (
        <div className="App">
          place counter component here
        </div>
      );
    }

```

  So now, in `src/components/Counter.js`, we would like a button and a place where we can display the current count.
	
```javascript

// components/Counter.js

    import React, { Component } from 'react'

    class Counter extends Component {
      render(){
        return (<div>
          <button> Click Me</button>
          <div> 0 </div>
        </div>
        )
      }
    }

    export default Counter;

```

And in `src/App.js`:
  
```javascript

// src/App.js
    import React, { Component } from 'react';
    import Counter from './components/Counter'

    class App extends Component {
      render() {
        return (
          <div className="App">
            <Counter />
          </div>
        );
      }
    }

    export default App;

```

Now we should see a button on the page.  Looks like the visuals for our React component are complete.  The next thing to do is to integrate some Redux.

## Importing Redux
 Start by looking at the file called `src/createStore.js`.  Take the `createStore` function from the `redux-pattern.js` file and move it into the `createStore.js` file and make it the default export.

```javascript

    export default function createStore(){
      ...
    }

```

In the `createStore` function, you will find our `render` function.  We need that function to re-render our component every time our store is updated.  

Ok, now that we have added our `createStore` method, we will want to use it.  But remember that `createStore()` takes an argument of a reducer.  Let's move that over.  Open the file called `src/reducers/changeCount.js`.  Find the `changeCount` method from the `redux-pattern.js` file and move it into the `changeCount` file in the reducer folders.

```javascript

	export default function changeCount(){
		...
	}

```

Ok, done and done.  We moved our Redux code over to our new application, and we already built out our React component, so the only thing left is to tie these two pieces together.  Let's do it!

## Integrating Redux

This is the plan.  First, we create our store by passing our reducer to the `createStore` method.  Then we can call `store.dispatch` from a React component by passing through the store object as a prop to the needed component.  Essentially, we want to call `store.dispatch({type: 'INCREASE_COUNT'})` when we click on the button.  

So we do the following:

  1. Create the store and pass it through our React app as a prop.

```javascript
		// /src/index.js
    
		...
		import changeCount from './reducers/changeCount'
		import createStore from './createStore'

	    let store = createStore(changeCount)
	    ReactDOM.render(
	    	<App store={store} />,
	    	document.getElementById('root')
    	);
```

Ok, this is pretty good.  Now our app component will have access to the store, and because of this, we can call `store.dispatch({type: 	'INCREASE_COUNT'})` every time the user clicks on a button.  Let's get to it.

2. Dispatch an action each time the button is clicked.

So now that we have access to the store from inside of the `Counter`, we can write the following.

```javascript

	class Counter extends Component {
        	handleOnClick(){
          		this.props.store.dispatch({type: 'INCREASE_COUNT'})
        	}
	        render(){
	          return (<div>
	            <button onClick={this.handleOnClick.bind(this)}> Click Me</button>
	            <div> {this.props.store.getState().count} </div>
	          </div>
	          )
	        }
		}

```	

What does this code do?  Well the button has a callback that corresponds to the `onClick` event, and each time a button is clicked it calls our `handleOnClick` function. `handleOnClick` accesses the store from our props that we passed through, and dispatches an action to increase the count.

Click on the button!  Hmmm...nothing happens. Take a look at the console.  If you click on the button, you should see the following:

    the state is 1
    
    the action is INCREASE_COUNT

You see that because we added a couple of `console.logs` in our dispatch method.  It looks like the action is being dispatched and the state is increasing.  Why then is our DOM not updating?  The problem is React never receives these updates.

3. Tell React about these updates by re-rendering

The easy way to tell React about these updates is simply to re-render the entire application.  While this is a pretty non-performant practice, its fine for now.  Doing it is fairly straightforward.

What we need to do is wrap our `ReactDom.render` call in a function called `render`.  Then we need to call `render` from our `dispatch` method in `createStore`.  So we do the following:

```javascript

    // index.js

		export function render(){
	        ReactDOM.render(
	          <App store={store} />,
	          document.getElementById('root')
	        );
      	}

```

Then in `createStore.js`, we import the `render` function from our `index.js` file.  We also need to remove the `render` function inside our `createStore` function.  Finally, make sure there is no `dispatch` call in the `createStore` function.  Instead we can call `store.dispatch({type: '@@INIT'})` in the `index.js` file.  Ultimately our `createStore` file looks like the following.
	
```javascript

		import { render } from './index.js'

		export default function createStore(reducer){
		    let state;

		    function dispatch(action){
		      state = reducer(state, action)
		      console.log(`the state is ${state.count}`)
		      console.log(`the action is ${action.type}`)
		      render()
		    }
	
		    function getState(){
		      return state;
		    }
	
	
		    
		    return {dispatch: dispatch, getState: getState}
	
		  }
```

And our `index.js` file looks like the following.

``` javascript 

		import React from 'react';
		import ReactDOM from 'react-dom';
		import App from './App';
		import changeCount from './reducers/changeCount'
		import createStore from './createStore'

		let store = createStore(changeCount)
		
		export function render(){
		  ReactDOM.render(
		    <App store={store} />,
		    document.getElementById('root')
		  );
		}
		
		store.dispatch({type: '@@INIT'})

```
  
  Woohoo! Our counter app works!

## Summary
Take a look through the code again.  Essentially now the flow is that a React eventHandler calls a callback which then calls `store.dispatch()` to dispatch an action. Inside the dispatch action, we have a call to render, which re-renders our application.  So every time someone clicks a button, the store is updated, and then the application is re-rendered.
  

