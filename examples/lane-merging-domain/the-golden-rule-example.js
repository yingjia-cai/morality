'use strict';

const morality = require('../../morality.js');
const LaneMergingAgent = require('../../agents/lane-merging-agent.js');
const TheGoldenRule = require('../../ethics/the-golden-rule.js');
const printer = require('../../utils/printer.js');

const agent = new LaneMergingAgent(5, 5);

const ethics = new TheGoldenRule();

console.log('Amoral Policy');
const amoralSolution = morality.solve(agent);
if (amoralSolution) {
  print(amoralSolution.policy);
}

console.log('Moral Policy');
const moralSolution = morality.solve(agent, ethics);
if (moralSolution) {
  print(moralSolution.policy);
}