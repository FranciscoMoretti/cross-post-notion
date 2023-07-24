import DevToClient from "../clients/devto-client";
import GitHubClient from "../clients/github-client";
import HashnodeClient from "../clients/hashnode-client";
import MediumClient from "../clients/medium-client";
import Notion from "../clients/notion-client";
import GlobalOptions, { Platforms } from "../types/global-options";
import { Post } from "../types/post";
import { ConfigNotion } from "../types/config";

type PostOptions = GlobalOptions & {
  platforms: Platforms[];
  dryRun: boolean;
};

export default async function post(
  url: string,
  { config, platforms, dryRun }: PostOptions
) {
  const promises = [];

  // FROM NOTION
  const notion_config: ConfigNotion = config.notion;
  const notion = new Notion(notion_config);

  //get page id
  const pageId = notion.getPageIdFromURL(url);
  //get blocks
  const blocks = await notion.getBlocks(url);

  //transform blocks to markdown
  const markdown = await notion.getMarkdown(blocks);
  const properties = await notion.getArticleProperties(pageId);

  const canonical_url =
    config.hashnode.options.properties &&
    notion.getAttributeValue(
      properties[config.hashnode.options.properties?.original_article_url]
    );
  const tags =
    config.hashnode.options.properties &&
    notion.getAttributeValue(
      properties[config.hashnode.options.properties?.tags]
    );

  const postData: Post = {
    title: "My Article Title",
    markdown: markdown,
    canonical_url: canonical_url,
    tags: tags,
  };

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
