# 🚀 Railway Deployment Guide

Semua config sudah siap! Sekarang tinggal final steps:

## ⚡ Quick Deploy (5 menit)

### Option 1: Via Web UI (Paling Mudah) ✨

1. **Buka**: https://railway.app
2. **Sign Up** dengan GitHub account kamu
3. **New Project** → **Deploy from GitHub**
4. **Connect GitHub** → Pilih repo `Budgetbot`
5. **Authorize** Railway untuk akses repo
6. Railway akan auto-detect `Procfile` dan deploy!
7. Tunggu ~2 menit build complete

### ⚙️ PENTING: Set Environment Variables

Setelah deploy, go to Railway dashboard → **Variables tab** dan set semua ini:

**Copy dari `.env` file kamu langsung paste ke Railway Variables:**
- `GOOGLE_SHEET_ID`
- `GOOGLE_SERVICE_ACCOUNT_TYPE`
- `GOOGLE_SERVICE_ACCOUNT_PROJECT_ID`
- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID`
- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` (⚠️ include `\n` untuk newlines)
- `GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL`
- `GOOGLE_SERVICE_ACCOUNT_CLIENT_ID`
- `GOOGLE_SERVICE_ACCOUNT_AUTH_URI`
- `GOOGLE_SERVICE_ACCOUNT_TOKEN_URI`
- `GOOGLE_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL`
- `GOOGLE_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL`
- `GOOGLE_SERVICE_ACCOUNT_UNIVERSE_DOMAIN`

Setelah set variables, **Redeploy** atau bot akan auto-restart.

---

### Option 2: Via CLI (Untuk PowerUser) 🔧

```bash
# Step 1: Run setup script
./setup-railway.sh

# Step 2: Ikuti login prompt (browser akan terbuka)
# - Login dengan GitHub
# - Pilih "Create new project"
# - Kasih nama: budgetbot

# Step 3: Deploy!
railway up

# Step 4: Set variables
railway variables
# Paste semua vars dari .env
```

---

## ✅ Files Ready for Deployment

```
✓ Procfile              - Start command (Railway auto-detects this)
✓ package.json          - Dependencies
✓ .env                  - Local backup (NOT committed)
✓ .gitignore            - Secure (credentials tidak dicommit)
```

**Railway auto-detects Node.js + uses Procfile → No need for complex config files!**

---

## 🎯 Setelah Deploy

1. **Dapat URL Bot**: Railway kasih public URL
2. **Check Logs**: 
   ```
   railway logs
   ```
3. **Monitor Status**: https://railway.app/dashboard
4. **Restart Bot**: 
   ```
   railway restart
   ```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Build failed | Cek: `railway logs` |
| Bot not responding | Verify `.env` di Railway dashboard |
| Permission denied | Ensure `railway.toml` format correct |
| Private key error | Check: `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` format |

---

## 📞 Next Steps

- Monitor bot di: `railway status`
- View logs: `railway logs --follow`
- Stop bot: `railway stop`
- View project: `railway open`

**Any issues?** Check Railway docs: https://docs.railway.app
