import { AuditTrail } from "./../../typechain-types/contracts/AuditTrail";
import { expect } from "chai";
import { deployments, ethers, network } from "hardhat";
import { encrypt, sha256 } from "../utils/encrypt_decrypt_hash";
import { developmentChains } from "../../helper-hardhat-config"
import { randomBytes } from "crypto";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";


!developmentChains.includes(network.name)
  ? describe.skip
  : describe("AuditTrail", function () {
    let auditTrail: AuditTrail;
    let deployer: SignerWithAddress

    this.beforeEach(async () => {
      let { get } = deployments
      const accounts = await ethers.getSigners()
      deployer = accounts[0]

      await deployments.fixture(["audit-trail"])

      let auditTrailDeployment = await get("AuditTrail")
      auditTrail = await ethers.getContractAt("AuditTrail", auditTrailDeployment.address)
    })

    it("create one audit log", async function () {
      let logCount: number = Number(await auditTrail.logCount())
      let username = "marvinator";
      let encryptedUsername = encrypt(username, logCount)
      let pdf = "My PDF"
      let customerName = "Marvin"
      let hashedPdf = sha256(pdf)
      let timestamp = Math.floor(Date.now() / 1000)
      let sigtype = 3

      await auditTrail.createAuditLog(encryptedUsername, hashedPdf, customerName, timestamp, sigtype)
    })


    it("create batch audit logs", async function () {
      let logCount: number = Number(await auditTrail.logCount())
      let encryptedUsernames = []
      let hashedPdfs = []
      let customerNames = []
      let timestamps = []
      let sigtypes = []
      for (let i = 0; i < 16; i++) {
        let username = randomBytes(8 + Math.floor(Math.random() * 8)).toString("hex");
        let encryptedUsername = encrypt(username, logCount)
        let pdf = `My PDF ${username}`
        let hashedPdf = sha256(pdf)
        let customerName = "username"
        let timestamp = Math.floor(Date.now() / 1000)
        let sigtype = 3
        logCount += 1

        encryptedUsernames.push(encryptedUsername)
        hashedPdfs.push(hashedPdf)
        customerNames.push(customerName)
        timestamps.push(timestamp)
        sigtypes.push(sigtype)
      }

      await auditTrail.batchCreateAuditLogs(encryptedUsernames, hashedPdfs, customerNames, timestamps, sigtypes)

      expect(await auditTrail.logCount()).to.equal(logCount)

    })


  });
