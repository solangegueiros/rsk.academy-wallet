const AcademyWallet = artifacts.require("AcademyWallet");

module.exports = async (deployer, network, accounts)=> {

  academyWallet = await deployer.deploy(AcademyWallet, {from: accounts[0]});
  console.log("academyWallet", academyWallet);

};
