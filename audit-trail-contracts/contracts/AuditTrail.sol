// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AuditTrail is AccessControl, Ownable {
    event AuditLogCreated(
        string userNameEncrypted,
        string documentHash,
        string customerName,
        uint32 timeStamp,
        SignatureType sigType
    );

    enum SignatureType {
        Seal,
        QES,
        QSeal,
        SES,
        AES
    }

    // Struct for return value, NOT storage
    struct AuditLog {
        string userNameEncrypted;
        string documentHash;
        string customerName;
        uint32 timeStamp;
        SignatureType sigType;
    }

    // Object in arrays for efficient storage
    struct AuditLogs {
        string[] userNamesEncrypted;
        string[] documentHashes;
        uint16[] customerNameIds;
        uint32[] timeStamps;
        SignatureType[] sigTypes;
    }
    AuditLogs private auditLogs;
    uint256 public logCount;

    mapping(string => uint16) private customerNameToId;
    mapping(uint16 => string) private customerIdToName;

    constructor() Ownable(msg.sender) {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    function batchCreateAuditLogs(
        string[] calldata _userNamesEncrypted,
        string[] calldata _documentHashes,
        string[] calldata _customerNames,
        uint32[] calldata _timeStamps,
        SignatureType[] calldata _sigTypes
    ) public onlyOwner {
        uint256 length = _userNamesEncrypted.length;
        if (
            length != _documentHashes.length ||
            length != _customerNames.length ||
            length != _timeStamps.length ||
            length != _sigTypes.length
        ) {
            revert("Array lengths do not match");
        }

        for (uint256 i = 0; i < length; i++) {
            uint16 id = getCustomerNameId(_customerNames[i]);

            auditLogs.userNamesEncrypted.push(_userNamesEncrypted[i]);
            auditLogs.documentHashes.push(_documentHashes[i]);
            auditLogs.customerNameIds.push(id);
            auditLogs.timeStamps.push(_timeStamps[i]);
            auditLogs.sigTypes.push(_sigTypes[i]);
            logCount++;
            emit AuditLogCreated(
                _userNamesEncrypted[i],
                _documentHashes[i],
                _customerNames[i],
                _timeStamps[i],
                _sigTypes[i]
            );
        }
    }

    function createAuditLog(
        string calldata _userNameEncrypted,
        string calldata _documentHash,
        string calldata _customerName,
        uint32 _timeStamp,
        SignatureType _sigType
    ) public onlyOwner {
        uint16 id = getCustomerNameId(_customerName);

        auditLogs.userNamesEncrypted.push(_userNameEncrypted);
        auditLogs.documentHashes.push(_documentHash);
        auditLogs.customerNameIds.push(id);
        auditLogs.timeStamps.push(_timeStamp);
        auditLogs.sigTypes.push(_sigType);
        logCount++;
        emit AuditLogCreated(
            _userNameEncrypted,
            _documentHash,
            _customerName,
            _timeStamp,
            _sigType
        );
    }

    function getCustomerNameId(
        string calldata _customerName
    ) private returns (uint16) {
        // check for value in customerNameToId mapping
        if (customerNameToId[_customerName] == 0) {
            customerNameToId[_customerName] = uint16(logCount);
            customerIdToName[uint16(logCount)] = _customerName;
        }
        return customerNameToId[_customerName];
    }

    function getAuditLogById(
        uint256 _id
    ) public view returns (AuditLog memory) {
        return
            AuditLog(
                auditLogs.userNamesEncrypted[_id],
                auditLogs.documentHashes[_id],
                customerIdToName[auditLogs.customerNameIds[_id]],
                auditLogs.timeStamps[_id],
                auditLogs.sigTypes[_id]
            );
    }

    function getAuditLogs() public view returns (AuditLog[] memory) {
        AuditLog[] memory auditLogArray = new AuditLog[](logCount);
        for (uint256 i = 0; i < logCount; i++) {
            auditLogArray[i] = getAuditLogById(i);
        }
        return auditLogArray;
    }
}
