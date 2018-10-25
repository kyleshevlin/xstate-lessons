Conceptually, a simple state machine is an object that contains a `states` property that enumerates all the possible (hence _finite_) states of a system and an `initialState` property to define our initial state.

To create a machine using `xstate`, we first import the `Machine` constructor from the library. Next, we create a machine instance by configuring our new `Machine`. Let's create a machine for an elevator.

An elevator, and by this I specifically mean the "box" part contained in the elevator shaft that you and I stand in and remain awkwardly silent for the duration of the trip, has three possible states: it can be stopped, moving upward, or moving downward. Our elevator will be initialized in the stopped state. The code for that looks like this.

```javascript
import { Machine } from 'xstate'

const elevatorMachine = new Machine({
  initialState: 'stop',
  states: {
    stop: {},
    up: {},
    down: {}
  }
})
```

We have left our states empty for the time being just to make it easy to see their enumeration. Now, we need to define transitions within our states to other states. We do this by enumerating the possible events that can trigger a state change within each state. An elevator that is stopped can only transition into a state where it is moving up or down. An elevator that is moving up can only transition into a state of stopped or moving down and the opposite is true for an elevator that is moving down. We accomplish this by using the `on` property, which is an object that contains keys that correlate to event types. Each event type's value will match the key of the next state.

```javascript
import { Machine } from 'xstate'

const elevatorMachine = new Machine({
  initial: 'stop',
  states: {
    stop: {
      on: {
        UP: 'up',
        DOWN: 'down'
      }
    },
    up: {
      on: {
        STOP: 'stop',
        DOWN: 'down'
      }
    },
    down: {
      on: {
        STOP: 'stop',
        UP: 'up'
      }
    }
  }
})
```

By convention, we uppercase our event types. Now that we have defined all the states and possible transitions, we can send events to our machine and update it's current state. Let's create a function so that we can send events to our Elevator, and log out the state derived from responding to that event.

```javascript
// Create a reference to the machine's current state
let currentElevatorState = elevatorMachine.initialState

function sendEventToElevator(event) {
  // Update our reference to the machine's current state
  currentElevatorState = elevatorMachine.transition(currentElevatorState, event)
  console.log(`Current State: ${currentElevatorState.value}`)
}
```

We use the `transition` method to move between states. We do this by passing in a state object and an event type. If you notice, our machine's don't maintain our state, they simply enumerate our possible states and define how we move between states. We are responsible for maintaining our state elsewhere. This is why `transition` is a pure function and requires that we pass in our current state. Let's update the state of our elevator a few times.

```javascript
sendEventToElevator('UP') // up
sendEventToElevator('DOWN') // down
sendEventToElevator('STOP') // stop
```

We can make our machine slightly more robust by putting into strict mode using the `strict` property. By doing this, if we attempt to send an event that isn't accounted for by the state in our machine, we will throw an error.

```javascript
const elevatorMachine = new Machine({
  strict: true,
  initial: 'stop',
  states: {
    stop: {
      on: {
        UP: 'up',
        DOWN: 'down'
      }
    },
    up: {
      on: {
        STOP: 'stop',
        DOWN: 'down'
      }
    },
    down: {
      on: {
        STOP: 'stop',
        UP: 'up'
      }
    }
  }
})
```

Now, if we try to send an event that's unaccounted for, an error will be thrown.

```javascript
sendEventToElevator('FOO') // Machine '(machine)' does not accept event 'FOO'
```

Our error indicates one more property of our machine that might be worth updating. In the error, the `key` of our machine is `'(machine)'`. We can use the `key` property to give our machine a name to identify it better in these messages.

```javascript
const elevatorMachine = new Machine({
  key: 'elevator',
  strict: true,
  intitial: 'stop',
  states: {
    stop: {
      on: {
        UP: 'up',
        DOWN: 'down'
      }
    },
    up: {
      on: {
        STOP: 'stop',
        DOWN: 'down'
      }
    },
    down: {
      on: {
        STOP: 'stop',
        UP: 'up'
      }
    }
  }
})
```

Now, when we trigger an error, we'll know it's from the elevator machine more easily.

```javascript
sendEventToElevator('FOO') // Machine 'elevator' does not accept event 'FOO'
```
