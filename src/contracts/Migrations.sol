pragma solidity ^0.8.0;
contract Migrations{
    address owner;
    uint last_completed_migration;
    constructor (){
        owner=msg.sender;
    }
    modifier restricted(){
        require(msg.sender==owner);
        _;
    }
    function setCompleted(uint completed)public restricted{
        last_completed_migration=completed;
    }
    function upgrade(address new_address)public restricted{
        Migrations upgrade=Migrations(new_address);
        upgrade.setCompleted(last_completed_migration);
    }
}