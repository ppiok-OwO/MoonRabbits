import {
  EC2Client,
  DescribeInstancesCommand,
  StartInstancesCommand,
  StopInstancesCommand,
  RunInstancesCommand,
  TerminateInstancesCommand,
} from '@aws-sdk/client-ec2';
import { config } from '../../config/config.js';

const ec2Client = new EC2Client({
  region: 'ap-northeast-2',
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

// EC2 인스턴스 데이터 *ip는 동적 할당(계속 바뀜)
const ec2Instances = new Map([
  [
    'main',
    { id: 'i-0641db6963ce49246', state: 'running', ip: '54.180.108.151' },
  ],
]);

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
  runInstances: () => {
    const run = new RunInstancesCommand({
      ImageId: 'ami-0dc44556af6f78a7b', // AMI ID
      InstanceType: 't2.micro',
      MinCount: 1,
      MaxCount: 1,
    });
    ec2Client.send(run).then(
      (data) => {
        console.log('인스턴스 시작');
        // #ADD 새로 생성된 EC2 instance의 id를 어떻게 관리할 것인가?
        const instanceId = data.Instances[0].InstanceId;
        const state = data.Instances[0].State.Name;
        const publicIpAddress = data.Instances[0].PublicIpAddress;
        const publicDnsName = data.Instances[0].PublicDnsName;
        ec2Instances.set('테스트서버', { instanceId, state, publicIpAddress });
        //
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
};

function setupInstance(host) {}
