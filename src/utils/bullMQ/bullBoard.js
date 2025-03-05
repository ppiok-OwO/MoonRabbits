import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import express from 'express';
import { navigationQueue } from '../../handlers/town/playerMove.handler.js';

// Bull Board 설정
const app = express();
const serverAdapter = new ExpressAdapter();

createBullBoard({
  queues: [navigationQueue],
  serverAdapter,
});

serverAdapter.setBasePath('/bull-board');
app.use('/bull-board', serverAdapter.getRouter());

app.listen(5000, () => {
  console.log('Bull Board running on http://localhost:5000/bull-board');
});

export default BullBoard;
