class PathValidator {
  static async validatePosition(path, transform) {
    if (!path || path.length === 0) return null;

    // path를 청크로 나누기
    const chunks = this.dividePathIntoChunks(path);

    const results = await Promise.all(
      chunks.map((chunk) => this.processChunk(chunk, transform)),
    );

    // 가장 가까운 포인트 찾기
    return results.reduce((closest, current) => {
      if (!closest || current.distance < closest.distance) {
        return current;
      }
      return closest;
    }, null);
  }

  static dividePathIntoChunks(path, chunkSize = 100) {
    const chunks = [];
    for (let i = 0; i < path.length; i += chunkSize) {
      chunks.push(path.slice(i, i + chunkSize));
    }
    return chunks;
  }

  static processChunk(pathChunk, transform) {
    let minDistance = Infinity;
    let closestPoint = null;

    for (const point of pathChunk) {
      const distance = this.calculateDistance(point, transform);
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = { PosX: point.x, PosY: point.y, PosZ: point.z };
      }
    }

    return { distance: minDistance, point: closestPoint };
  }

  static calculateDistance(point, transform) {
    const dx = point.x - transform.posX;
    const dy = point.y - transform.posY;
    const dz = point.z - transform.posZ;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
}

export default PathValidator;
