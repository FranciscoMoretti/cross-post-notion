import dotenv from "dotenv"
import fs from "fs"

//config must be loaded before importing
//any file that imports `config`
dotenv.config()

import config from 'config';
import post from "./commands/post"
import { program } from 'commander'
import { Platforms } from "./types/global-options";

program.usage('[command] [options]')
  .option('-c, --config <path>', 'Path to a JSON config file. By default, config files are loaded from config/default.json')
  .hook('preAction', (thisCommand, actionCommand) => {
    const configOption = thisCommand.opts().config
    let fullConfig
    if (configOption) {
      fullConfig = JSON.parse(fs.readFileSync(configOption).toString()).config
    } else {
      fullConfig = config.get('config')
    }

    actionCommand.setOptionValue('config', fullConfig)
  });

program
  .command('post <url>')
  .description('Cross post article')
  .action(post)
  .option(
    '-p, --platforms [platforms...]', 
    'Platforms to publish the article on.', Object.values(Platforms))

program.parse()