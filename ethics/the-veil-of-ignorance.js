'use strict';

function isEquivalent(agentFactoredState, memberFactoredState, stateFactors, veiledStateFactors) {
  for (const stateFactor of stateFactors) {
    if (!veiledStateFactors.includes(stateFactor)) {
      if (agentFactoredState[stateFactor] != memberFactoredState[stateFactor]) {
        return false;
      }
    }
  }
  return true;
}

class TheVeilOfIgnorance {
  constructor(moralCommunity, veiledStateFactors, inequityTolerance) {
    this._moralCommunity = moralCommunity;
    this._veiledStateFactors = veiledStateFactors;
    this._inequityTolerance = inequityTolerance;
  }

  getMoralCommunity() {
    return this._moralCommunity;
  }

  getVeiledStateFactors() {
    return this._veiledStateFactors;
  }

  getInequityTolerance() {
    return this._inequityTolerance;
  }

  transform(agent, program) {
    for (const member of this._moralCommunity) {
      for (const agentState of agent.states()) {
        for (const memberState of member.states()) {
          const agentFactoredState = agent.getStateFactorsFromState(agentState);
          const memberFactoredState = agent.getStateFactorsFromState(memberState);
          const stateFactors = Object.keys(agentFactoredState);
          if (isEquivalent(agentFactoredState, memberFactoredState, stateFactors, this._veiledStateFactors)) {
            const memberValue = member.values[memberState];
            program.constraints[`theVeilOfIgnorance${agentState}`] = {'max': memberValue + this._inequityTolerance};
            program.constraints[`theVeilOfIgnorance${agentState}`] = {'min': memberValue - this._inequityTolerance};
            program.variables[`state${agentState}`][`theVeilOfIgnorance${agentState}`] = 1;
          }
        }
      }
    }
  }
}

module.exports = TheVeilOfIgnorance;