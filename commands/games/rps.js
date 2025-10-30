
import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, time } from "discord.js";
import { sleep } from "../../helpers/sleep.js";

const rpsCommandData = new SlashCommandBuilder()
.setName('rps')
.setDescription('Challenge someone to play rock paper scissors')
.addUserOption(options => options.setName('user')
.setDescription('Select a user to challenge')
.setRequired(true));

const executeRpsCommand = async (interaction) => {

    const challenger = interaction.user;
    const challengedUser = interaction.options.getUser('user');

    
    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setCustomId('acceptrps')
        .setLabel('Accept')
        .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
        .setCustomId('rejectrps')
        .setLabel('Reject')
        .setStyle(ButtonStyle.Danger)
    )

    const messageContent = `${challengedUser}, you have been challenged by ${challenger} for rock, paper scissors. Do you accept ?`

    const message = await interaction.reply({content: messageContent, components: [row], fetchReply: true});

    const messageCollector = message.createMessageComponentCollector({time: 15000});

    messageCollector.on("collect", async (i) => {
        if(i.customId === "rejectrps"){
            await i.update({
                content: `${challengedUser} declined the request `,
                components: []
            });

            messageCollector.stop();
        } else if(i.customId === "acceptrps"){
            await i.update({
            content: `${challengedUser} accepted the challenge! 🎮`,
            components: [],
            });

            await sleep(4000);

            await i.update({
            content: `🎮 Game is loading...`,
            components: [],
            });

            await sleep(5000);

            await startGame(interaction, challenger, challengedUser);
            messageCollector.stop();
        }
    })

    messageCollector.on('end', async (collected) => {
        if(collected.size === 0){
            await interaction.editReply({
                content: "Challenge Expired",
                embeds: [],
                components: []
            })
        }
    })


}

async function startGame(interaction,challenger, challenged) {
    const choices = ["rock", "paper", "scissors"];
    const emojis = { rock: "🪨", paper: "📄", scissors: "✂️" };

  const gameButtons = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("rock").setLabel("🪨 Rock").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("paper").setLabel("📄 Paper").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("scissors").setLabel("✂️ Scissors").setStyle(ButtonStyle.Primary)
  );

  let challengerChoice = null
  let challengedChoice = null

  const message = await interaction.followUp({
    content: `🎮 RPS Challenge: ${challenger} vs ${challenged}`,
    components: [gameButtons],
    fetchReply: true
  });

  const collector = message.createMessageComponentCollector({time: 30000})

  collector.on('collect', async (i) => {

    if(i.user.id === challenger.id && !challengerChoice){
        challengerChoice = i.customId;
        await i.reply({content: `You have chosen ${emojis[i.customId]}`, ephemeral: true});
    }
    else if(i.user.id === challenged.id && !challengedChoice){
        challengedChoice = i.customId;
        await i.reply({content: `You have chosen ${emojis[i.customId]}`, ephemeral: true});
    }
    else {
        await i.reply({content: 'You have already chosen', ephemeral:true});
    }

    if(challengerChoice && challengedChoice){
      collector.stop();
  
    const result = getRpsResult(challengerChoice, challengedChoice);
    let resultText = '';
  
    if(result === 'draw'){
       resultText = `It's a **draw!** Both chose ${emojis[challengerChoice]}`;
    }
  
    else if(result === 'challenger'){
      resultText = `🏆 ${challenger} wins! ${emojis[challengerChoice]} beats ${emojis[challengedChoice]}`;
    }
  
    else {
      resultText = `🏆 ${challenged} wins! ${emojis[challengedChoice]} beats ${emojis[challengerChoice]}`;
    }
  
    await message.edit({
          content: `🎮 **Rock Paper Scissors**\n${challenger} chose ${emojis[challengerChoice]}\n${challenged} chose ${emojis[challengedChoice]}\n\n${resultText}`,
          components: [],
        });
    }
  });
   
   collector.on("end", async (collected, reason) => {
    if (reason !== "done") {
      await message.edit({
        content: `⌛ Game expired! One or both players didn't choose in time.`,
        components: [],
      });
    }
  });
}

function getRpsResult(challengerChoice, challengedChoice){
    if(challengerChoice === challengedChoice){
        return 'draw';
    }

    if( (challengerChoice === 'rock' && challengedChoice === 'scissor')|
        (challengerChoice === 'paper' && challengedChoice === 'rock')|
        (challengerChoice === 'scissor' && challengedChoice === 'paper')) {
            return 'challenger';
        } else {
            return 'challenged';
        }
}

export default {
    data:rpsCommandData,
    execute: executeRpsCommand
}