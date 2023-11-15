const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
const token = 'MTE3NDMxNzI3MDgxNDcwNzc1Mw.GCj1e9.Zg1FgR1fMc9qCV5pjNHlTaOTxBUVlXZiP0P03A';

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent]
});

let status = [
    {
      name: 'MedPvP.pl',
    },
    {
      name: 'dc.MedPvP.pl',
    },
    {
      name: 'ts.MedPvP.pl',
    },
  ];
  
  client.on('ready', (c) => {
    console.log(`${c.user.tag} wlaczony!`);
  
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
client.login(token);

