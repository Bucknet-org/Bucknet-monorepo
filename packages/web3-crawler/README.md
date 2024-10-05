## Installing

Run the following command:

```sh
pnpm i
```

## Running crawler

```sh
chmod +x ./dev.sh
./dev.sh
```

## Change parameters

Open the index.ts file and replace filterAddress argument by the address required to query in the following codes:

```sh
(async () => {
    const testDir = join(__dirname, 'test');
    const crawler = new EVMCrawler(["https://ethereum-rpc.publicnode.com","https://rpc.graffiti.farm", "https://rpc.mevblocker.io/fullprivacy"]);
    const res = await crawler.fetchBlocksInRange(20824880, 20824890);
    saveFile(join(testDir, "test.json"), res);

    const filterAddress = "0xA9a01bDB8b9B600F321c1a70CcE9BB9D756C724f"
    const filterRes = filterSample(join(testDir, "test.json"), filterAddress);
    saveFile(join(testDir, `${filterAddress}.json`), filterRes);
    console.log("Txs match length: ", filterRes.length)
})();
```

## Output

Output will be added in the test folder.