import { network } from "hardhat";
import "@nomicfoundation/hardhat-chai-matchers";
import { task } from "hardhat/config";

// yarn hardhat createLog --username maarten --document 0xHashDocument --timestamp 1000000  --sigtype 1 --network arbitrumSeplia
task("createLog")
  .addParam("username", "the user that signed the document")
  .addParam("document", "the hash of the document signed")
  .addParam("timestamp", "the timestamp when the business process completed")
  .addParam("sigtype", "the type of signature used")
  .setAction(async ({ username, document, timestamp, sigtype }, hre) => {
    const { deployer } = await hre.getNamedAccounts();

    console.log("running this create log task with account:", deployer);

    const contractAddress = "0x11784F8D1E747EA5dde2407FF2FE2a41BBd0Fa47";
    if (!contractAddress) {
      console.log("Please provide a contract address to create a log");
      throw new Error("No contract address provided");
    }

    const auditTrail = (
      await hre.ethers.getContractFactory("AuditTrail")
    ).attach(contractAddress);
    console.log(`Got AuditTrail at ${contractAddress}`);
    console.log("Creating Log...");
    let createLogTx;

    try {
      createLogTx = await auditTrail.createAuditLog(
        username,
        document,
        timestamp,
        sigtype
      );
    } catch (error) {
      console.log("Error while minting Tokens", error);
    }
    let createLogReceipt;
    const { network } = hre;
    if (network.name === "hardhat" || network.name === "localhost") {
      createLogReceipt = await createLogTx.wait();
    } else {
      createLogReceipt = await createLogTx.wait(2);
    }
    console.log(`Created Log with 
    user: ${username},
    document: ${document},
    timestamp: ${timestamp},
    signatureType: ${sigtype}
    !`);
    console.log("TX receipt:", createLogReceipt);
  });
