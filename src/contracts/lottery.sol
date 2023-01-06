pragma solidity ^0.8.0;
contract lottery{
  address public manager;
  address payable[] public players;
  constructor (){
    manager=msg.sender;
  }
  function enter() payable public{
    require(msg.value>=.01 ether);
    players.push(payable(msg.sender));
  }
  function pickWinner()public{
    require(msg.sender==manager);
    uint256 index=random()%players.length;
    players[index].transfer(address(this).balance);
    players=new address payable[](0);
  }
  function random()private returns(uint){
    return uint8(uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, players))));
  }
}