const ec2Infos = new Map();

export const ec2Types = {
    main: 'main',
    town: 'town',
    dungeon: 'dungeon',
}

export function initEc2Infos() {
  const mainEc2Info = {
    ip: '54.180.108.151',
    type: ec2Types.main,
    clientPort: 3000,
    count: 0,
  };
  ec2Infos.clear();
  ec2Infos.set('i-0641db6963ce49246', mainEc2Info);
  const initIp = '';
  updateIp('i-0641db6963ce49246', initIp);
}

export function addEc2Info(id, ip, clientPort) {
  const instanceInfo = { ip, clientPort, count: 0 };
  ec2Infos.set(id, instanceInfo);
  return [id, instanceInfo];
}

export function removeEc2Info(id) {
  ec2Infos.delete(id);
}

export function getEc2Info(id) {
  return ec2Infos.get(id);
}

export function getEc2Infos() {
  return ec2Infos;
}

export function printEc2Infos() {
  console.log(ec2Infos);
  console.log(
    `|${'instanceId'.padEnd(20, ' ')}|${'ipAddress'.padEnd(16, ' ')}|${'type'.padEnd(8, ' ')}|${'port'.padEnd(6, ' ')}|${'count'.padEnd(6, ' ')}|`,
  );
  ec2Infos.forEach((info, name) => {
    console.log(
      `|${name.padEnd(20, ' ')}|${info.ip.padEnd(16, ' ')}|${info.type.padEnd(8, ' ')}|${info.clientPort.toString().padEnd(6, ' ')}|${info.count.toString().padEnd(6, ' ')}|`,
    );
  });
}

// 동적할당 ip 갱신 여부 확인 (기존 켜져있는 서버만 확인하면 됨)
export function updateIp(id, ip) {
    const ec2Info = getEc2Info(id);
    if(ec2Info.ip !== ip){
      ec2Info.ip = ip;
        ec2Infos.set(id, ec2Info);
    }
}