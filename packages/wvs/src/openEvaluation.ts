import { join } from "path";
import { dirLength, loadFile, saveFile } from "./utils";
import { processData } from "./dataProcessor";
import { useContributorContract } from "./useContract";
import slotsJson from "./jsons/slots.json"
import { RawData, TxsData } from "./types";

async function openEvaluation() {
    const PK = process.env.PRIVATE_KEY || '';
    const wvsDir = join(__dirname, 'test')
    const currentEpoch = dirLength(wvsDir)
    const poe = await processData(wvsDir, currentEpoch)
    const contract = useContributorContract(PK)
    const rawData = loadFile(join(wvsDir, `${currentEpoch.toString()}.json`));

    const slots: number[] = []
    const numOfWorks: number[] = []
    const slotsObj: { [member in string]: number } = slotsJson

    rawData['wvs'].map((item: RawData) => {
        if (slotsObj[item.member.toLocaleLowerCase()] !== undefined) {
            slots.push(slotsObj[item.member.toLocaleLowerCase()])
            numOfWorks.push(Object.keys(item.works).length)
        }
    });

    console.log("Poe: ", poe)
    console.log("Slots: ", slots)
    console.log("NoWs: ", numOfWorks)

    const gasEstimate = await contract.openEvalSession.estimateGas(poe, slots, numOfWorks);
    console.log(`Estimated Gas: ${gasEstimate.toString()}`);

    const tx = await contract.openEvalSession(poe, slots, numOfWorks, {gasLimit: gasEstimate * BigInt(120) / BigInt(100) , gasPrice: 5000000000 })
    tx.wait();
    console.log(tx.hash)

    const txs: TxsData = {
        poe: poe,
        txHash: tx.hash,
        sender: tx.from,
    }

    rawData["txsData"] = txs

    saveFile(join(wvsDir, `${currentEpoch.toString()}.json`), rawData)
};

openEvaluation().catch(console.error);