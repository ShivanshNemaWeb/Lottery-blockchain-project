const Lottery=artifacts.require('lottery');

module.exports=async function (deployer,networks,accounts){
   await deployer.deploy(Lottery);
   const lottery=await Lottery.deployed();
};
