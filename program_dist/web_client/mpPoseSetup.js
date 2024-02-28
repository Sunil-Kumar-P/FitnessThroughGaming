export class PoseDetector {
  constructor() {
    this.results;
    this.pose = new mediapipe.Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });
    this.pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
  }
  onResults() {
    try {
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );
      if (results.poseLandmarks) {
        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 5,
        });
        drawLandmarks(canvasCtx, results.poseLandmarks, {
          color: "#FF0000",
          lineWidth: 2,
        });
        this.results = this.results;
      }
      canvasCtx.restore();
    } catch (error) {
      console.log("error", error);
    }
  }
  findPose() {
    this.pose.onResults(onResults);
    return img;
  }
  
  getPosition() {
    this.lmList = [];
    if (this.results.poseLandmarks) {
      for (let id in this.results.poseLandmarks.landmark) {
        const lm = this.results.poseLandmarks.landmark[id];
        const [x, y] = [lm.x * img.cols, lm.y * img.rows];
        this.lmList.push([id, x, y]);
        if (draw) {
          cv.circle(img, new cv.Point(x, y), 5, new cv.Vec(0, 255, 0), cv.FILLED);
        }
      }
    }
    return this.lmList;
  }

  findDistance(p1, p2, img = null, color = [255, 0, 255], scale = 5) {
    const [x1, y1] = p1;
    const [x2, y2] = p2;
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2;
    const length = Math.hypot(x2 - x1, y2 - y1);
    const info = [x1, y1, x2, y2, cx, cy];

    if (img) {
      cv.circle(img, new cv.Point(x1, y1), 10, color, cv.FILLED);
      cv.circle(img, new cv.Point(x2, y2), 10, color, cv.FILLED);
      cv.line(img, new cv.Point(x1, y1), new cv.Point(x2, y2), color, Math.max(1, scale / 3));
      cv.circle(img, new cv.Point(cx, cy), 10, color, cv.FILLED);
    }

    return [length, info, img];
  }

  findAngle(img, p1, p2, p3, draw = true) {
    const [x1, y1] = this.lmList[p1].slice(1);
    const [x2, y2] = this.lmList[p2].slice(1);
    const [x3, y3] = this.lmList[p3].slice(1);

    // Calculate the angle
    const dx1 = x2 - x1;
    const dy1 = y2 - y1;
    const dx2 = x3 - x1;
    const dy2 = y3 - y1;
    const dotProduct = dx1 * dx2 + dy1 * dy2;
    const magnitude1 = Math.hypot(dx1, dy1);
    const magnitude2 = Math.hypot(dx2, dy2);
    const angle = Math.degrees(Math.acos(dotProduct / (magnitude1 * magnitude2)));
    if (angle < 0) {
      angle = angle + 360;
    }
    if (draw) {
      cv.line(img, new cv.Point(x1, y1), new cv.Point(x2, y2), [255, 255, 255], 3);
      cv.line(img, new cv.Point(x3, y3), new cv.Point(x2, y2), [255, 255, 255], 3);
      cv.circle(img, new cv.Point(x1, y1), 5, [255, 0, 0, 255], cv.FILLED);
      cv.circle(img, new cv.Point(x1, y1), 5, [255, 0, 0, 255], cv.FILLED, cv.LINE_AA);
      cv.circle(img, new cv.Point(x2, y2), 5, [255, 0, 0, 255], cv.FILLED);
      cv.circle(img, new cv.Point(x2, y2), 5, [255, 0, 0, 255], cv.FILLED, cv.LINE_AA);
      cv.circle(img, new cv.Point(x3, y3), 5, [255, 0, 0, 255], cv.FILLED);
      cv.circle(img, new cv.Point(x3, y3), 5, [255, 0, 0, 255], cv.FILLED, cv.LINE_AA);
      const text = `${Math.round(angle)}°`;
      cv.putText(img, text, new cv.Point(x2 - 20, y2 + 50), cv.FONT_HERSHEY_PLAIN, 2, [255, 0, 255, 255], 2, cv.LINE_AA);
    }
    return angle;
  }
}