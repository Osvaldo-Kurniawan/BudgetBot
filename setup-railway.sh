#!/bin/bash

echo "🚀 Railway Setup untuk Budgetbot"
echo "================================"
echo ""
echo "Step 1: Logging in ke Railway..."
echo "⚠️  Browser akan terbuka untuk login"
sleep 2
railway login

echo ""
echo "Step 2: Initialize project..."
railway init

echo ""
echo "✅ Setup selesai! Sekarang deploy:"
echo "   railway up"
