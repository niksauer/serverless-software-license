const LicenseToken = artifacts.require('LicenseToken');

module.exports = function (deployer, network, accounts) {
  const initialSupply = 100;
  deployer.deploy(LicenseToken, initialSupply);
};
