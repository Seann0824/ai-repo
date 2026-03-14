#!/bin/bash
# 读取 GH_TOKEN 并登录 GitHub

if [ -z "$GH_TOKEN" ]; then
    echo "Error: GH_TOKEN not set"
    exit 1
fi

echo "$GH_TOKEN" | gh auth login --with-token
gh auth status
