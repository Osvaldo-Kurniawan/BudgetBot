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

**Environment Variables (Auto-loaded dari `railway.toml`):**
- Semua sudah tercetup di `railway.toml` ✓
- Railway akan auto-import saat deploy

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
```

---

## ✅ Files Ready for Deployment

```
✓ Procfile              - Start command
✓ railway.json          - Railway config  
✓ railway.toml          - Environment variables
✓ package.json          - Dependencies
✓ .env                  - Local backup (NOT committed)
✓ .gitignore            - Secure config (Procfile protected)
```

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
