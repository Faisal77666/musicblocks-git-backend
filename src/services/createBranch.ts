import { config } from "../config/gitConfig";
import { getAuthenticatedOctokit } from "../utils/octokit";

export const createBranch = async (
  repoName: string,
  branchName: string,
  branchedFrom: string
) => {
  try {
    const octokit = await getAuthenticatedOctokit();
    const org = config.org;
    const { data: refBranch } = await octokit.request(
      "GET /repos/{owner}/{repo}/git/ref/heads/{ref}",
      {
        owner: org,
        repo: repoName,
        ref: branchedFrom,
      }
    );
    const refSha = refBranch.object.sha;
    const { data: newBranch } = await octokit.request(
      "POST /repos/{owner}/{repo}/git/refs",
      {
        owner: org,
        repo: repoName,
        ref: `refs/heads/${branchName}`,
        sha: refSha,
      }
    );

    return {
      branchName: newBranch.ref.replace("refs/heads/", ""),
      sha: newBranch.object.sha,
      url: newBranch.url,
    };
  } catch (error) {
    console.log("error in creating a new branch", error);
    throw error;
  }
};
