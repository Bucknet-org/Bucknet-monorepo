import { Octokit } from "octokit";

const octokit = new Octokit({ 
  auth: process.env.PAT,
});

async function requestRetry(route: any, parameters: any) {
  try {
    const response = await octokit.request(route, parameters);
    return response
  } catch (error: any) {
    if (error.response && error.status === 403 && error.response.headers['x-ratelimit-remaining'] === '0') {
      const resetTimeEpochSeconds = error.response.headers['x-ratelimit-reset'];
      const currentTimeEpochSeconds = Math.floor(Date.now() / 1000);
      const secondsToWait = resetTimeEpochSeconds - currentTimeEpochSeconds;
      console.log(`You have exceeded your rate limit. Retrying in ${secondsToWait} seconds.`);
      setTimeout(requestRetry, secondsToWait * 1000, route, parameters);
    } else {
      console.error(error);
    }
  }
}

const githubApi = {
  wvs(epoch: number): Promise<any> {
    const path = `packages/wvs/src/wvs/${epoch}.json`
    console.log('path', path)
    return requestRetry(
      'GET /repos/{owner}/{repo}/contents/{path}',
      {
        owner: 'Bucknet-org',
        repo: 'Bucknet-monorepo',
        path: path,
        accept: 'application/vnd.github.raw+json',
        mediaType: {
          format: "raw",
        },
        ref: 'feat/wvs',
        branch: 'feat/wvs',
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      }
    );
  },
}

export default githubApi