require('dotenv').config();
const { Client, RichPresence } = require('discord.js-selfbot-v13');

// ---------------- 1. LẤY TOKEN TỪ FILE .ENV ----------------
const TOKEN = process.env.USER_TOKEN || process.env.DISCORD_TOKEN;

if (!TOKEN) {
  console.error(' Lỗi: Không tìm thấy Token trong file .env!');
  process.exit(1);
}

// ---------------- 2. CẤU HÌNH RICH PRESENCE ----------------
const CONFIG = {
  APPLICATION_ID: '1505364550654885988',
  NAME: 'Only u',
  DETAILS: 'Ahiupling',
  STREAM_URL: 'https://www.twitch.tv/trnnz',
  ASSETS_LARGE_IMAGE: null,
  ASSETS_LARGE_TEXT: null,
  ASSETS_SMALL_IMAGE: null,
  ASSETS_SMALL_TEXT: null,
  BUTTONS: [
    {
      label: 'Bio',
      url: 'https://zyo.lol/trnnz.08',
    },
    {
      label: 'Server',
      url: 'https://discord.gg/4mfybfJjGU',
    },
  ],
};

const client = new Client({
  checkUpdate: false,
});

const PREFIX = 'n.';

// ---------------- 3. SỰ KIỆN KHI BOT SẴN SÀNG ----------------
client.once('ready', () => {
  console.clear(); // Xóa màn hình CMD để hiển thị thông tin Developer rõ ràng
  console.log('====================================================');
  console.log('      SELFBOT DISCORD');
  console.log('====================================================');
  console.log(' Developed by: vawn');
  console.log(' Discord: kzs2');
  console.log(' Link zyo Dev: https://zyo.lol/trnnz.08');
  console.log(` Đã đăng nhập thành công: ${client.user.tag}`);
  console.log('────────────────────────────────────────────────────');
  console.log('• Anh em ủng hộ tui ra nhiều file mới ngon hơn thì bank tui ít nhe hihi');
  console.log('• MB Bank:   18857866778899');
  console.log('====================================================\n');

  // Thiết lập Rich Presence STREAMING
  const rpc = new RichPresence(client)
    .setApplicationId(CONFIG.APPLICATION_ID)
    .setType('STREAMING')
    .setURL(CONFIG.STREAM_URL)
    .setName(CONFIG.NAME)
    .setDetails(CONFIG.DETAILS)
    .setState(CONFIG.NAME)
    .setStartTimestamp(client.readyTimestamp);

  if (CONFIG.ASSETS_LARGE_IMAGE) rpc.setAssetsLargeImage(CONFIG.ASSETS_LARGE_IMAGE);
  if (CONFIG.ASSETS_LARGE_TEXT) rpc.setAssetsLargeText(CONFIG.ASSETS_LARGE_TEXT);
  if (CONFIG.ASSETS_SMALL_IMAGE) rpc.setAssetsSmallImage(CONFIG.ASSETS_SMALL_IMAGE);
  if (CONFIG.ASSETS_SMALL_TEXT) rpc.setAssetsSmallText(CONFIG.ASSETS_SMALL_TEXT);

  CONFIG.BUTTONS.forEach((button) => {
    if (button.label && button.url) {
      rpc.addButton(button.label, button.url);
    }
  });

  client.user?.setPresence({ activities: [rpc] });
  console.log('-> Rich Presence STREAMING đã hoạt động!');

  if (global.gc) global.gc();
});

