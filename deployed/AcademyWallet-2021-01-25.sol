pragma solidity 0.7.5;

contract AcademyWallet {

    mapping(address => uint256) private _balances;
    address public owner;
    
    constructor() {
        owner = msg.sender;
    }

    receive() external payable  {
        _balances[msg.sender] += msg.value;
    }

    function deposit() payable public returns (bool) {
        _balances[msg.sender] += msg.value;
        return true;
    }

    function withdraw() public returns (bool) {
        uint256 withdrawAmount = _balances[msg.sender];
        _balances[msg.sender] = 0;
        msg.sender.transfer(withdrawAmount);
        return true;
    }

    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }
    
    function thisBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
}
