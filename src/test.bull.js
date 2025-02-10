import Queue from 'bull';
import Bull from 'bull';

// ioredis도 설치해야하나...? 자체 지원한대

// 첫 번째 인자 :queueName [string]
// 두 번째 인자 : opts?: Queue.QueueOptions): Queue.Queue<any> (+1 overload)
const testQueue = new Queue('QUEUE_TEST');
// 둘이 완전 똑같은 모양인디
const testBull = new Bull('BULL_TEST');
// 레디스 연결 하기 (위에 애들은 default로 "localhost:6379" 경로와 연결 시도함)
const redisQueue = new Queue('queueName', {
  redis: { port: 6379, host: '127.0.0.1', password: 'foobared' },
});

// [job] job.data는 job이 생성될 때 넣어준 데이터
// job.id는 job들을 구분하기 위한 식별자
testQueue.process((job, done) => {
  job.progress(); // 작업 진행시킴 (인자는 뭐고 반환은 뭐하지?)

  done(error, value);
});
