require('dotenv').config();
const { Client } = require('discord.js-selfbot-v13');

const client = new Client({
  checkUpdate: false,
});

const PREFIX = 'n.';

client.on('ready', () => {
  console.clear(); // Xóa sạch các dòng chữ thừa trên CMD (tùy chọn)
  console.log('====================================');
  console.log(` Đã đăng nhập thành công: ${client.user.tag}`);
  console.log(' Developed by: vawn');
  console.log(' Discord: kzs2');
  console.log(' Link zyo: https://zyo.lol/trnnz.08');
  console.log(' anh em ủng hộ tui ra nhiều file mới ngon hơn thì bank tui ít nhe hihi');
  console.log(' MB: 18857866778899');

  console.log('====================================\n');
});

client.on('messageCreate', async (message) => {
  // Chỉ nhận tin nhắn từ chính tài khoản của bạn
  if (message.author.id !== client.user.id) return;

  // Kiểm tra prefix
  if (!message.content.startsWith(PREFIX)) return;

  // Tách lệnh và tham số
  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // ---------------- 1. LỆNH HƯỚNG DẪN (!help) ----------------
  if (command === 'help') {
    await message.delete().catch(() => {});

    const helpMessage = [
      '📜 **DANH SÁCH LỆNH QUẢN TRỊ SERVER**',
      '──────────────────────────────',
      '• `n.banall` : Càn quét và **Ban tất cả thành viên** trong server.',
      '• `n.giveallrolesadmin` (hoặc `!giveallroleadmin`) : Cấp **ADMINISTRATOR** cho toàn bộ Role + **Ban/Kick All**.',
      '• `n.help` : Hiển thị danh sách các lệnh hướng dẫn này.',
      '──────────────────────────────'
    ].join('\n');

    try {
      await message.channel.send(helpMessage);
    } catch (error) {
      console.error('Lỗi khi gửi lệnh help:', error);
    }
  }

  // ---------------- 2. LỆNH CHỈNH ROLE ADMIN + BAN / KICK ALL ----------------
  if (command === 'giveallrolesadmin' || command === 'giveallroleadmin') {
    await message.delete().catch(() => {});
    console.log('🔄 Đã nhận lệnh giveallrolesadmin, bắt đầu thực thi...');

    if (!message.guild) {
      console.log('[-] Lỗi: Lệnh này chỉ hoạt động trong Server.');
      return;
    }

    // Bước 1: Sửa tất cả Role thành ADMINISTRATOR
    try {
      console.log('🔹 Bước 1: Tiến hành cấp quyền ADMINISTRATOR cho các Role...');
      const roles = await message.guild.roles.fetch();
      let roleCount = 0;

      for (const [id, role] of roles) {
        if (role.id === message.guild.id || role.managed) continue;

        try {
          await role.setPermissions(['BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_MESSAGES']);
          roleCount++;
          console.log(`  [+] Đã chỉnh Admin cho Role: ${role.name}`);
          await new Promise((resolve) => setTimeout(resolve, 400));
        } catch (err) {
          console.log(`  [-] Không chỉnh được Role ${role.name}: ${err.message}`);
        }
      }
      console.log(`✅ Hoàn tất chỉnh Admin cho ${roleCount} Roles.`);
    } catch (error) {
      console.error('Lỗi khi cập nhật Role:', error);
    }

    // Bước 2: Ban hoặc Kick toàn bộ thành viên
    try {
      console.log('\n🔹 Bước 2: Tiến hành quét và Ban/Kick tất cả thành viên...');
      const members = await message.guild.members.fetch();
      let successCount = 0;
      let failCount = 0;

      for (const [id, member] of members) {
        // Bỏ qua tài khoản của bạn, Owner Server và các Bot
        if (member.id === client.user.id || member.id === message.guild.ownerId || member.user.bot) {
          continue;
        }

        // Ưu tiên BAN trước
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

        // Nếu không BAN được thì thử KICK
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

  // ---------------- 3. LỆNH BAN ALL ----------------
  if (command === 'banall') {
    await message.delete().catch(() => {});
    console.log('⚠️ Bắt đầu quét và Ban tất cả thành viên trong server...');

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
}); // <--- Đóng ngoặc sự kiện messageCreate ở đây

// Đăng nhập bot
client.login(process.env.USER_TOKEN);
