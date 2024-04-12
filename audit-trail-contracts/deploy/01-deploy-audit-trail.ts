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
  });
  console.log("AuditTrail deployed to:", auditTrail.address);
  console.log("AuditTrail deployed on network:", network.name);
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(auditTrail.address, "contracts/AuditTrail.sol:AuditTrail", [
      // "0xBdeb3Bb75ACC616663F89aA58bC110bF8223ca5B",
    ]);
  }
};

export default deployAuditTrail;
deployAuditTrail.tags = ["all", "audit-trail"];
