// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AuditTrail is AccessControl, Ownable {

    event AuditLogCreated(
        string userNameEncrypted,
        string documentHash,
        uint256 timeStamp,
        SignatureType sigType
    );

    enum SignatureType {
        Seal,    
        QES,
        QSeal,
        SES,
        AES,
    }

    struct AuditLog {
        string userNameEncrypted;
        string documentHash;
        uint256 timeStamp;
        SignatureType sigType;
    }

    mapping(uint256 => AuditLog) public IdToAuditLog;
    uint256 public logCount;
    
    string public constant CUSTOMER_NAME = "GLAUX GROUP DEMO";

    constructor() Ownable(msg.sender) {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    function createAuditLog(
        string memory _userNameEncrypted,
        string memory _documentHash,
        uint256 _timeStamp,
        SignatureType _sigType
    ) public onlyOwner {
        IdToAuditLog[logCount] = AuditLog(
            _userNameEncrypted,
            _documentHash,
            _timeStamp,
            _sigType
        );
        logCount++;
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

    function getCustomerName() public pure returns (string memory) {
        return CUSTOMER_NAME;
    }
}