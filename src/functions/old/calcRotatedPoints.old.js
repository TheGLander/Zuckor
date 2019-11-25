
/**
 * Rotate points and return them
 * @param points the points.
 * @param degree the degree to rotate the points
 * @return the sprites points.
 *
 * 
*/
export default function calcRotatedPoints(points, degree) {
  function getRotatedX(x, y, degree) {
    degree = rad(degree)
    return (x * Math.cos(degree)) - (y * Math.sin(degree))
  }

  function getRotatedY(x, y, degree) {
    degree = rad(degree)
    return (y * Math.cos(degree)) + (x * Math.sin(degree))
  }
  for (let i in points)
    points[i] = {
      x: getRotatedX(points[i].x, points[i].y, degree),
      y: getRotatedY(points[i].x / 2, points[i].y, degree)
    }
  return points
}