import { ethers } from "ethers";
import { useWallet } from "../context/WalletProvider";
import ContributorAbi from "../jsons/Contributor.abi.json";
import AccessManagerV2Abi from "../jsons/AccessManagerV2.abi.json";
import { ContributorAddresses, AccessManagerV2Addresses } from "../constants/contracts";

export const useContributorContract = (): ethers.Contract | null => {
    const { signer } = useWallet()
    return signer ? new ethers.Contract(ContributorAddresses, ContributorAbi, signer) : null
}

export const useAccessManagerV2Contract = (): ethers.Contract | null => {
    const { signer } = useWallet()
    return signer ? new ethers.Contract(AccessManagerV2Addresses, AccessManagerV2Abi, signer) : null
}
