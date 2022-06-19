pragma solidity >=0.4.21 <0.6.0;
pragma experimental ABIEncoderV2;

import "./ERC721MintableComplete.sol";
import "./Verifier.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract SquareVerifier {
  function verifyTx(Verifier.Proof memory proof, uint256[2] memory input) public returns (bool);
}

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class

// TODO define a solutions struct that can hold an index & an address

// TODO define an array of the above struct

// TODO define a mapping to store unique solutions submitted

// TODO Create an event to emit when a solution is added

// TODO Create a function to add the solutions to the array and emit the event

// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly

contract SolnSquareVerifier is ERC721MintableComplete {
  SquareVerifier private verifierContract;

  struct Solution {
    uint256 solutionIndex;
    address solutionAddress;
  }

  uint256 nextSolutionIndex = 0;
  Solution[] private _solutions;

  mapping(bytes32 => Solution) solutions;
  mapping(bytes32 => bool) isSolutionMinted;

  event SolutionSubmitted(uint256 solutionIndex, address solutionAddress);

  constructor(
    address verifierAddress,
    string memory name,
    string memory symbol
  ) public ERC721MintableComplete(name, symbol) {
    verifierContract = SquareVerifier(verifierAddress);
  }

  function addSolution(Verifier.Proof memory proof, uint256[2] memory input) public {
    bytes32 solutionHash = keccak256(abi.encodePacked(input[0], input[1]));
    require(solutions[solutionHash].solutionAddress == address(0), "Solution already exists");

    bool verified = verifierContract.verifyTx(proof, input);
    require(verified, "Solution could not be verified");

    solutions[solutionHash] = Solution(nextSolutionIndex, msg.sender);
    emit SolutionSubmitted(nextSolutionIndex, msg.sender);
    nextSolutionIndex++;
  }

  function mintToken(
    uint256 a,
    uint256 b,
    uint256 tokenId,
    address to
  ) public {
    bytes32 solutionHash = keccak256(abi.encodePacked(a, b));
    require(solutions[solutionHash].solutionAddress != address(0), "Non-existent solution");
    require(isSolutionMinted[solutionHash] == false, "Already minted solution");
    require(solutions[solutionHash].solutionAddress == msg.sender, "msg.sender is not the solution owner");

    super.mint(to, tokenId);
    isSolutionMinted[solutionHash] = true;
  }
}
