// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    uint256 private seed;


    // create event to emit 
    event NewWave(address indexed from, uint256 timestamp, string message);
    
    // create Wave data type
    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;
    mapping(address => uint256) public lastWavedAt;
    constructor() payable { 
        console.log("Smart Contract :D"); 
        seed = (block.timestamp + block.difficulty) % 100;
    }
    
    function wave(string memory _message) public {
        require(
            lastWavedAt[msg.sender] + 15 minutes < block.timestamp,
            "Wait 15m"
        );
        lastWavedAt[msg.sender] = block.timestamp;

        totalWaves++;

        waves.push(Wave(msg.sender, _message, block.timestamp));
        seed = (block.timestamp + block.difficulty) % 100;
        console.log("Random # generated: %d", seed);

        if(seed < 50) {
            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has"
                );
                (bool success, ) = (msg.sender).call{value:prizeAmount}("");

            require(
                success,
                "Failed to widthdraw money from contract"
            );
        }
        
        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns(uint256) {
        return totalWaves;
    }
}