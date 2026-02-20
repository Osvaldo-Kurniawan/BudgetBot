# 📱 BudgetBot

BudgetBot adalah WhatsApp bot untuk manajemen pengeluaran harian dengan AI, income bulanan, dan target tabungan berbasis Google Spreadsheet.

## 🎯 Fitur Utama

- ✅ Catat pengeluaran via chat WhatsApp
- 📅 Ringkasan pengeluaran (harian/range/tanggal spesifik)
- 💰 Income bulanan + hitung otomatis pengeluaran maksimal harian
- ⚠️ Peringatan jika pengeluaran harian melebihi batas
- 📂 Hapus pengeluaran via reply nomor urut
- 📊 Progress tabungan & tracking
- 📱 Auto-reconnect & error handling
- 🔔 Daily reminder otomatis

## 📂 Struktur Proyek (Refactored)

```
budgetbot/
├── src/
│   ├── config/
│   │   └── constants.js        # Commands, messages, settings
│   ├── services/
│   │   ├── spreadsheetService.js   # Google Sheets logic
│   │   ├── whatsappService.js      # Message handlers
│   │   └── broadcastService.js     # Daily reminder
│   ├── commands/
│   │   ├── help.js
│   │   ├── ringkasan.js
│   │   ├── addTransaction.js
│   │   ├── deleteTransaction.js
│   │   ├── income.js
│   │   └── ping.js
│   ├── utils/
│   │   ├── errorHandler.js
│   │   ├── validators.js
│   │   └── logger.js
│   └── bot.js                  # Bot initialization
├── index.js                    # Entry point
├── googleSheet.js              # Legacy (deprecated)
├── service_account.json        # Google credentials (git ignored)
├── .env.example                # Environment template
├── .gitignore                  # Git ignore rules
└── package.json
```

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/Osvaldo-Kurniawan/BudgetBot.git
cd budgetbot
npm install
```

### 2. Setup Credentials

**A) Google Service Account**
- Buat project di [Google Cloud Console](https://console.cloud.google.com/)
- Buat service account & download JSON key
- Rename ke `service_account.json` (git ignored)

**B) Setup Google Spreadsheet**
- Buat spreadsheet baru
- Share dengan email service account
- Buat 2 sheets:
  - **Transaksi**: ID | Timestamp | User | Kategori | Nominal | Deskripsi
  - **Income**: User | BulanAwal | IncomeBulan | TargetTabungan | MaxHarian

### 3. Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:
```
GOOGLE_SHEET_ID=your_spreadsheet_id
```

### 4. Run Bot

```bash
npm start
```

Scan QR code → Bot connected ✅

## 📖 Commands

| Command | Format | Contoh |
|---------|--------|--------|
| **Tambah Pengeluaran** | `+<kategori> <nominal> <deskripsi>` | `+ngopi 15000 kopi susu` |
| **Ringkasan** | `ringkasan [hari\|tanggal]` | `ringkasan 3` atau `ringkasan 05-06` |
| **Hapus** | `hapus pengeluaran [tanggal]` | `hapus pengeluaran 05-06` |
| **Set Income** | `set income <amount> tabungan <target>` | `set income 5000000 tabungan 1500000` |
| **Progress** | `progress tabungan` | Cek pencapaian target |
| **Help** | `help` / `?` / `menu` | Tampilkan panduan |
| **Ping** | `!ping` | Check bot status |

## 🛠️ Development

### Architecture

```
index.js (entry)
    ↓
src/bot.js (init)
    ↓
├── src/services/whatsappService.js (message router)
│   ├── src/commands/* (command handlers)
│   ├── src/services/spreadsheetService.js (Google Sheets)
│   ├── src/utils/* (helpers)
│   └── src/config/constants.js (config)
└── src/services/broadcastService.js (scheduler)
```

### Adding New Command

1. Create file `src/commands/mycommand.js`:
```javascript
const handleMyCommand = async (sock, sender) => {
  await sock.sendMessage(sender, { text: "Hello!" });
};
module.exports = { handleMyCommand };
```

2. Register in `src/services/whatsappService.js`:
```javascript
else if (text.toLowerCase() === "mycommand") {
  await handleMyCommand(sock, sender);
}
```

3. Add to `src/config/constants.js`:
```javascript
COMMANDS: {
  MY_COMMAND: "mycommand",
}
```

## 📦 Dependencies

- **baileys** - WhatsApp Web Automation
- **google-spreadsheet** - Google Sheets API
- **dayjs** - Date manipulation
- **node-schedule** - Cron jobs
- **dotenv** - Environment loading
- **axios** - HTTP requests
- **pino** - Logging

## 🔐 Security

✅ **Good Practices:**
- Service account credentials in `.env` (never commit)
- `.gitignore` protects sensitive files
- Error handling prevents info leaks
- No hardcoded secrets

⚠️ **Important:**
- Keep `service_account.json` safe
- Don't share `.env` files
- Monitor WhatsApp for suspicious activity

## 🐛 Troubleshooting

### Bot logout
```bash
rm -rf auth/
npm start
```
Then scan QR again.

### Sheet not found
Ensure both sheets exist:
- "Transaksi" & "Income"

Check console for exact error message.

### Connection timeout
- Check internet connection
- Increase timeout in constants
- Run behind VPN if WhatsApp blocks

## 📝 Develop & Deploy

### Local Development
```bash
npm start    # Run locally
```

## 📄 License

MIT - Feel free to use & modify

---

**Made with ❤️ for expense tracking**
