const { Client, GatewayIntentBits, EmbedBuilder, MessageActionRow , MessageButton, PermissionsBitField } = require('discord.js');
const token = 'token';

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions]
});


let status = [
    {
      name: 'PushMC.pl',
    },
    {
      name: 'dc.PushMC.pl',
    },
    {
      name: 'ts.PushMC.pl',
    },
  ];
  
  client.on('ready', async () => {
    console.log(`Zalogowano jako ${client.user.tag}!`);
    try {
        const channel = await client.channels.fetch(rulesChannelId);
        const message = await channel.messages.fetch(rulesMessageId);
        await message.react(reactionEmoji);
    } catch (error) {
        console.error('Nie udało się dodać reakcji:', error);
    }
    setInterval(() => {
        let random = Math.floor(Math.random() * status.length);
        client.user.setActivity(status[random]);
      }, 10000);
});
  


client.on('messageCreate', message => {
    if (message.content.startsWith('!czesc')) {
        if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const text = message.content.slice('!czesc'.length).trim();
        if (message.content === '!czesc') {
            message.channel.send('Cześć!');
        }
    }
    }
});


client.on('messageCreate', message => {
    if (message.content.startsWith('!wiadomosc')) {
        // Sprawdzenie, czy użytkownik ma uprawnienia administratora
        if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const text = message.content.slice('!wiadomosc'.length).trim();

            if(text) {
                message.channel.send(text);
            } else {
                message.channel.send('Musisz podać jakiś tekst!');
            }
        } else {
            message.channel.send('Nie masz uprawnień do użycia tej komendy!');
        }
    }
});
// konkursy
client.on('messageCreate', async message => {
    if (message.content.startsWith('!konkurs')) {
        // Sprawdzenie uprawnień administratora
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('Nie masz uprawnień, aby uruchomić konkurs.');
        }

        const args = message.content.split(' ').slice(1);
        if (args.length < 3) {
            return message.reply('Podaj czas trwania (w minutach), nagrodę i liczbę zwycięzców. Użycie: `!konkurs [czas] [nagroda] [liczba zwycięzców]`');
        }

        const duration = parseInt(args[0]);
        const prize = args.slice(1, -1).join(' ');
        const numberOfWinners = parseInt(args[args.length - 1]);

        if (isNaN(duration) || isNaN(numberOfWinners)) {
            return message.reply('Podane wartości czasu lub liczby zwycięzców są nieprawidłowe.');
        }

        await startContest(message, duration, prize, numberOfWinners);
    }
});

async function startContest(message, duration, prize, numberOfWinners) {
    const embed = new EmbedBuilder()
        .setTitle('Konkurs!')
        .setDescription(`Zareaguj na tę wiadomość, aby wziąć udział w konkursie! \n\n Do wygrania: **${prize}** \n Ilość osób do wygrania: **${numberOfWinners}** \n Czas trwania: **${duration}** minut.`)
        .setColor(0x202020)
        .setImage('https://cdn.discordapp.com/attachments/1182074327580020797/1182834709689020547/41414141.png');
        

    const contestMessage = await message.channel.send({ embeds: [embed] });
    const reactionEmoji = '🎉';
    await contestMessage.react(reactionEmoji);

    const filter = (reaction, user) => {
        return reaction.emoji.name === reactionEmoji && !user.bot;
    };

    const collector = contestMessage.createReactionCollector({ filter, time: duration * 60000 });

    const participants = new Set();
    collector.on('collect', (reaction, user) => {
        participants.add(user.id);
    });

    collector.on('end', () => {
        if (participants.size > 0) {
            // Losowanie zwycięzców
            const winners = Array.from(participants)
                                 .sort(() => 0.5 - Math.random())
                                 .slice(0, numberOfWinners);
            
            if (winners.length > 0) {
                const winnersMentions = winners.map(id => `<@${id}>`).join(', ');
                message.channel.send(`Konkurs się zakończył! Zwycięzcy to: ${winnersMentions}. Gratulacje!`);
            } else {
                message.channel.send('Niestety, nie ma wystarczającej liczby uczestników.');
            }
        } else {
            message.channel.send('Nikt nie dołączył do konkursu.');
        }
    });
}
//ankiety
client.on('messageCreate', async message => {
    if (message.content.startsWith('!ankieta')) {
        // Sprawdzenie, czy użytkownik ma uprawnienia administratora
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('Nie masz uprawnień do tworzenia ankiety.');
        }

        const surveyText = message.content.slice('!ankieta'.length).trim();

        if(!surveyText) {
            return message.reply('Proszę podać treść ankiety.');
        }

        const embed = new EmbedBuilder()
            .setTitle('Ankieta')
            .setDescription(surveyText)
            .setColor(0x202020)
            .setImage('https://i.imgur.com/hn5l0tW.png');

        const surveyMessage = await message.channel.send({ embeds: [embed] });
        // Dodanie reakcji dla ankiety
        await surveyMessage.react('👍'); // Reakcja dla TAK
        await surveyMessage.react('👎'); // Reakcja dla NIE
    }
});
// Propozycje
// ID kanału, na którym funkcja ma być aktywna
const monitoredChannelId = '1182833243238715432';

