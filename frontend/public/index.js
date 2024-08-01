// eslint-disable-next-line no-unused-vars
const triangleArea = (a, b, c) => {
  if (typeof a !== "number" || typeof b !== "number" || typeof c !== "number") {
    return "边长必须为数字";
  }
  if (a <= 0 || b <= 0 || c <= 0) {
    return "边长必须大于0";
  }
  let s = (a + b + c) / 2;
  let area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
  if (isNaN(area)) {
    return "三角形不存在";
  }
  return area;
}
