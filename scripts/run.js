const main = async () => {
  // first param is default (you) then you can add random ones and use .connect to attach them to the contract
  const [owner, randomPerson] = await hre.ethers.getSigners();
  // compile CONTRACT (WAVEPORTAL) + generate files to work with contract in ARTIFACTS
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");

  /*
    - hardhat ccreates local ETH network for us, but just for THIS contract
	  - once completed, ETH network will be destroyed
  */
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1")
  }
  );
  await waveContract.deployed();
  let contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  )

  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  const firstWaveTxn  = await waveContract.wave("Yoo your first suh dude");
  await firstWaveTxn.wait();
  // const firstSecond = await waveContract.wave("againagain");
  // await firstSecond.wait();

  contractBalance = await hre.ethers.provider.getBalance(waveContract.address)
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  // attaches randomPerson to the contract which gives them access to wave
  const secondWaveTxn = await waveContract.connect(randomPerson).wave("I got u back brudda");
  await secondWaveTxn.wait();

  contractBalance = await hre.ethers.provider.getBalance(waveContract.address)
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );  
};

const runMain = async () => {
  try {
    await main();
    process.exit(0); // exit Node process without error
  } catch (error) {
    console.log(error);
    process.exit(1); // exit Node process while indicating 'Uncaught Fatal Exception' error
  }
  // Read more about Node exit ('process.exit(num)') status codes here: https://stackoverflow.com/a/47163396/7974948
};

runMain();