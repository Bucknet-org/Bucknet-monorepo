# Contributor SMC
## Install dependencies
### Init install dependencies
```bash
$ soldeer install
# or
$ soldeer update
```
### Install other zipped dependencies
```bash
$ soldeer install <dependency_name>~<version> <url>
```
## Run
### Simulations 
```bash
$ source .env
$ forge script script/Deployer.s.sol -f tbsc --private-key $DEPLOYER_KEY -vv
```
### Debug
```bash
$ source .env
$ forge script script/Debug.s.sol --sig 'debug(uint256, address, address, uint256, bytes)' $BLOCK $FROM $TO $VALUE $CALLDATA -f tbsc -vv
```
### Verify
```bash
$ source .env
$ forge verify-contract --chain-id 97 --num-of-optimizations 200000 --watch --constructor-args "" --etherscan-api-key $BSCSCAN_KEY {address} {path} 
```
### Broadcast
```bash
$ source .env
$ forge script script/Deployer.s.sol -f tbsc --private-key $DEPLOYER_KEY --broadcast -vv
```
### Test
```bash
$ forge test --mt testConcreteEvaluationSuccess -vv
```