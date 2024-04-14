import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import verify from "../utils/verify";
import { developmentChains } from "../helper-hardhat-config";

const deployAuditTrail: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("Audit Trail deployed by:", deployer);

  const auditTrail = await deploy("AuditTrail", {
    from: deployer,
    args: [],
    log: false,
    // we need to wait if on a live network so we can verify properly
    // waitConfirmations: networkConfig[chainId]?.blockConfirmations || 0,
    waitConfirmations: !developmentChains.includes(network.name) ? 5 : 0,
  });
  console.log("AuditTrail deployed to:", auditTrail.address);
  console.log("AuditTrail deployed on network:", network.name);
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    // await verify(
    // auditTrail.address,
    // "0x1A311038c57ECB5D0bd05681D8B7E56E9589C210",
    // "contracts/AuditTrail.sol:AuditTrail",
    // [
    await verify(
      "0x36e6909E146E3c15d19c0A9A6fa6dDe649A96662",
      "contracts/AuditTrail.sol:AuditTrail",
      []
    );
  }
};

export default deployAuditTrail;
deployAuditTrail.tags = ["all", "audit-trail"];
