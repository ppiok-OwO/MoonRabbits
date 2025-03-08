import handleError from '../utils/error/errorHandler.js';

export const onError = (socket) => (err) => {
  handleError(socket, err);
  // 클라이언트 오류시 로직 추가.
};
