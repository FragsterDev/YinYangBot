import { SlashCommandBuilder } from "discord.js";

const sayCommandData = new SlashCommandBuilder()
.setName('say')
.setDescription('Make the bot say anything')
.addStringOption(option => option.setName('message')
.setDescription('The message that you want the bot to say')
.setRequired(true));

const executeSayCommand = async (interaction) => {
    const message = interaction.options.getString('message');

    await interaction.reply(message);
}

export default {
    data: sayCommandData,
    execute: executeSayCommand
}