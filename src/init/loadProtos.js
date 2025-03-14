import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import protobuf from 'protobufjs';
import { packetNames } from '../protobuf/packetNames.js';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
const protoDir = path.join(__dirname, '../protobuf');

// 주어진 디렉토리 내 모든 proto 파일을 재귀적으로 찾는 함수
const getAllProtoFiles = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllProtoFiles(filePath, fileList);
    } else if (path.extname(file) === '.proto') {
      fileList.push(filePath);
    }
  });

  return fileList;
};

// 모든 proto 파일 경로를 가져옴
const protoFiles = getAllProtoFiles(protoDir);

// 로드된 프로토 메시지들을 저장할 객체
const protoMessages = {};

// protobuf 최상위 객체
const root = new protobuf.Root();

export const loadProtos = async () => {
  try {
    // 비동기 병렬 처리로 프로토 파일 로드
    await Promise.all(protoFiles.map((file) => root.load(file)));

    for (let type of packetNames) {
      protoMessages[type] = root.lookupType(type);
    }

    console.log('Protobuf 파일이 로드되었습니다.');
    console.log(Object.keys(protoMessages));
  } catch (error) {
    console.error('Protobuf 파일 로드 중 오류가 발생했습니다: ', error);
  }
};

// 로드된 프로토 메시지들의 얕은 복사본을 반환합니다.
export const getProtoMessages = () => {
  return { ...protoMessages };
};
