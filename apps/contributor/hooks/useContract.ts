import { ethers } from "ethers";
import { useWallet } from "../context/WalletProvider";
import ContributorAbi from "../jsons/Contributor.abi.json";
// import AccessManagerV2Abi from "../jsons/AccessManagerV2.abi.json";
import { ContributorAddresses } from "../constants/contracts";

export const useContributorContract = () => {
    const {signer} = useWallet()
    return new ethers.Contract(ContributorAddresses, ContributorAbi, signer)
}

