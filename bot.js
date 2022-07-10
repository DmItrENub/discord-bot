const { Client, Intents } = require('discord.js'); // Подключаем библиотеку discord.js
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] }); // Объявляем, что robot - бот
const fs = require('fs'); // Подключаем родной модуль файловой системы node.js  
let config = require('./config.json'); // Подключаем файл с параметрами и информацией
let token = config.token; // «Вытаскиваем» из него токен
let prefix = config.prefix; // «Вытаскиваем» из него префикс
let moneys = require('./money.json') //добавляем json со значениями денег пользователей
let money = moneys.money
const ytdl = require('ytdl-core');
const queue = new Map();
const random = require("./random.js")
const qiwi = require('./qiwi-api.js')
var del = new Array()

client.on("ready", function() {
  /* При успешном запуске, в консоли появится сообщение «[Имя бота] запустился!» */
  console.log("Bot was load")
});

client.on('message', 'interactionCreate', interaction => async message => {
  if (del.includes(message.member)) {
    msg.delete();
  }
  if (message.author.bot) return;
  console.log(message.member + ":" + message);
  if (!message.content.startsWith(prefix)) return;

  const serverQueue = queue.get(message.guild.id);
  /*Radio*/
  if (message.content.startsWith(`${prefix}play`)) {
    execute(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}skip`)) {
    skip(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}stop`)) {
    stop(message, serverQueue);
    return;
  }
  /*Ping-Pong!*/
  if (message.content.startsWith(`${prefix}ping`)) {
    pong();
    return;
  }
  /*kick-mute member*/
  if (message.content.startsWith(`${prefix}kick`)) {
    kick();
    return;
  } else if (message.content.startsWith(`${prefix}mute`)) {
    await mute();
    return;
  }
  /*economy*/
  if (message.content.startsWith(`${prefix}work`)) {
    work(message)
  } else if (message.content.startsWith(`${prefix}donate`)) {
    donate(message)
  } else if (message.content.startsWith(`${prefix}crime`)) {
    crime(message)
  } else if (message.content.startsWith(`${prefix}poker`)) {
    poker(message)
  }
});

const poker = (message) => {
  let _money = parseInt(message.content.split(' '))
  moneys.author -= _money
  let bet = 0
  if (message.content.split(` ${_money} `) == "black") {
    bet = 33
  } else if (message.content.split(` ${_money} `) == "red") {
    bet = 34
  } else if (message.content.split(` ${money} `) == "zero") {
    bet = -1
  } else {
    bet = parseInt(message.content.split(` ${_money} `))
  }
  let _bet = random.randint(33)
  if (bet == 33 || bet == 34 || bet == -1) {
    if (_bet == 0) {
      if (bet == -1) {
        await interaction.reply({content:`You win! Your win ${(_money*2)}`, epehermal: true})
      } else {
        await interaction.reply({content:`You lose... You lose ${_money}`, epehermal: true})
      }
    }
    _bet %= 2
    if (_bet == 0) {
      if (bet == 33) {
        await interaction.reply({content:`You win! Your win ${(_money*2)}`, epehermal: true})
        money.author
      } else if (bet == 34) {
        await interaction.reply({content:`You lose... You lose ${_money}`})
      }
    } else if (_bet == 1) {
      if (bet == 33) {
        await interaction.reply({content:`You lose... You lose ${_money}`})
      } else if (bet == 34) {
        await interaction.reply({content:`You win! Your win ${(_money*2)}`, epehermal: true})
      }
    }
  } else {
    let _bet = random.randint(33)
    if (_bet == bet) {
      await interaction.reply({content:`You win! Your win ${(_money*32)}`, epehermal: true})
    } else {
      await interaction.reply({content:`You lose... You lose ${_money}`, epehermal: true})
    }
  }
  return
}

const crime = (message) => {
  if (!access(message.author, "crime")) { 
    await interaction.reply({content: `You can't crime now!`})
    return
  }
  const member = message.member
  if (!money.author) {
    money.author = 100;
  }
  const randomm = random.randint(150)
  if (random.randint(1)) {
    randomm = -ramdomm
  }
  money.member += randomm
  await interaction.reply({ content: `You crime ${random} money`, epehermal: true })
}

const convert = (num) => {
  return num
      .toString()    // convert number to string
      .split('')     // convert string to array of characters
      .map(Number)   // parse characters as numbers
      .map(n => (n || 10) + 64)   // convert to char code, correcting for J
      .map(c => String.fromCharCode(c))   // convert char codes to strings
      .join('');
}

const donate = (message) => {
  let command = message.content.split(' ');
  let _money
  let comment
  if (command.startsWith("economy"))
  {
    _money = parseInt(message.content.split(' economy ')) / 100
    comment = message.author + " in economy"
    await interaction.reply({content:`You need to pay ${money/65} dollars in qiwi wallet(+79200000085) with comment: ${comment}`, epehermal:true})
    await qiwi.getMoney(comment, (bool) => {
      if (bool) {
        money.author += _money
      } else {
        await interaction.reply("You not paid")
      }
    })
    return;
  } /*else if (command.startsWith("generator")) {
    money = parseInt(message.member.split(' generator ')) * 0.3
    comment = sessionGenerate()
    await interaction.reply({content:`You need to pay ${money} rubles in qiwi wallet(+79200000085) with comment: ${comment} plus your identificator`, epehermal:true})
    return
  }*/else if (command.startsWith("charity")) {
    await interation.reply({content:"Thank you! You can donate my Qiwi wallet +79200000085"})
    return
  }
}

const work = (message) => {
  if (!access(message.author, "work")) { 
    await interaction.reply({content: `You can't work now!`})
    return
  }
  const member = message.author
  if (!money.author) 
  {
    money.auhtor = 100;
  }
  const randomm = random.randint(150)
  money.member += randomm
  await interaction.reply({ content: `You work ${randomm} money`, epehermal: true })
  money.member.time = new Date() + 7200000
}

const access = (member, data) => {
  const time = new Date()
  const _time = money[member]["time"][data]
  if (time <= _time)
    return false;
  else
    return true;
}

async function mute(message) {
  const member = message.content.split(' ');
  del.push(member)
  await interation.reply({content:""})
  qiwi.sleep(86400000)
}

function pong() {
  await interaction.reply({ content: "Pong!", epehermal: true }); 
}

async function execute(message, serverQueue) {
  const args = message.content.split(' ');

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
  const permissions = voice.channel.permissionsFor(message.client.user);
  if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
    return message.channel.send('I need the permissions to join and speak in your voice channel!');
  }

  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
    title: songInfo.title,
    url: songInfo.video_url,
  };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true,
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    console.log(serverQueue.songs);
    return message.channel.send(`${song.title} has been added to the queue!`);
  }

}

function skip(message, serverQueue) {
  if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
  if (!serverQueue) return message.channel.send('There is no song that I could skip!');
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);

  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
    .on('end', () => {
      console.log('Music ended!');
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on('error', error => {
      console.error(error);
    });
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}



client.login(token); // Авторизация бота