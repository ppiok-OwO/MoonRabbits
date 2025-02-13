import {
  EC2Client,
  DescribeInstancesCommand,
  StartInstancesCommand,
  StopInstancesCommand,
  RunInstancesCommand,
  TerminateInstancesCommand,
} from '@aws-sdk/client-ec2';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from '../../config/config.js';
import { ec2Types } from './ec2Info.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const townUserDataScript = fs.readFileSync(path.join(__dirname, "town-user-data.sh"), "utf8");
const townUserDataBase64 = Buffer.from(townUserDataScript).toString("base64");

const ec2Client = new EC2Client({
  region: 'ap-northeast-2',
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

// EC2 인스턴스 데이터 *ip는 동적 할당(계속 바뀜)

export const AWS = {
  // #DESCRIBE
  describeInstances: () => {
    const describe = new DescribeInstancesCommand({});
    ec2Client.send(describe).then(
      (data) => {
        let log = `EC2 인스턴스 : \n`;
        data.Reservations.forEach((resv) =>
          resv.Instances.forEach((instance) => {
            log += `{\n  InstanceId: ${instance.InstanceId}`;
            log += `\n  State: ${instance.State.Name}`;
            log += `\n  PublicIpAddress: ${instance.PublicIpAddress}`;
            log += `\n  ImageId: ${instance.ImageId}`;
            log += `\n  AvailabilityZone:  ${instance.Placement.AvailabilityZone}`;
            log += `\n}\n`;
          }),
        );
        console.log(log);
      },
      (error) => {
        console.log('EC2 인스턴스 조회 실패', error);
      },
    );
  },

  // #START
  startInstances: (instanceId) => {
    const start = new StartInstancesCommand({ InstanceIds: [instanceId] });
    ec2Client.send(start).then(
      () => console.log('인스턴스 실행'),
      (error) => console.log('인스턴스 실행 실패', error),
    );
  },

  // #STOP
  stopInstances: (instanceId) => {
    const stop = new StopInstancesCommand({ InstanceIds: [instanceId] });
    ec2Client.send(stop).then(
      () => console.log('인스턴스 중지'),
      (error) => console.log('인스턴스 중지 실패', error),
    );
  },

  // #RUN
  runInstances: (type) => {
    //const userDataBase64 = type===ec2Types.town?townUserDataBase64:null;
    const userDataBase64 = townUserDataBase64;
    const run = new RunInstancesCommand({
      ImageId: 'ami-024ea438ab0376a47', // AMI ID
      InstanceType: 't2.micro',
      MinCount: 1,
      MaxCount: 1,
      KeyName: config.aws.keyName,
      SecurityGroupIds: [config.aws.securityGroupId],   // inbound TCP:3000 0.0.0.0/0
      UserData: userDataBase64,
    });
    ec2Client.send(run).then(
      (data) => {
        // #ADD 새로 생성된 EC2 instance의 id를 어떻게 관리할 것인가?
        const instanceId = data.Instances[0].InstanceId;
        const state = data.Instances[0].State.Name;
        const publicDnsName = data.Instances[0].PublicDnsName;
        //ec2Instances.set('테스트서버', { instanceId, state, publicIpAddress });
        setupInstance(publicDnsName);
        console.log('인스턴스 시작');
        console.log(`instanceId: ${instanceId}`)
      },
      (error) => console.log('인스턴스 시작 실패', error),
    );
  },

  // #TERMINATE
  terminateInstances: (instanceId) => {
    const terminate = new TerminateInstancesCommand({
      InstanceIds: [instanceId],
    });
    ec2Client.send(terminate).then(
      () => console.log('인스턴스 종료'),
      (error) => console.log('인스턴스 종료 실패', error),
    );
  },

  // #GET IP
};

function setupInstance(host) {}

//AWS.runInstances(2);
//AWS.describeInstances();