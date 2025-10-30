import { SlashCommandBuilder } from "discord.js";
import { sleep } from "../../helpers/sleep.js";

const praiseCommandData = new SlashCommandBuilder()
  .setName('praise')
  .setDescription('Make the bot praise a user')
  .addUserOption(option =>
    option
      .setName('user')
      .setDescription('Mention a user to praise')
      .setRequired(true)
  );

const executePraiseCommand = async (interaction) => {
  const user = interaction.options.getUser('user');

  // Random funny praises 😄
  const praises = [
    `${user} is brighter than my LED lights 💡`,
    `If awesomeness had a face, it’d look like ${user} 😎`,
    `Yo ${user}, NASA called—they want their star back 🌟`,
    `${user} could make even grumpy cats smile 🐱✨`,
    `Legend says ${user} once debugged a program... on the first try 💻🔥`,
    `${user} has main character energy 🎬`,
    `${user} is the human version of a power-up 💪🎮`,
    `Whenever ${user} enters the chat, happiness follows 😄💫`,
  ];

  // Send reply and edit it multiple times for fun
  await interaction.reply(`Hold up... calculating how awesome ${user} is 🤔`);
  await sleep(3000);

  for (const line of praises) {
    await interaction.editReply(line);
    await sleep(3000);
  }

  await interaction.editReply(`I’m out of words... ${user} is just *too good* 🥹❤️`);
};

export default {
  data: praiseCommandData,
  execute: executePraiseCommand,
};
