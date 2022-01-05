// npx hardhat run scripts/initialize_contracts.js --network rinkeby

const hre = require("hardhat");

async function main() {

    const token = await  hre.deployments.get('TokenAvgPrice');
    const tokenDeployed = await ethers.getContractAt('TokenAvgPrice', token.address);
    const tx = await tokenDeployed.initialize();
    console.log('tx: ', tx);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

