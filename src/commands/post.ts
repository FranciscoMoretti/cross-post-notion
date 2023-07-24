import DevToClient from "../clients/devto-client";
import GitHubClient from "../clients/github-client";
import HashnodeClient from "../clients/hashnode-client";
import MediumClient from "../clients/medium-client";
import { postDataFromNotion } from "../clients/notion-builder";
import Config, { ConfigNotion } from "../types/config";
import GlobalOptions, { Platforms } from "../types/global-options";
import { Post } from "../types/post";

type PostOptions = GlobalOptions & {
  platforms: Platforms[];
  dryRun: boolean;
};

export default async function post(
  url: string,
  { config, platforms, dryRun }: PostOptions
) {
  const promises = [];

  const postData: Post = await postDataFromNotion(config.notion, url);

  // if (platforms.includes(Platforms.GITHUB)) {
  //   const github = new GitHubClient(config.github, config.notion)
  //   promises.push(github.post(url, dryRun))
  // }

  // if (platforms.includes(Platforms.DEVTO)) {
  //   const devto = new DevToClient(config.devto, config.notion)
  //   promises.push(devto.post(url, dryRun))
  // }

  if (platforms.includes(Platforms.HASHNODE)) {
    const hashnode = new HashnodeClient(config.hashnode, postData);
    promises.push(hashnode.post(url, dryRun));
  }

  // if (platforms.includes(Platforms.MEDIUM)) {
  //   const medium = new MediumClient(config.medium, config.notion)
  //   promises.push(medium.post(url, dryRun))
  // }

  await Promise.all(promises).then(() =>
    console.log("Finished posting the article")
  );
}
