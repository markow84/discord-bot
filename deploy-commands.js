const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');

// ... reszta kodu pozostaje taka sama

function startContest(message, duration, prize) {
    const embed = new EmbedBuilder()
        .setTitle('Konkurs!')
        .setDescription(`Kliknij przycisk poniżej, aby wziąć udział w konkursie! Nagroda to ${prize}.`)
        .setColor(0x00FF00);

    const joinButton = new ButtonBuilder()
        .setCustomId('join_contest')
        .setLabel('Dołącz do konkursu!')
        .setStyle(ButtonStyle.Primary);

    message.channel.send({ embeds: [embed], components: [new ActionRowBuilder().addComponents(joinButton)] })
        // ... reszta funkcji pozostaje taka sama
}
