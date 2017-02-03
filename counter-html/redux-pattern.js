function createStore(reducer){
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

    function render(){
      console.log('render called')
    }

    return {dispatch: dispatch, getState: getState}
  }

  function changeCount(state = {count: 0}, action){
      switch (action.type) {
        case 'INCREASE_COUNT':
          return {count: state.count + 1}
        default:
          return state;
      }
    }


    function render(){
      let container = document.getElementById('container')
      container.textContent = store.getState.count
    }

    let store = createStore(changeCount)
    let button = document.getElementById('button');
    button.addEventListener('click', function(){
      dispatch({type: 'INCREASE_COUNT'})
    })
