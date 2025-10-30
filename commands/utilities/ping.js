import { SlashCommandBuilder } from "discord.js";

const pingCommandData = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong and shows latency!");

const executePingCommand = async (interaction) => {
  const sent = await interaction.reply({ content: "Pinging...", fetchReply: true });
  const latency = sent.createdTimestamp - interaction.createdTimestamp;
  const apiLatency = Math.round(interaction.client.ws.ping);

  await interaction.editReply(`🏓 Pong! Latency: **${latency}ms** | API: **${apiLatency}ms**`);
};

export default {
  data: pingCommandData,
  execute: executePingCommand,
};
