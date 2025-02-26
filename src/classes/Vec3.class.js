class Vec3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  //백터길이
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  //정규화
  normalize() {
    const len = this.length();
    if (len > 0) {
      return new Vec3(this.x / len, this.y / len, this.z / len);
    }
    return new Vec3();
  }
}

export default Vec3;
