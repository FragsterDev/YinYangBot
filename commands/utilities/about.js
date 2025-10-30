import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

const aboutCommandData = new SlashCommandBuilder()
.setName('about')
.setDescription('About the Bot')

const executeAboutCommand = async (interaction) => {
    const botUser = interaction.client.user;

    const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle('About YinYang Bot')
    .setDescription(
      "Hey there! I’m YinYang — your friendly Discord companion bot ✨\n" +
      "I can make you laugh, praise your friends, and sometimes act drunk 🍻"
    )
    .addFields(
        {
            name: "Developer",
            value: "Fermion",
            inline: true
        },
        {
            name: "Version",
            value: "v1.0.0",
            inline: true
        }
    )
    .setThumbnail(botUser.displayAvatarURL())
    .setFooter({text: `Running since ${new Date(botUser.createdTimeStamp).toLocaleDateString()}`})
    .setTimestamp();

    await interaction.reply({embeds: embed});
}

export default {
    data: aboutCommandData,
    execute: executeAboutCommand
}