import { SlashCommandBuilder } from "discord.js";

const drunkCommandData = new SlashCommandBuilder()
  .setName('drunk')
  .setDescription('Make the bot say things like a drunk person');

const executeDrunkCommand = async (interaction) => {
  await interaction.reply('Uhh... 🥴');

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  await sleep(3000);
  await interaction.editReply("Wait... who took my beer 🍻");

  await sleep(3000);
  await interaction.editReply("You’re... you’re my best friend 😭");

  await sleep(3000);
  await interaction.editReply("No no listen... I can *totally* walk straight 😤");

  await sleep(3000);
  await interaction.editReply("Oh... oh no 😵‍💫 I think I need water 💧");

  await sleep(3000);
  await interaction.editReply("Zzzzz... 💤💤💤");

  await sleep(3000);
  await interaction.editReply("I... passed out 😴💤");
};

export default {
  data: drunkCommandData,
  execute: executeDrunkCommand
};
