// Test if a new solution can be added for contract - SolnSquareVerifier
// Test if an ERC721 token can be minted for contract - SolnSquareVerifier

const SolnSquareVerifier = artifacts.require("SolnSquareVerifier");
const Verifier = artifacts.require("Verifier");
const Proof = require("../../zokrates/code/square/proof");

const truffleAssert = require("truffle-assertions");

contract("TestSolnSquareVerifier", (accounts) => {
  let contract;

  before(async function () {
    let verifier = await Verifier.new({ from: accounts[0] });
    contract = await SolnSquareVerifier.new(verifier.address, "Test Token", "TTKN01", { from: accounts[0] });
  });

  it("should add a new solution", async () => {
    await contract.addSolution(Proof.proof, Proof.inputs);
  });

  it("should mint a new token", async () => {
    await contract.mintToken(Proof.inputs[0], Proof.inputs[1], 101, accounts[1], { from: accounts[0] });
    const ownerAddress = await contract.ownerOf.call(101, { from: accounts[0] });
    expect(ownerAddress).to.equal(accounts[1]);
  });

  it("should fail for existing solutions", async () => {
    await truffleAssert.reverts(
      contract.mintToken(Proof.inputs[0], Proof.inputs[1], 101, accounts[1], { from: accounts[0] }),
      "Already minted solution"
    );
  });
});
