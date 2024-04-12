// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AuditTrail is AccessControl, Ownable {

    event AuditLogCreated(
        uint256 agreementId,
        address userAddress,
        address providerAddress,
        uint256 providerId,
        string encApiKey,
        string encConnectionString
    );

    enum SignatureType {
        REGULAR,
        SEAL
    }

    struct AuditLog {
        string userNameEncrypted;
        string documentHash;
        uint256 timeStamp;
        SignatureType sigType;
    }

    uint256 public agreementIdTotalCount;

    mapping(uint256 => AuditLog) public IdToAuditLog;
    uint256 logCount;
    
    string public constant CUSTOMER_NAME = "DocuSign";

    constructor() Ownable(msg.sender) {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }


    function getAuditLogById(uint256 _Id) public view returns (AuditLog memory) {
        return IdToAuditLog[_Id];
    }

    function getAuditLogs() public view returns (AuditLog[] memory) {
        AuditLog[] memory auditLogArray = new AuditLog[](logCount);
        for (uint256 i = 0; i < logCount; i++) {
            auditLogArray[i] = IdToAuditLog[i];
        }
        return auditLogArray;
    }
}