# 🚂 Railway Setup Checklist

## ⚠️ IMPORTANT: Sebelum Deploy!

Railway **tidak bisa** auto-load env vars dari file. Kamu HARUS set manual di Railway Dashboard.

---

## ✅ Step-by-Step Setup

### 1. Deploy ke Railway
```bash
git push origin main
# atau navigate ke https://railway.app → Deploy from GitHub
```

### 2. Buka Railway Dashboard
https://railway.app → Dashboard → Your Project → Budgetbot

### 3. Go to **Variables** Tab

Klik **+ New Variable** dan copy-paste INI SEMUA dari `.env` file kamu:

```
GOOGLE_SHEET_ID = 1xUf9bMurm0XvvlV__eMwbrfBK_AC_eQ6Fd2UfU-SrAU

GOOGLE_SERVICE_ACCOUNT_TYPE = service_account

GOOGLE_SERVICE_ACCOUNT_PROJECT_ID = budget-bot-488011

GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID = a8454c13c8b5cf53279996481bcaa6d3a483f6f4

GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY = [COPY FULL PRIVATE KEY FROM .env]

GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL = budget-bot@budget-bot-488011.iam.gserviceaccount.com

GOOGLE_SERVICE_ACCOUNT_CLIENT_ID = 110534002297029486313

GOOGLE_SERVICE_ACCOUNT_AUTH_URI = https://accounts.google.com/o/oauth2/auth

GOOGLE_SERVICE_ACCOUNT_TOKEN_URI = https://oauth2.googleapis.com/token

GOOGLE_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL = https://www.googleapis.com/oauth2/v1/certs

GOOGLE_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL = https://www.googleapis.com/robot/v1/metadata/x509/budget-bot%40budget-bot-488011.iam.gserviceaccount.com

GOOGLE_SERVICE_ACCOUNT_UNIVERSE_DOMAIN = googleapis.com
```

### 4. Redeploy atau Restart
After setting variables:
- Click **Redeploy** button, atau
- Bot akan auto-restart dalam ~5 menit

### 5. Check Logs
Go to **Logs** tab → lihat apakah ada error

```
✅ Connected to WhatsApp
✅ Bot initialized successfully
```

---

## 🐛 Troubleshooting

| Error | Solusi |
|-------|--------|
| `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY is not set` | Set variable di Railway Dashboard |
| `Cannot find module 'service_account.json'` | Sudah difix, file tidak diperlukan lagi |
| Bot tidak respond ke WA | Check logs di Railway dashboard |
| Build failed | Cek `.env` format - private key harus dengan `\n` |

---

## 🔑 Private Key Format

Pastikan private key format correct:

❌ SALAH (dengan `\\n`):
```
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\\nMII...\\n-----END PRIVATE KEY-----\\n
```

✅ BENAR (dengan `\n` atau real newlines):
```
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----
MII...
-----END PRIVATE KEY-----
```

**TIP:** Copy-paste langsung dari `.env` file, Railway akan handle format autonya!

---

## ✨ Selesai!

Kalau semua sudah set dengan benar, bot akan:
1. ✅ Connect ke WhatsApp
2. ✅ Load credentials dari Railway variables
3. ✅ Broadcast reminder setiap hari jam 15:00 UTC
4. ✅ Reply ke pesan user

---

**Need help?** Check Railway docs: https://docs.railway.app/guides/environment-variables
