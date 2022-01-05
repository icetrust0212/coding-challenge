// We import Chai to use its asserting functions here.
  import "@openzeppelin/hardhat-upgrades";
  import { expect } from "chai";
  import { config } from "dotenv";
  import {ethers, upgrades} from 'hardhat';
  import {Contract} from 'ethers';
  import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
  config();
  // `describe` is a Mocha function that allows you to organize your tests. It's
  // not actually needed, but having your tests organized makes debugging them
  // easier. All Mocha functions are available in the global scope.
  
  // `describe` receives the name of a section of your test suite, and a callback.
  // The callback must define the tests of that section. This callback can't be
  // an async function.
  describe("TokenAvgPrice contract", function () {
    // Mocha has four functions that let you hook into the the test runner's
    // lifecyle. These are: `before`, `beforeEach`, `after`, `afterEach`.
  
    // They're very useful to setup the environment for tests, and to clean it
    // up after they run.
  
    // A common pattern is to declare some variables, and assign them in the
    // `before` and `beforeEach` callbacks.
  
    let baseFactory;
    let upgradeableContract: Contract;
    let owner: SignerWithAddress;
    let otherAccount: SignerWithAddress;
    let addrs: SignerWithAddress[];
    // `beforeEach` will run before each test, re-deploying the contract every
    // time. It receives a callback, which can be async.
    beforeEach(async function () {
      // Get the ContractFactory and Signers here.
      [owner, otherAccount, ...addrs] = await ethers.getSigners();

      baseFactory = await ethers.getContractFactory("TokenAvgPrice", owner);
      // To deploy our contract, we just have to call Token.deploy() and await
      // for it to be deployed(), which happens once its transaction has been
      // mined.
      upgradeableContract = await upgrades.deployProxy(baseFactory, [], {
        initializer: "initialize",
      });
      
      await upgradeableContract.deployed();
    });
  
    // You can nest describe calls to create subsections.
    describe("Deployment", function () {
      // `it` is another Mocha function. This is the one you use to define your
      // tests. It receives the test name, and a callback function.

      // If the callback function is async, Mocha will `await` it.
      it("Should set the right owner", async function () {
        // Expect receives a value, and wraps it in an Assertion object. These
        // objects have a lot of utility methods to assert values.
  
        // This test expects the owner variable stored in the contract to be equal
        // to our Signer's owner.
        expect(await upgradeableContract.signer.getAddress()).to.equal(owner.address);
      });
    });
  
    describe("Token Price", function() {
      it("set token price for a day", async function () {
        let time = new Date().getTime();
        let result = await upgradeableContract.setTokenPriceForDay(time, 10);
        let tokenPrice = await upgradeableContract.getTokenPriceForDay(time);
        expect(tokenPrice).to.equal(10);
      });

      it("get token avg price", async function () {
        let todayTime = new Date().getTime();
        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        let yesterdayTime = yesterday.getTime();

        await upgradeableContract.setTokenPriceForDay(yesterdayTime, 10);
        await upgradeableContract.setTokenPriceForDay(todayTime, 20);

        let avgPrice = await upgradeableContract.getAvgPrice(yesterdayTime, todayTime);
        expect(avgPrice).to.equal(15);
      });

      it('anyone can set daily price', async function() {
        let time = new Date().getTime();
        await upgradeableContract.connect(otherAccount).setTokenPriceForDay(time, 10);
        let tokenPrice = await upgradeableContract.getTokenPriceForDay(time);
        expect(tokenPrice).to.equal(10);
      })
    });

    describe("Token Upgrade V2", function() {
      let contractV2;
      let upgradedContract: Contract;

      beforeEach(async function() {
        contractV2 = await ethers.getContractFactory("TokenAvgPriceV2", owner);
        upgradedContract = await upgrades.upgradeProxy(upgradeableContract.address, contractV2);
      });

      it('upgraded contract should set the right owner', async function() {
        expect(await upgradedContract.signer.getAddress()).to.equal(owner.address);
      })

      it('upgraded contract new function test: ', async function() {
        let timestamp = await upgradedContract.addedFunction();
        expect(timestamp).to.equal(86400 * 1000);
      })

      it('onlyowner can set daily token price', async function() {
        let time = new Date().getTime();
        await expect(upgradedContract.connect(otherAccount).setTokenPriceForDay(time, 10)).to.be.reverted;
      })
    })

    describe("Token Upgrade V3", function() {
      let contractV3;
      let upgradedContract: Contract;

      beforeEach(async function() {
        contractV3 = await ethers.getContractFactory("TokenAvgPriceV3", owner);
        upgradedContract = await upgrades.upgradeProxy(upgradeableContract.address, contractV3);
      });

      it('upgraded contract should set the right owner', async function() {
        expect(await upgradedContract.signer.getAddress()).to.equal(owner.address);
      })

      it('The price of a token on a day can be set on the same day itself', async function() {
        let time = new Date().getTime();
        await upgradedContract.setTokenPriceForDay(time, 10);
        let price = await upgradedContract.getTokenPriceForDay(time);
        expect(price).to.equal(10);
      })

      it('Setting token price for other day should be reverted: ', async function() {
        let now = new Date();
        let yesterday = new Date();
        yesterday.setDate(now.getDate() - 1);
        await expect(upgradedContract.setTokenPriceForDay(yesterday.getTime(), 10)).to.be.revertedWith('The price of a token on a day can be set on the same day itself.');
      })
    })
  });