client.on('messageCreate', async message => {
    // Sprawdzenie, czy wiadomość pochodzi z monitorowanego kanału i nie jest wiadomością bota
    if (message.channel.id === monitoredChannelId && !message.author.bot) {
        // Tworzenie embeda z treścią wiadomości użytkownika
        const embed = new EmbedBuilder()
        .setTitle('Propozycja na serwer!')
        .setDescription(message.content)
        .setColor(0x202020)
        .setTimestamp()
        .setFooter({ text: `Propozycja od: ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
        .setImage('https://cdn.discordapp.com/attachments/1182824979436421210/1182834490314346666/11111111111111111111111111.png');

        // Wysyłanie embeda na kanał
        const sentEmbed = await message.channel.send({ embeds: [embed] });

        // Dodawanie reakcji TAK i NIE
        await sentEmbed.react('👍');
        await sentEmbed.react('👎');

        // Usunięcie oryginalnej wiadomości użytkownika
        await message.delete();
    }
});
//regulamin
const rulesChannelId = '1182073899656151101';
const rulesMessageId = '1182838916190048337';
const roleName = 'zweryfikowany';
const reactionEmoji = '👍'; // Emoji, które bot doda do wiadomości

client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.message.channel.id === rulesChannelId && reaction.message.id === rulesMessageId && !user.bot) {
        if (reaction.emoji.name === reactionEmoji) {
            const guild = reaction.message.guild;
            const member = guild.members.cache.get(user.id);
            const role = guild.roles.cache.find(r => r.name === roleName);

            if (role) {
                await member.roles.add(role);
                console.log(`Nadano rolę ${role.name} użytkownikowi ${user.tag}`);
            }
        }
    }
});
// embedy
client.on('messageCreate', async message => {
    if (message.content.startsWith('!embed')) {
        // Sprawdzenie, czy użytkownik ma uprawnienia administratora
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('Nie masz uprawnień do wysyłania embedów!');
        }

        const embedText = message.content.slice('!embed'.length).trim();

        if(!embedText) {
            return message.reply('Proszę podać treść embedu.');
        }

        const embed = new EmbedBuilder()
            //.setTitle('Nacisnij emotke aby sie zweryfikowac!')
            .setDescription(embedText)
            .setColor(0x202020)
            //.setImage('https://cdn.discordapp.com/attachments/1182824979436421210/1182833441641877585/1213211241414.png?ex=6586227c&is=6573ad7c&hm=cde79788ea4f02c118cf7980df1370558703cd8b2528249eb72d1875e23e3871&');
            const embedMessage = await message.channel.send({ embeds: [embed] });
    }
});
// ogłoszenie
client.on('messageCreate', async message => {
    if (message.content.startsWith('!ogloszenie')) {
        // Sprawdzenie, czy użytkownik ma uprawnienia administratora
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('Nie masz uprawnień do wysyłania embedów!');
        }

        const ogloszenieText = message.content.slice('!ogloszenie'.length).trim();

        if(!ogloszenieText) {
            return message.reply('Proszę podać treść embedu.');
        }

        // Usunięcie wiadomości z komendą
        try {
            await message.delete();
        } catch (error) {
            console.error('Nie udało się usunąć wiadomości:', error);
        }

        const embed = new EmbedBuilder()
            .setDescription(ogloszenieText)
            .setColor(0x202020)
            .setImage('https://i.imgur.com/hn5l0tW.png');

        // Wysłanie ogłoszenia
        const ogloszenieMessage = await message.channel.send({ embeds: [embed] });
    }
});
// event
client.on('messageCreate', async message => {
    if (message.content.startsWith('!event')) {
        // Sprawdzenie, czy użytkownik ma uprawnienia administratora
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('Nie masz uprawnień do wysyłania embedów!');
        }

        const eventText = message.content.slice('!event'.length).trim();

        if(!eventText) {
            return message.reply('Proszę podać treść eventu.');
        }

        // Usunięcie wiadomości z komendą
        try {
            await message.delete();
        } catch (error) {
            console.error('Nie udało się usunąć wiadomości:', error);
        }

        const embed = new EmbedBuilder()
            .setDescription(eventText)
            .setColor(0x202020)
            .setImage('https://i.imgur.com/hn5l0tW.png');

        // Wysłanie ogłoszenia
        const eventMessage = await message.channel.send({ embeds: [embed] });
    }
});
// changelog
client.on('messageCreate', async message => {
    if (message.content.startsWith('!changelog')) {
        // Sprawdzenie, czy użytkownik ma uprawnienia administratora
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('Nie masz uprawnień do wysyłania embedów!');
        }

        const changelogText = message.content.slice('!changelog'.length).trim();

        if(!changelogText) {
            return message.reply('Proszę podać treść eventu.');
        }

        // Usunięcie wiadomości z komendą
        try {
            await message.delete();
        } catch (error) {
            console.error('Nie udało się usunąć wiadomości:', error);
        }

        const embed = new EmbedBuilder()
            .setDescription(changelogText)
            .setColor(0x202020)
            //.setImage('https://i.imgur.com/hn5l0tW.png');

        // Wysłanie ogłoszenia
        const changelogMessage = await message.channel.send({ embeds: [embed] });
    }
});
//ticket

client.login(token);

