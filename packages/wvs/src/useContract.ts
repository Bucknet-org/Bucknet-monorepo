import { ethers } from 'ethers';
import { CONTRIBUTOR_ADDRESS, RPC_URL } from './constants';
import CONTRIBUTOR_ABI from "./jsons/contributor.abi.json";

export const useContributorContract = (privateKey: string) => {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(privateKey, provider);
    return new ethers.Contract(CONTRIBUTOR_ADDRESS, CONTRIBUTOR_ABI, wallet);
};