export const onError = (socket) => (err) => {
  console.error('소켓 오류:', err);
  // 클라이언트 오류시 로직 추가.
};
