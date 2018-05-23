import * as synaptic from "synaptic";

const perceptron = new synaptic.Architect.Perceptron(1, 5, 3);
const trainer = new synaptic.Trainer(perceptron);

const set = [
  {
    input: [0, 0]
  }
]