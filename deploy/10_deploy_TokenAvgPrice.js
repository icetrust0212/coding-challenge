require('dotenv').config()

const func = async function (hre) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();
  const network = await hre.getChainId();

  const contractDeployed = await deploy('TokenAvgPrice', {
    from: deployer,
    args: [],
    log: true,
    proxy: {
      proxyContract: 'OpenZeppelinTransparentProxy',
    },
  });

    


  console.log('Verify:');
  console.log('npx hardhat verify --network ' + hre.network.name + ' ' + contractDeployed.address);

};

module.exports = func;
func.tags = ['TokenAvgPrice'];
