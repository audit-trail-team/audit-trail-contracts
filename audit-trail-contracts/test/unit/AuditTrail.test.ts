import { AuditTrail } from "./../../typechain-types/contracts/AuditTrail";
import { assert, expect } from "chai";
import { ContractTransaction } from "ethers";
import { deployments, ethers, network } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import exp from "constants";

describe("AuditTrail", function () {
  describe("test setup to test something for audit trail", () => {
    let auditTrail: AuditTrail;
    let accounts: SignerWithAddress[];

    before(async () => {
      accounts = await ethers.getSigners();
      auditTrail = (await (
        await ethers.getContractFactory("AuditTrail")
      ).deploy()) as unknown as AuditTrail;

      const auditTrailAddress = await auditTrail.getAddress();
    });

    // it("check if enter agreement function is working", async () => {
    //   const tx = await auditTrail.enterAgreement(
    //     BigInt(1),
    //     "0x6ae181072aBc10a4eE84724BE867c71E0d4C0471"
    //   );
    //   const receipt = await tx.wait();
    //   console.log(receipt);
    //   expect(receipt?.status).to.equal(1);
    // });
  });
});
