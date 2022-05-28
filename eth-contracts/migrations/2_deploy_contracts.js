// migrating the appropriate contracts
var Verifier = artifacts.require("./Verifier.sol");
// var ERC721MintableComplete = artifacts.require("./ERC721MintableComplete.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");

module.exports = async function (deployer) {
  await deployer.deploy(Verifier);
  // await deployer.deploy(ERC721MintableComplete);
  await deployer.deploy(
    SolnSquareVerifier,
    Verifier.address,
    "SquareSolutionVerifier777",
    "SSV777"
  );
};
