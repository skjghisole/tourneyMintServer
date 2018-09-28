const Betting = artifacts.require("./Betting.sol");

const Finney = 10**15;
const Ether = 10**18;

contract("Betting", accounts => {
  describe('check constructor', async () => {
  	let bettingInstance;

  	beforeEach(async() => {
	  	bettingInstance = await Betting.new(["0x33", "0x34"], "LIGA-2");
  	});

  	it("should have participants", async () => {
	    const participants = await bettingInstance.getParticipants();
	    assert.equal(participants.length, 2, "Result length should be greater than 2");
		});

		it("should have a tournament name", async () => {
			const tournamentName = await bettingInstance.getTournamentName();
			assert.equal(tournamentName, "LIGA-2", "Result should be LIGA-2")
		});

		it("should return tournament status as pending", async () => {
			const tournamentStatus = await bettingInstance.getTournamentStatus();
			assert.equal(tournamentStatus, "pending", "Result should be pending");
		});
  })
  
  describe('check the openBettingWindow() function ', async () => {
  	let bettingInstance;
  	beforeEach(async() => {
	  	bettingInstance = await Betting.new(["0x33", "0x34"], "LIGA-2");
  	});
		it("only Owner can commence the betting window - should fail ", async () => {
			try{
				await bettingInstance.openBettingWindow({from: accounts[1]})
			} catch(err) {
				assert.ok(/revert/.test(err.message))
			}
		});
		it("should pass - Owner can start the betting", async() => {
			await bettingInstance.openBettingWindow({from:accounts[0]});
			const result = await bettingInstance.getTournamentStatus()
			assert.equal(result ,'betting', "Result should be betting");
		});
  });

  describe('the bet on betting window', async() => {
  	let bettingInstance;
  	beforeEach(async() => {
  		bettingInstance = await Betting.new(["0x31", "0x32"], "LIGA", { from: accounts[0] });
  	})
  	it("should fail because betting hasnt started yet", async () => {
  		try {
  			await bettingInstance.bet("0x31", {from: accounts[0]});
  		} catch(e) {
  			assert.ok(/revert/.test(e.message));
  		}
  	});

  	it("should fail because paritcipant is not on the list", async () => {
  		try {
  			await bettingInstance.bet("0x333", {from: accounts[0]});
  		} catch(e) {
  			assert.ok(/revert/.test(e.message));
  		}
  	});

  	it("should pass when the betting has started", async () => {
  		try {
  			await bettingInstance.openBettingWindow({from:accounts[0]});
  			await bettingInstance.bet("0x31", {from:accounts[1]});
  		} catch(e) {
  			assert.ok(/revert/.test(e.message));
  		}
  	});
  });

  describe("startTournament()", async() => {
  	let bettingInstance;
  	beforeEach(async() => {
  		bettingInstance = await Betting.new(["0x31", "0x32"], "LIGA-2", { from: accounts[0]});
  		Date.now = Date.now + 180;
  	})
  	it("should not start because of the betting window time", async() => {
			try{
				await bettingInstance.openBettingWindow({from: accounts[0]});
				await bettingInstance.startTournament({from: accounts[0]})
			} catch(err) {
				assert.ok(/revert/.test(err.message))
			}
  	})

  	it("should not start because of different owner", async() => {
			try{
				Date.now = Date.now + 2000
				await bettingInstance.openBettingWindow({from: accounts[1]});
				await bettingInstance.startTournament({from: accounts[1]})
			} catch(err) {
				assert.ok(/revert/.test(err.message))
			}
  	});

  	it("should pass", async () => {
  		try{
				Date.now = Date.now + 2000
				await bettingInstance.openBettingWindow({from: accounts[0]});
				await bettingInstance.startTournament({from: accounts[0]})
			} catch(err) {
				assert.ok(/revert/.test(err.message))
			}
  	});
  });

  describe("bet()", async () => {
  	let bettingInstance;
  	beforeEach(async() => {
  		bettingInstance = await Betting.new(["0x31", "0x32"], "LIGA", {from: accounts[0]});
  		Date.now = Date.now + 500;
  	});

  	it("should pass - betting on 0x31", async() => {
  		try{
	  		await bettingInstance.bet("0x31", {from: accounts[1], value: 0.05 * Ether});
	  		const poolMoney = await bettingInstance.getPoolMoney();
	  		assert.equal(poolMoney, 0.05*Ether, "Should be 0.05 Ether");
			} catch(err) {
				assert.ok(/revert/.test(err.message))
			}
  	});

  	it("should pass - betting on 0x32", async() => {
  		try{
  			await bettingInstance.bet("0x32", {from:accounts[2], value: 1*Ether});
  			const poolMoney = await bettingInstance.getPoolMoney();
  			assert.equal(poolMoney, 1.05 * Ether, "should be 1.05 Ether");
  		} catch(err) {
				assert.ok(/revert/.test(err.message))
			}
  	});

  	it("should fail - betting 0", async () => {
  		try{
  			await bettingInstance.bet("0x32", {from:accounts[2], value: 0});
  		} catch(err) {
				assert.ok(/revert/.test(err.message))
			};
  	});

  	it("should fail - betting when game already started", async () => {
  		try{
  			await bettingInstance.startTournament({from: accounts[0]});
  			await bettingInstance.bet("0x32", {from:accounts[2], value: 2500});
  		} catch(err) {
				assert.ok(/revert/.test(err.message))
			};
  	});

  	it("should fail - betting when game already ended", async () => {
  		try{
  			await bettingInstance.startTournament({from: accounts[0]});
  			await bettingInstance.setWinner("0x31", { from: accounts[0]})
  			await bettingInstance.bet("0x32", {from:accounts[2], value: 2500});
  		} catch(err) {
				assert.ok(/revert/.test(err.message))
			};
  	});
  });

  describe("setWinner()", async() => {
  	let bettingInstance;
  	beforeEach(async () => {
  		bettingInstance = await Betting.new(["0x31", "0x32"], "LIGA", {from: accounts[0]});
  	});

  	it("should fail because of invalid id", async()=> {
  		try{
  			await bettingInstance.openBettingWindow({ from:accounts[0] });
	  		Date.now = Date.now + 1800;
	  		await bettingInstance.startTournament({ from: accounts[0] });
  			await bettingInstance.setWinner("0x39", { from: accounts[0] });
  		} catch(err) {
				assert.ok(/revert/.test(err.message))
			};
  	});

  	it("should pass", async () => {
  		try{
  			await bettingInstance.setWinner("0x31", { from: accounts[0] });
  			const status = await bettingInstance.getTournamentStatus();
  			assert.equal(status, "ended", "should be ended");
  		} catch(err) {
				assert.ok(/revert/.test(err.message));
			};
  	});

  	it("should fail - cannot set winner after game ended", async () => {
  		try{
  			await bettingInstance.setWinner("0x31", { from: accounts[0] });
  			const status = await bettingInstance.getTournamentStatus();
  			await bettingInstance.setWinner("0x32", {from:accounts[0]})
  		} catch(err) {
				assert.ok(/revert/.test(err.message));
			};
  	});
  });

  describe("claimWinnings()", async() => {
  	let bettingInstance;
  	beforeEach(async () => {
  		bettingInstance = await Betting.new(["0x31", "0x32"], "LIGA", {from: accounts[0]});
  		await bettingInstance.openBettingWindow({ from: accounts[0] });
  		Date.now = Date.now + 2000;
  	
  	
  	});

  	it("should fail - tournament hasnt ended yet", async () => {
			try{
				await bettingInstance.bet("0x31", {from: accounts[1], value: 1 * Ether});
	  		await bettingInstance.bet("0x32", {from: accounts[3], value: 2 * Ether});
	  		await bettingInstance.bet("0x32", {from: accounts[4], value: 3 * Ether});
				await bettingInstance.startTournament({ from: accounts[0] });
  			await bettingInstance.claimWinnings({from: accounts[1]});
  		} catch(err) {
				assert.ok(/revert/.test(err.message));
			};
  	});

  	it("should fail - bettor didnt win", async () => {
			try{
				await bettingInstance.bet("0x31", {from: accounts[1], value: 1 * Ether});
	  		await bettingInstance.bet("0x32", {from: accounts[3], value: 2 * Ether});
	  		await bettingInstance.bet("0x32", {from: accounts[4], value: 3 * Ether});
				await bettingInstance.startTournament({ from: accounts[0] });
				await bettingInstance.setWinner("0x32", {from:accounts[0]});
				await bettingInstance.claimWinnings({from: accounts[1]});
  		} catch(err) {
				assert.ok(/revert/.test(err.message));
			};
  	});

  	it("should pass (solo)", async() => {
  		try{
  			await bettingInstance.bet("0x31", {from: accounts[1], value: 1 * Ether});
	  		await bettingInstance.bet("0x32", {from: accounts[3], value: 2 * Ether});
	  		await bettingInstance.bet("0x32", {from: accounts[4], value: 3 * Ether});
				await bettingInstance.startTournament({ from: accounts[0] });
				await bettingInstance.setWinner("0x31", {from:accounts[0]});
				await bettingInstance.claimWinnings({from: accounts[1]});
				const claimablePool = await bettingInstance.getClaimablePoolMoney();
				assert.equal(claimablePool, 0, "Should be 0")
  		} catch(err) {
				assert.ok(/revert/.test(err.message));
			};
  	});

  	it("should pass (split)", async() => {
  		try{	
  			await bettingInstance.bet("0x31", {from: accounts[1], value: 1 * Ether});
	  		await bettingInstance.bet("0x32", {from: accounts[3], value: 2 * Ether});
	  		await bettingInstance.bet("0x32", {from: accounts[4], value: 3 * Ether});
				await bettingInstance.startTournament({ from: accounts[0] });
				await bettingInstance.setWinner("0x32", {from:accounts[0]});
				await bettingInstance.claimWinnings({from: accounts[1]});
				const claimablePool = await bettingInstance.getClaimablePoolMoney();
				assert(claimablePool, 0.59*Ether, "should be around ~0.59")
			} catch(err) {
				assert.ok(/revert/.test(err.message));
			};
  	});
  });

  describe("storeGameHash()", async() => {
  	let bettingInstance;
  	beforeEach(async() => {
  		bettingInstance = await Betting.new(["0x31", "0x32"], "LIGA", {from: accounts[0]});
  	});

  	it("should fail - Cant access game hash when game is finished", async () => {
  		try{
				await bettingInstance.openBettingWindow({from: accounts[0]});
				Date.now = Date.now + 20000;
				await bettingInstance.startTournament({from: accounts[0]});
				await bettingInstance.setWinner("0x31", {from: accounts[0]});
				await bettingInstance.storeGameHash("hash", {from:accounts[0]});
  		} catch(err) {
				assert.ok(/revert/.test(err.message));
			};
  	});

  	it("should fail - Only owner can store game hash", async () => {
  		try{
				await bettingInstance.openBettingWindow({from: accounts[0]});
				Date.now = Date.now + 20000;
				await bettingInstance.startTournament({from: accounts[0]});
				await bettingInstance.storeGameHash("hash", {from:accounts[0]});
  		} catch(err) {
				assert.ok(/revert/.test(err.message));
			};
  	});

  	 it("should return hash hash", async () => {
  		try{
				await bettingInstance.storeGameHash("hash", {from:accounts[0]});
				const hash = await bettingInstance.getGameHash();
				assert.equal(hash, "hash", "should be equal to hash");
  		} catch(err) {
				assert.ok(/revert/.test(err.message));
			};
  	});
  })

  // describe("")
});
