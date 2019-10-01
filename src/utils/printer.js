'use strict';

function printStates(mdp) {
  console.log('States');

  for (const state of mdp.states()) {
    console.log(`  State: ${state}`);
  }
}

function printActions(mdp) {
  console.log('Actions');

  for (const action of mdp.actions()) {
    console.log(`  Action: ${action}`);
  }
}

function printTransitionFunction(mdp) {
  console.log('Transition Function');

  let isValid = true;

  for (const state of mdp.states()) {
    for (const action of mdp.actions()) {
      console.log(`  Transition: (${state}, ${action})`);

      let totalProbability = 0;

      for (const successorState of mdp.states()) {
        const probability = mdp.transitionFunction(state, action, successorState);
        totalProbability += probability;
        console.log(`    Successor State: ${successorState} -> ${probability}`);
      }

      isValid = isValid && totalProbability == 1;
      console.log(`    Total Probability: ${totalProbability}`);
    }
  }

  console.log(`  Status: ${isValid ? 'Valid' : 'Invalid'}`);
}

function printRewardFunction(mdp) {
  console.log('Reward Function');

  for (const state of mdp.states()) {
    console.log(`  State: ${state}`);

    for (const action of mdp.actions()) {
      const reward = mdp.rewardFunction(state, action);
      console.log(`    Action: ${action} -> ${reward}`);
    }
  }
}

function printStartState(mdp) {
  console.log(`Start State: ${mdp.startState()}`);
}

function printMdp(mdp) {
  printStates(mdp);
  printActions(mdp);
  printTransitionFunction(mdp);
  printRewardFunction(mdp);
  printStartState(mdp);
}

function printGridWorld(gridWorld) {
  for (let row = 0; row < gridWorld.height; row++) {
    let text = '';
    for (let column = 0; column < gridWorld.width; column++) {
      if (gridWorld.grid[row][column] == 'W') {
        text += '\u25A0';
      } else if (gridWorld.grid[row][column] == 'G') {
        text += '\u272A';
      } else if (row == gridWorld.position.row && column == gridWorld.position.column) {
        text += '\u229B';
      } else {
        text += '\u25A1';
      }
      text += '  ';
    }
    console.log(`${text}`);
  }
}

function printPolicy(policy, gridWorld, morality) {
  const symbols = {
    'STAY': '\u2205',
    'NORTH': '\u2191',
    'EAST': '\u2192',
    'SOUTH': '\u2193',
    'WEST': '\u2190'
  };

  for (let row = 0; row < gridWorld.height; row++) {
    let text = '';
    for (let column = 0; column < gridWorld.width; column++) {
      const state = gridWorld.width * row + column;
      if (gridWorld.grid[row][column] == 'W') {
        text += '\u25A0';
      } else if (gridWorld.grid[row][column] == 'G') {
        text += '\u272A';
      } else if (morality && morality.forbiddenStates.includes(state)) {
        text += '\u2A0D';
      } else {
        text += symbols[policy[state]];
      }
      text += '  ';
    }
    console.log(`${text}`);
  }
}

module.exports = {
  printStates,
  printActions,
  printTransitionFunction,
  printRewardFunction,
  printStartState,
  printMdp,
  printGridWorld,
  printPolicy
};
