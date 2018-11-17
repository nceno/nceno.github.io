pragma solidity ^ 0.4.0;
contract DateTime {
        function getYear(uint timestamp) public constant returns (uint16);
        function getMonth(uint timestamp) public constant returns (uint8);
        function getDay(uint timestamp) public constant returns (uint8);
}
contract FuturePayable {
address private owner;
  uint public bday;
  uint public payday;
address public dateTimeAddr = 0x8Fc065565E3e44aef229F1D06aac009D6A524e82;
  DateTime dateTime = DateTime(dateTimeAddr);
modifier onlyOwner {
    require(msg.sender == owner);
    _;
  }
/*constructor*/
  function FuturePayable() public  {
    owner = msg.sender;
    bday = now;
    payday = ( bday + 1 days );
  }
/* Default function */
  function() public payable {
  }
function withdraw() public onlyOwner {
       require (block.timestamp > payday);
       msg.sender.transfer(this.balance);
   }
function getBirthYear() view public returns (uint16){
      return dateTime.getYear(bday);
  }
function getBirthMonth() view public returns (uint8){
      return dateTime.getMonth(bday);
  }
function getBirthDay() view public returns (uint8){
      return dateTime.getDay(bday);
  }
function getPayYear() view public returns (uint16){
      return dateTime.getYear(payday);
  }
function getPayMonth() view public returns (uint8){
      return dateTime.getMonth(payday);
  }
function getPayDay() view public returns (uint8){
      return dateTime.getDay(payday);
  }
}