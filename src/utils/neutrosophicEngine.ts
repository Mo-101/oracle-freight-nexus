
export interface NeutrosophicValue {
  truth: number;
  indeterminacy: number;
  falsehood: number;
}

export const createNeutrosophicValue = (truth: number, indeterminacy: number, falsehood: number): NeutrosophicValue => {
  return { truth, indeterminacy, falsehood };
};
