import { join } from "path";
import { dirLength, loadFile, saveFile } from "./utils";
import { processData } from "./dataProcessor";
import { useContributorContract } from "./useContract";
import slotsJson from "./jsons/slots.json"
import { RawData } from "./types";

async function openEvaluation() {
    const PK = '0xaf595541ff791a067c6986e5495ea7a58c09f48c87ce5719510de72583c72886';
    const txsDir = join(__dirname, "txs")
    const wvsDir = join(__dirname, 'wvs')
    const currentEpoch = dirLength(wvsDir)
    const PoE = await processData(wvsDir, currentEpoch)
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

    console.log("Poe: ", PoE)
    console.log("Slots: ", slots)
    console.log("NoWs: ", numOfWorks)

    const gasEstimate = await contract.openEvalSession.estimateGas(PoE, slots, numOfWorks);
    console.log(`Estimated Gas: ${gasEstimate.toString()}`);

    const tx = await contract.openEvalSession(PoE, slots, numOfWorks, {gasLimit: gasEstimate * BigInt(120) / BigInt(100) , gasPrice: 5000000000 })
    tx.wait();
    console.log(tx.hash)
    saveFile(join(txsDir, `${currentEpoch.toString()}.json`), tx.hash)
};

openEvaluation().catch(console.error);