'use strict';

const solver = require('javascript-lp-solver');

const DISCOUNT_FACTOR = 0.95;

function getConstraints(mdp) {
  const constraints = {};

  for (const successorState of mdp.states()) {
    const limit = successorState == mdp.startState() ? 1 : 0;
    constraints['maxSuccessorState' + successorState] = {'max': limit};
    constraints['minSuccessorState' + successorState] = {'min': limit};
  }

  return constraints;
}

function getVariables(mdp) {
  const variables = {};

  for (const state of mdp.states()) {
    for (const action of mdp.actions()) {
      variables['state' + state + action] = {'value': mdp.rewardFunction(state, action)};

      for (const successorState of mdp.states()) {
        let value = successorState == mdp.startState() ? -1 : 1;

        if (state == successorState) {
          value *= DISCOUNT_FACTOR * mdp.transitionFunction(state, action, successorState) - 1;
        } else {
          value *= DISCOUNT_FACTOR * mdp.transitionFunction(state, action, successorState);
        }

        variables['state' + state + action]['maxSuccessorState' + successorState] = value;
        variables['state' + state + action]['minSuccessorState' + successorState] = value;
      }
    }
  }

  return variables;
}

function getProgram(mdp, transformer) {
  const program = {
    'optimize': 'value',
    'opType': 'max',
    'constraints': getConstraints(mdp),
    'variables': getVariables(mdp)
  };

  if (transformer) {
    transformer.transform(mdp, program);
  }

  return program;
}

function getPolicy(mdp, result) {
  const policy = {};

  const occupancyMeasures = normalize(mdp, result);

  for (const state of mdp.states()) {
    let optimalOccupancyMeasure = Number.NEGATIVE_INFINITY;
    let optimalAction = null;

    for (const action of mdp.actions()) {
      const occupancyMeasure = occupancyMeasures['state' + state + action];

      if (occupancyMeasure > optimalOccupancyMeasure) {
        optimalOccupancyMeasure = occupancyMeasure;
        optimalAction = action;
      }
    }

    policy[state] = optimalAction;
  }

  return policy;
}

function normalize(mdp, result) {
  for (const state of mdp.states()) {
    for (const action of mdp.actions()) {
      if (isNaN(result['state' + state + action])) {
        result['state' + state + action] = 0;
      }
    }
  }
  return result;
}

function solve(mdp, transformer) {
  const program = getProgram(mdp, transformer);
  const result = solver.Solve(program);

  if (!result.feasible) {
    return false;
  }

  return getPolicy(mdp, result);
}

module.exports = {
  solve
};
