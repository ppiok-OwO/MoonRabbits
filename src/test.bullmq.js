import { Queue, Worker, QueueEvents } from 'bullmq';

// new Queue(queue_name, queue_options, connection)
// Redis 연결 정보 입력하지 않을 시 연결 시도할 default 주소는 "localhost:6379"
const queue = new Queue('TestQueue', {
  connection: {
    host: 'Write here Redis address',
    port: 'Write here port number of Redis address',
  },
});

/* 큐에 작업 추가하기 */
// add(job_name, data, job_options)
// 반환 값은 Promise 객체이므로 await 필요
queue.add('testJob', { test: 'I am A.' });
// delay option을 걸어 이 작업 처리 전에 최소 3초 대기하도록 설정
queue.add('testJob', { test: 'I am B, and the late bloomer' }, { delay: 3000 });
// remove option을 걸어 작업 완료 또는 실패 시 데이터를 제거하도록 설정
queue.add(
  'testJob',
  { test: 'I am C' },
  { removeOnComplete: { age: 600, count: 500 }, removeOnFail: 3000 },
  // [1] Object 형태의 옵션
  // age는 이벤트 발생 이후 보관할 시간, 초 단위(ms 아님, 예시 기준 10분)
  // count는 최대 보관 수, 예시 기준 완료된 작업을 500건까지는 큐에 보관, 초과될 때부터 제거
  // [2] Number 형태의 옵션
  // 1번 사례의 count와 동일한 최대 보관 수, 예시 기준 실패한 작업을 3000건까지는 보관
  // [3] Bool 형태의 옵션
  // 단순히 true면 삭제, false면 보관
);
// 이외에도 우선순위 priority, 입출력 방식 lifo or fifo 등의 다양한 옵션들 존재

/* 큐에 여러 작업 한 번에 추가하기 */
// addBulk([{job_name, data, job_options}, {job_name, data, job_options}, ...])
// 반환 값이 Promise 객체이므로 await 필요
// completed 또는 failed 이벤트만 가능하며, 전자일 경우 모든 작업이 큐에 추가되고, 후자일 경우 아무 작업도 추가되지 않음
queue.addBulk([
  { name: 'testJob', data: { test: 'I am D' } },
  { name: 'testJob', data: { test: 'I am E' } },
  { name: 'testJob', data: { test: 'I am F' } },
]);

/* 큐 접근 동시성 설정하기 */
// setGlobalConcurrency(concurrency_count)
// 반환 값이 Promise 객체이므로 await 필요
// 일꾼 한 명이 해당 큐에서 병렬로 처리할 수 있는 작업 개수를 설정
queue.setGlobalConcurrency(3); // 동시 처리 가능한 작업 개수는 3개
queue.getGlobalConcurrency(); // 설정된 동시성 수준 반환

/* 큐 비우기 */
// [1] waiting, completed, failed 상태인 작업 제거
// 인자로 bool 값을 받는데, true면 delayed 상태인 작업 중 not active인 녀석들도 제거
// false면 delayed 상태인 작업은 제거하지 않음
queue.drain(bool);
// [2] 특정 조건에 해당하는 작업 제거
// grace는 제거 유예 시간, ms 단위
// limit는 clean 1회 당 제거할 jobs 최대 개수
// type은 제거할 job의 상태, 'completed', 'failed', 'paused' 등등
queue.clean(grace, limit, type);
// [3] 모든 작업들과 큐 자체를 통채로 제거
queue.obliterate();

/* 큐에 접근할 일꾼 추가하기 */
// new Worker(worker_name, processor, worker_options, connection)
const worker = new Worker(
  'workerA',
  async (job) => {
    // job은 처리할 데이터의 값과 상태들을 관리하는 객체
    // name, data, opts 등의 프로퍼티
    // isActive, isCompleted, isFailed, isWaiting 등의 메서드
    if (job.name === 'testJob') await testProcess(job.data.test);
  },
  {
    connection: {
      host: 'Write here Redis address',
      port: 'Write here port number of Redis address',
    },
  },
);

worker.on('error', (err) => {
  console.error('This Job caught an error.', err);
});

// 처리하던 작업을 마친 후 일꾼을 종료 (성공하든 실패하든)
worker.close();

async function testProcess(data) {}

// new QueueEvents()
const queueEvents = new QueueEvents('TestQueue');

queueEvents.on('completed', ({ jobId, returnValue }, id) => {
  console.log('Test Job was completed.');
});

queueEvents.on('failed', ({ jobId, failedReason }, id) => {
  console.error('Test Job was failed', failedReason);
});
