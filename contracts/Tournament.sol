pragma solidity ^0.4.18;
import "./SafeMathLib.sol";

contract Tournament {
    bytes10[] private participantIds;
    uint private poolMoney = 0;
    address private contractOwner;
    uint private bettingWindow;
    uint private timeLock = 3 minutes;
    bytes10 private winnerId;
    uint private claimablePoolmoney = 0;
    string internal tournamentStatus = "pending";
    string internal gameHash;
    string internal tournamentName;

    mapping(address => mapping(bytes10 => uint)) internal bettorBetted;
    mapping(address => mapping(bytes10 => bool)) internal claimed;
    mapping(bytes10 => uint) internal totalBets;
    mapping(bytes10 => address[]) internal participantBettors;

    constructor(address owner, string _tournamentName, bytes10[] participants) public {
        tournamentName = _tournamentName;
        contractOwner = owner;
        setParticipants(participants);
    }

    event Bet (
        bytes10 toBet,
        uint amount
    );

    event SetWinner (
        bytes10 winner
    );

    event ClaimWinnings (
        address ownerAddress,
        uint amount
    );

    event SetTournamentStatus (
        string status
    );

    event StoreGameHash (
        string hash
    );

    event TimeLockElapsed (
        bool state
    );

    event DeductClaimablePoolMoney(
        uint amount
    );

    modifier arrayNotEmpty(bytes10[] data) {
        require(data.length > 0);
        _;
    }

    modifier onlyUnclaimed() {
        require(claimed[msg.sender][winnerId] == false);
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == contractOwner);
        _;
    }

    modifier onlyPositiveNumber(uint number) {
        require(number > 0);
        _;
    }

    modifier onlyValidParticipants(bytes10 id) {
        require(isValidParticipant(id));
        _;
    }

    modifier mustBeWinningParticipantBettor() {
        require(isBettorBettedFor(winnerId, msg.sender));
        _;
    }

    modifier onlyInTimeline {
        require(SafeMathLib.add(bettingWindow, timeLock) > now);
        _;
    }

    modifier onlyAfterTimelock {
        require(SafeMathLib.add(bettingWindow, timeLock) < now);
        _;
    }

    modifier onlyPendingTournament() {
        require(compareString(tournamentStatus, "pending"));
        _;
    }

    modifier onlyOngoingTournament() {
        require(compareString(tournamentStatus, "ongoing"));
        _;
    }

    modifier onlyEndTournament {
        require(compareString(tournamentStatus, "ended"));
        _;
    }

    modifier onlyTournamentHasntEndedOrStarted {
        require(compareString(tournamentStatus, "ended") == false);
        require(compareString(tournamentStatus, "betting") == false);
        _;
    }

    modifier onlyTournamentHasntEnded {
        require(compareString(tournamentStatus, "ended") == false);
        _;
    }

    modifier onlyBettingStatus {
        require(compareString(tournamentStatus, "betting"));
        _;
    }

    modifier mustHaveParticipants () {
        require(participantIds.length > 0);
        _;
    }

    function compareString(string s1, string s2) internal pure returns (bool) {
        return (keccak256(abi.encodePacked(s1)) == keccak256(abi.encodePacked(s2)));
    }

    function getElapsedTime() internal view returns(uint256) {
        return SafeMathLib.subtract(now, bettingWindow);
    }

    function isValidParticipant(bytes10 id) internal view returns (bool) {
        for(uint i = 0; i < participantIds.length; i++) {
            if (participantIds[i] == id) {
                return true;
            }
        }
        return false;
    }

    function isBettorBettedFor(bytes10 id, address addr) internal view returns (bool) {
        for(uint i = 0; i < participantBettors[id].length; i++) {
            if(participantBettors[id][i] == addr) {
                return true;
            }
        }
        return false;
    }

    function pushToParticipantBettors(bytes10 id) internal {
        for(uint i = 0; i < participantBettors[id].length; i++) {
            if(participantBettors[id][i] == msg.sender) {
                return;
            }
        }
        participantBettors[id].push(msg.sender);
    }

    function openBettingWindow()
        public
        onlyPendingTournament
        mustHaveParticipants
        onlyOwner
    {
        bettingWindow = now;
        setTournamentStatus('betting');
    }

    function hasTimeLockElapsed() public {
        if(SafeMathLib.add(bettingWindow, timeLock) < now) {
            emit TimeLockElapsed(true);
        }
    }
    
    function dateToStart() public view returns(uint256) {
        if(SafeMathLib.add(bettingWindow, timeLock) < now) {
            return 0;
        } else {
            return bettingWindow + timeLock;
        }
    }

    function setParticipants(bytes10[] _participantIds)
      internal
      arrayNotEmpty(_participantIds)
      onlyPendingTournament
      {
        require(_participantIds.length % 4 == 0 || _participantIds.length == 2);
        participantIds = _participantIds;
    }

    function getPoolMoney () public view returns (uint) {
        return SafeMathLib.divide(poolMoney, 1000);
    }

    function bet(bytes10 _id)
        public
        payable
        onlyPositiveNumber(msg.value)
        onlyPositiveNumber(_id.length)
        onlyValidParticipants(_id)
        onlyBettingStatus
        onlyInTimeline
        mustHaveParticipants
    {
        bettorBetted[msg.sender][_id] = SafeMathLib.add(bettorBetted[msg.sender][_id], msg.value);
        poolMoney = SafeMathLib.add(poolMoney, msg.value);
        pushToParticipantBettors(_id);
        emit Bet(_id, msg.value);
        // return msg.value;
    }

    function getParticipantBettors(bytes10 id) onlyValidParticipants(id) public view returns (address[]) {
        return participantBettors[id];
    }


    function setWinner(bytes10 id) public
      onlyOwner
      onlyOngoingTournament
      onlyAfterTimelock
      mustHaveParticipants
      {
        winnerId = id;
        setTournamentStatus('ended');
        claimablePoolmoney = poolMoney;
        emit SetWinner(id);
    }

    function getParticipants () public view returns(bytes10[]){
        return participantIds;
    }

    function totalBetFor(bytes10 id) public 
        onlyValidParticipants(id)
        view returns (uint total) {
        for (uint i = 0; i < participantBettors[id].length; i++) {
            total = SafeMathLib.add(total, bettorBetted[participantBettors[id][i]][id]);
        }
        return total;
    }

    function claimWinnings()
      public
      payable
      onlyEndTournament
      onlyAfterTimelock
      mustBeWinningParticipantBettor
      onlyUnclaimed
      onlyPositiveNumber(claimablePoolmoney)
      {
        uint amount = (poolMoney*bettorBetted[msg.sender][winnerId])/totalBetFor(winnerId);
        address(msg.sender).transfer(amount);
        claimablePoolmoney = SafeMathLib.subtract(claimablePoolmoney, amount);
        claimed[msg.sender][winnerId];
        emit DeductClaimablePoolMoney(claimablePoolmoney);
        emit ClaimWinnings(msg.sender, amount);
    }

    function startTournament() public
        onlyOwner
        mustHaveParticipants
        onlyAfterTimelock
        onlyBettingStatus
    {
        setTournamentStatus('ongoing');
    }

    function getTournamentStatus() public view returns(string) {
        return tournamentStatus;
    }

    function getClaimablePoolMoney()
        public
        onlyEndTournament
        view returns(uint) {
        return claimablePoolmoney;
    }

    function storeGameHash(string toStore)
      public
      onlyOwner
      onlyTournamentHasntEndedOrStarted
    {
        gameHash = toStore;
        emit StoreGameHash(toStore);
    }

    function getTournamentName() public view returns(string) {
        return tournamentName;
    }

    function getGameHash()
      public
      view
      returns(string) {
        return gameHash;
    }

    function setTournamentStatus(string _status)
        internal
        onlyTournamentHasntEnded
    {
        tournamentStatus = _status;
        emit SetTournamentStatus(_status);
    }
}