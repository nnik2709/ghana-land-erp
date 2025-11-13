#!/bin/bash

echo "🔑 Setting up SSH for GitHub"
echo ""

# Check if SSH key exists
if [ -f ~/.ssh/id_ed25519.pub ]; then
    echo "✅ SSH key already exists"
    echo ""
    echo "📋 Your public key:"
    cat ~/.ssh/id_ed25519.pub
else
    echo "📝 Generating new SSH key..."
    ssh-keygen -t ed25519 -C "nnik2709@gmail.com" -f ~/.ssh/id_ed25519 -N ""
    echo ""
    echo "✅ SSH key generated"
    echo ""
    echo "📋 Your public key:"
    cat ~/.ssh/id_ed25519.pub
fi

echo ""
echo "📌 Next steps:"
echo "1. Copy the public key above"
echo "2. Go to: https://github.com/settings/ssh/new"
echo "3. Title: Ghana ERP Development"
echo "4. Paste the key and click 'Add SSH key'"
echo "5. Then run: ./push-with-ssh.sh"
