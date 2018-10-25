// A Simple State Machine

const { Machine } = require('xstate')

const elevatorMachine = new Machine({
  key: 'elevator',
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

let currentElevatorState =
  elevatorMachine.initialState

function sendEvent(event) {
  currentElevatorState = elevatorMachine.transition(
    currentElevatorState,
    event
  )

  console.log(
    `Current State: ${currentElevatorState.value}`
  )
}

sendEvent('UP')
sendEvent('DOWN')
sendEvent('STOP')

sendEvent('FOO')
