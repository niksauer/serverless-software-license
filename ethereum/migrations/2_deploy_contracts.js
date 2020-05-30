const LicenseToken = artifacts.require('LicenseToken');

module.exports = function (deployer, network, accounts) {
  const name = 'Fantastical';
  const symbol = 'FANTA';
  deployer.deploy(LicenseToken, name, symbol);
};
