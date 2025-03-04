import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import express from 'express';
import { connection } from './onWork.js';
import { Queue } from 'bullmq';

// Bull Board 설정
const app = express();
const serverAdapter = new ExpressAdapter();
createBullBoard({
  queues: [new Queue('navigationQueue', { connection: connection })],
  serverAdapter,
});

serverAdapter.setBasePath('/bull-board');
app.use('/bull-board', serverAdapter.getRouter());

app.listen(3000, () => {
  console.log('Bull Board running on http://localhost:3000/bull-board');
});
