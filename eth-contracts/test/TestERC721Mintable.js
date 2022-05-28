const truffleAssert = require("truffle-assertions");
var ERC721MintableComplete = artifacts.require("ERC721MintableComplete");

contract("TestERC721Mintable", (accounts) => {
  const account_one = accounts[0];
  const account_two = accounts[1];
  let owner = account_one;
  let contract;

  describe("match erc721 spec", function () {
    before(async function () {
      contract = await ERC721MintableComplete.new("Token_Name_1", "TokenSymbol1", { from: owner });

      await contract.mint(accounts[0], 11, { from: owner });
      await contract.mint(accounts[1], 12, { from: owner });
      await contract.mint(accounts[2], 13, { from: owner });
    });

    it("should return total supply", async () => {
      expect(Number(await contract.totalSupply({ from: account_one }))).to.equal(3);
    });

    it("should get token balance", async function () {
      expect(Number(await contract.balanceOf(accounts[0]))).to.equal(1);
      expect(Number(await contract.balanceOf(accounts[4]))).to.equal(0);
    });

    // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
    it("should return token uri", async function () {
      expect(await contract.tokenURI.call(11)).to.equal(
        "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/11"
      );
    });

    it("should transfer token from one owner to another", async function () {
      await contract.transferFrom(accounts[0], accounts[1], 11);
      expect(Number(await contract.balanceOf(accounts[0]))).to.equal(0);
      expect(Number(await contract.balanceOf(accounts[1]))).to.equal(2);
      expect(await contract.ownerOf.call(11)).to.equal(accounts[1]);
    });
  });

  describe("have ownership properties", function () {
    before(async function () {
      contract = await ERC721MintableComplete.new("Token Name 2", "TokenSymbol2", { from: account_one });
    });

    it("should fail when minting when address is not contract owner", async function () {
      await truffleAssert.reverts(
        contract.mint(accounts[0], 11, { from: account_two }),
        "Can be called only by the owner"
      );
    });

    it("should return contract owner", async function () {
      expect(await contract.owner()).to.equal(owner);
    });
  });
});
