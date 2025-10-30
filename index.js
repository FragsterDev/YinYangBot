import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { pathToFileURL } from 'url';

dotenv.config();

// __dirname fix for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`✅ Ready! Logged in as ${readyClient.user.tag}`);
});

client.commands = new Collection();

const commandsFolderPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsFolderPath);

for (const folder of commandFolders) {
  const commandPath = path.join(commandsFolderPath, folder);
  const commandFiles = fs.readdirSync(commandPath).filter((file) => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandPath, file);
    const command = await import(pathToFileURL(filePath).href); // ✅ works fine in ESM

    // support default exports
    const cmd = command.default || command;

    if ('data' in cmd && 'execute' in cmd) {
      client.commands.set(cmd.data.name, cmd);
    } else {
      console.log(`[⚠️ WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: 'There was an error while executing this command!',
				flags: MessageFlags.Ephemeral,
			});
		} else {
			await interaction.reply({
				content: 'There was an error while executing this command!',
				flags: MessageFlags.Ephemeral,
			});
		}
	}
});

client.login(process.env.TOKEN);