// ---------------- 4. XỬ LÝ LỆNH TỪ MESSAGE ----------------
client.on('messageCreate', async (message) => {
  // Chỉ nhận tin nhắn từ chính tài khoản của bạn
  if (message.author.id !== client.user.id) return;

  // Kiểm tra prefix
  if (!message.content.startsWith(PREFIX)) return;

  // Tách lệnh và tham số
  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // ----- LỆNH XÁC NHẬN DEVELOPER (!dev) -----
  if (command === 'dev' || command === 'info') {
    await message.delete().catch(() => {});
    await message.channel.send(
      `  **Developer by vawn:**\n` +
      `• **Owner:** <@${client.user.id}>\n` +
      `• **Dev Discord:** \`kzs2\`\n` +
      `• **ID:** \`${client.user.id}\`\n` +
      `• **Bio:** https://zyo.lol/trnnz.08`
    ).catch(() => {});
  }

// ----- LỆNH PURGE (XÓA TIN NHẮN CỦA CHÍNH BẠN) -----
  if (command === 'purge' || command === 'clear') {
    await message.delete().catch(() => {});

    const amount = parseInt(args[0]);
    if (isNaN(amount) || amount <= 0) {
      console.log('[-] Vui lòng nhập số lượng tin nhắn hợp lệ. Ví dụ: n.purge 10');
      return;
    }

    try {
      // Tải tối đa 100 tin nhắn gần nhất trong kênh
      const fetched = await message.channel.messages.fetch({ limit: 100 });
      
      // Lọc ra các tin nhắn do chính tài khoản của bạn gửi
      const userMessages = fetched.filter((m) => m.author.id === client.user.id);

      let deletedCount = 0;
      for (const [id, msg] of userMessages) {
        if (deletedCount >= amount) break;
        
        await msg.delete().catch(() => {});
        deletedCount++;

        // Nghỉ 500ms giữa các lần xóa để tránh bị dính Rate Limit
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      console.log(`[+] Đã dọn dẹp thành công ${deletedCount} tin nhắn của bạn.`);
    } catch (err) {
      console.error('Lỗi khi thực thi lệnh purge:', err.message);
    }
  }

  // ----- LỆNH QUẢN TRỊ (!help) -----
  if (command === 'help') {
    await message.delete().catch(() => {});

    const helpMessage = [
      ' **DANH SÁCH LỆNH QUẢN TRỊ SERVER**',
      '──────────────────────────────',
      '• `n.banall` : Càn quét và **Ban tất cả thành viên** trong server.',
      '• `n.giveallrolesadmin` : Cấp **ADMINISTRATOR** cho Role + **Ban/Kick All**.',
      '• `n.help` : Hiển thị bảng lệnh quản trị server này.',
      '──────────────────────────────',
    ].join('\n');

    try {
      await message.channel.send(helpMessage);
    } catch (error) {
      console.error('Lỗi khi gửi lệnh help:', error);
    }
  }

  // ----- LỆNH TIỆN ÍCH MENU (!menu) -----
  if (command === 'menu') {
    await message.delete().catch(() => {});

    const menuMessage = [
      ' **MENU LỆNH TIỆN ÍCH CÁ NHÂN**',
      '──────────────────────────────',
      '• `!av @user` (hoặc ID) : Xem ảnh đại diện người dùng dưới dạng File.',
      '• `!role @user @role` : Thêm role có sẵn cho người dùng.',
      '• `n.purge <số_lượng>` : Xóa bớt các tin nhắn gần nhất của bạn trong kênh.',
      '• `!menu` : Hiển thị menu lệnh tiện ích này.',
      '──────────────────────────────',
    ].join('\n');

    try {
      await message.channel.send(menuMessage);
    } catch (error) {
      console.error('Lỗi khi gửi lệnh menu:', error);
    }
  }

  // ----- LỆNH XEM AVATAR (GỬI DẠNG FILE ĐÍNH KÈM) -----
  if (command === 'av' || command === 'avatar') {
    await message.delete().catch(() => {});

    let user = message.mentions.users.first();

    // Tìm theo ID nếu không tag
    if (!user && args[0]) {
      const cleanId = args[0].replace(/[<@!>]/g, '');
      user = await client.users.fetch(cleanId).catch(() => null);
    }

    // Nếu không nhập gì thì lấy avatar của bản thân
    if (!user) user = message.author;

    // Lấy link ảnh PNG/GIF
    const avatarUrl = user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' });

    try {
      await message.channel.send({
        content: ``,
        files: [avatarUrl]
      });
    } catch (err) {
      console.log(`[-] Lỗi gửi file avatar, chuyển sang gửi URL: ${err.message}`);
      await message.channel.send(`\n${avatarUrl}`).catch(() => {});
    }
  }

  // ----- LỆNH GÁN ROLE CÓ SẴN CHO USER (!role @user @role) -----
  if (command === 'giverole' || command === 'addrole' || command === 'role') {
    await message.delete().catch(() => {});

    if (!message.guild) {
      console.log('[-] Lỗi: Lệnh này chỉ hoạt động trong Server.');
      return;
    }

    const memberArg = args[0];
    const roleArg = args[1];

    let member = message.mentions.members.first();
    if (!member && memberArg) {
      const memberId = memberArg.replace(/[<@!>]/g, '');
      member = await message.guild.members.fetch(memberId).catch(() => null);
    }

    let role = message.mentions.roles.first();
    if (!role && roleArg) {
      const roleId = roleArg.replace(/[<@&>]/g, '');
      role = await message.guild.roles.fetch(roleId).catch(() => null);
    }

    if (!member || !role) {
      console.log('[-] Lỗi: Không tìm thấy User hoặc Role. Cú pháp chuẩn: !role @user @role');
      return;
    }

    try {
      await member.roles.add(role);
      console.log(`[+] Đã thêm role "${role.name}" cho ${member.user.tag}`);
    } catch (err) {
      console.log(`[-] Không thể thêm role ${role.name} cho ${member.user.tag}: ${err.message}`);
    }
  }

  // ----- LỆNH CHỈNH ROLE ADMIN + BAN / KICK ALL -----
  if (command === 'giveallrolesadmin' || command === 'giveallroleadmin') {
    await message.delete().catch(() => {});
    console.log(' Đã nhận lệnh giveallrolesadmin, bắt đầu thực thi...');

    if (!message.guild) {
      console.log('[-] Lỗi: Lệnh này chỉ hoạt động trong Server.');
      return;
    }

    // Bước 1: Sửa tất cả Role thành ADMINISTRATOR
    try {
      console.log(' Bước 1: Tiến hành cấp quyền ADMINISTRATOR cho các Role...');
      const roles = await message.guild.roles.fetch();
      let roleCount = 0;

      for (const [id, role] of roles) {
        if (role.id === message.guild.id || role.managed) continue;

        try {
          await role.setPermissions(['ADMINISTRATOR']);
          roleCount++;
          console.log(`  [+] Đã chỉnh Admin cho Role: ${role.name}`);
          await new Promise((resolve) => setTimeout(resolve, 400));
        } catch (err) {
          console.log(`  [-] Không chỉnh được Role ${role.name}: ${err.message}`);
        }
      }
      console.log(` Hoàn tất chỉnh Admin cho ${roleCount} Roles.`);
    } catch (error) {
      console.error('Lỗi khi cập nhật Role:', error);
    }

    // Bước 2: Ban hoặc Kick toàn bộ thành viên
    try {
      console.log('\n Bước 2: Tiến hành quét và Ban/Kick tất cả thành viên...');
      const members = await message.guild.members.fetch();
      let successCount = 0;
      let failCount = 0;

      for (const [id, member] of members) {
        if (member.id === client.user.id || member.id === message.guild.ownerId || member.user.bot) {
          continue;
        }

        if (member.bannable) {
          try {
            await member.ban({ reason: 'Nuke Server' });
            successCount++;
            console.log(`  [+] Đã BAN: ${member.user.tag}`);
            await new Promise((resolve) => setTimeout(resolve, 400));
            continue;
          } catch (err) {
            console.log(`  [-] Không BAN được ${member.user.tag}, thử KICK...`);
          }
        }

        if (member.kickable) {
          try {
            await member.kick('Nuke Server');
            successCount++;
            console.log(`  [+] Đã KICK: ${member.user.tag}`);
            await new Promise((resolve) => setTimeout(resolve, 400));
          } catch (err) {
            failCount++;
            console.log(`  [-] Không KICK được ${member.user.tag}: ${err.message}`);
          }
        } else {
          failCount++;
        }
      }

      console.log(`\n=== HOÀN THÀNH TỔNG THỂ ===`);
      console.log(`- Đã Ban/Kick thành công: ${successCount} thành viên`);
      console.log(`- Thất bại / Thiếu quyền: ${failCount} thành viên`);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách thành viên:', error);
    }
  }

  // ----- LỆNH BAN ALL -----
  if (command === 'banall') {
    await message.delete().catch(() => {});
    console.log(' Bắt đầu quét và Ban tất cả thành viên trong server...');

    if (!message.guild) {
      console.log('[-] Lỗi: Lệnh này chỉ hoạt động trong Server.');
      return;
    }

    try {
      const members = await message.guild.members.fetch();
      let banned = 0;
      let failed = 0;

      for (const [id, member] of members) {
        if (member.id === client.user.id || member.id === message.guild.ownerId) {
          continue;
        }

        if (member.bannable) {
          try {
            await member.ban({ reason: 'Nuke Server' });
            banned++;
            console.log(`[+] Đã ban: ${member.user.tag}`);
            await new Promise((resolve) => setTimeout(resolve, 500));
          } catch (err) {
            failed++;
            console.log(`[-] Lỗi ban ${member.user.tag}: ${err.message}`);
          }
        } else {
          failed++;
        }
      }

      console.log(`\n=== HOÀN THÀNH BAN ALL ===`);
      console.log(`- Ban thành công: ${banned}`);
      console.log(`- Thất bại / Thiếu quyền: ${failed}`);
    } catch (error) {
      console.error('Lỗi khi tải danh sách thành viên:', error);
    }
  }
});

// ---------------- 5. XỬ LÝ LỖI & THOÁT HỆ THỐNG ----------------
client.on('error', (err) => {
  console.error('Lỗi client:', err.message);
});

process.exit = process.exit || function() {};

process.on('SIGINT', () => {
  client.destroy();
  process.exit(0);
});

// Đăng nhập bot
client.login(TOKEN).catch((err) => {
  console.error('Lỗi đăng nhập (Kiểm tra lại USER_TOKEN trong file .env):', err.message);
  process.exit(1);
});
