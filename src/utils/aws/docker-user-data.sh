#!/bin/bash

# nodejs 설치
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Docker 설치
sudo apt-get install -y docker.io

# Docker 시작
sudo systemctl start docker
sudo systemctl enable docker

# ECR 인증
AWS_REGION = "ap-northeast-2"
REPO_URL = ""
aws ecr get-login-password --region ${AWS_REGION} | sudo docker login --username AWS --password-stdin ${REPO_URL}

# Docker 이미지 다운
sudo docker pull dkcp/dw_ubuntu:my-docker

# Docker 컨테이너 실행
docker run -d --name my-container -p ${PORT}:3000 dkcp/dw_ubuntu:my_docker
