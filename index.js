const {
  Client,
  GatewayIntentBits,
  Partials,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Events
} = require("discord.js");

require("dotenv").config();

const TOKEN = process.env.TOKEN;

// حط هنا ID الروم اللي البوت هيبعت فيه البانل
const PANEL_CHANNEL_ID = "1519683500498751689";

// حط هنا ID السيرفر
const GUILD_ID = "1492895005725954159";

// الرتب والأزرار
const roles = [
  {
    id: "1519688688525774968",
    label: "News Notifications",
    emoji: "📣",
    style: ButtonStyle.Primary
  },
  {
    id: "1519688917878571098",
    label: "Stream Notifications",
    emoji: "🎬",
    style: ButtonStyle.Success
  },
  {
    id: "1519689282670035055",
    label: "Event Notifications",
    emoji: "🎉",
    style: ButtonStyle.Danger
  },
  {
    id: "1519689466359451748",
    label: "Update Notifications",
    emoji: "🚀",
    style: ButtonStyle.Secondary
  },
  {
    id: "1519689649323511908",
    label: "Government Notifications",
    emoji: "👜",
    style: ButtonStyle.Secondary
  },
  {
    id: "1519021760740069558",
    label: "Voice Changer",
    emoji: "➕",
    style: ButtonStyle.Secondary
  }
];

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel]
});

client.once(Events.ClientReady, async () => {
  console.log('✅ Logged in as ${client.user.tag}');

  const guild = await client.guilds.fetch(GUILD_ID);
  const channel = await guild.channels.fetch(PANEL_CHANNEL_ID);

  const embed = new EmbedBuilder()
    .setColor("#ff0000")
    .setDescription("في الأسفل هتلاقي الرتب اللي هتستخدم للتنبيهات");

  const rows = [];
  let row = new ActionRowBuilder();

  roles.forEach((role, index) => {
    const button = new ButtonBuilder()
      .setCustomId('role_${role.id}')
      .setLabel(role.label)
      .setEmoji(role.emoji)
      .setStyle(role.style);

    row.addComponents(button);

    if (row.components.length === 5 || index === roles.length - 1) {
      rows.push(row);
      row = new ActionRowBuilder();
    }
  });

  await channel.send({
    embeds: [embed],
    components: rows
  });

  console.log("✅ Role panel sent");
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;
  if (!interaction.customId.startsWith("role_")) return;

  const roleId = interaction.customId.replace("role_", "");
  const role = interaction.guild.roles.cache.get(roleId);

  if (!role) {
    return interaction.reply({
      content: "❌ الرول دي مش موجودة.",
      ephemeral: true
    });
  }

  const member = interaction.member;

  try {
    if (member.roles.cache.has(roleId)) {
      await member.roles.remove(roleId);

      return interaction.reply({
        content: ✅ تم إزالة رول ${role.name} منك.,
        ephemeral: true
      });
    } else {
      await member.roles.add(roleId);

      return interaction.reply({
        content: ✅ تم إعطاؤك رول ${role.name}.,
        ephemeral: true
      });
    }
  } catch (err) {
    console.log(err);

    return interaction.reply({
      content: "❌ مش قادر أدي/أشيل الرول. اتأكد إن رول البوت أعلى من الرتب دي.",
      ephemeral: true
    });
  }
});

client.login(TOKEN);
