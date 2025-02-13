#!/bin/bash

# nodejs 설치
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# pm2 설치
sodo -s
npm install pm2 -g

# 프로젝트 설치
cd /home/ubuntu
git clone -b ft/kdw-aws https://github.com/ppiok-OwO/MoonRabbits.git
cd MoonRabbits
npm install

nano ~/<project-directory>/.env

# pm2로 프로젝트 실행
pm2 start src/server.js
