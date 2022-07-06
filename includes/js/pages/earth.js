const GeoGenTextures = {
  lookup: {},

  generateHash: (width, height, colors, iterations, flip) => {
    return `#{width}-${height}-${colors.join('-')}-${iterations}-${flip}`;
  },

  textureNest: ($, centerX, centerY, width, height, segmentIterations, textureIterations, colorPicker, [centerPoints, outerPoints], flip = false, useThreshold = false, originalRadius, originalX, originalY, pointsUp) => {
    const radius = Math.min(width, height) / 2;
    [[0, 0], ...centerPoints].map(([x, y]) => [x * (radius / 2) + centerX, y * (radius / 2) + centerY]).forEach(([x, y], i) => {
      const upsideDown = flip ? !!i : !i;
      if (segmentIterations) {
        GeoGenTextures.textureNest($, x, y, radius, radius, segmentIterations - 1, textureIterations, colorPicker, i ? [centerPoints, outerPoints] : [outerPoints, centerPoints], upsideDown, useThreshold, originalRadius, originalX, originalY, pointsUp);
      } else {
        const pX = x + -radius / 2;
        const pY = y + -radius / 2;
        let offset = Math.PI * 2 / 3 * 2;
        const points = (flip ? !i : !!i) ? GeoGenTextures.buildPoints(3, Math.PI * 1.5 + offset) : GeoGenTextures.buildPoints(3, Math.PI * 0.5 + offset);
        const resultPoints = points.map(([qX, qY]) => {
          return [
          x + qX * (radius / 2),
          y + qY * (radius / 2)];

        });
        const pointA = [pointsUp[0][0], pointsUp[0][1]];
        const pointB = [pointsUp[1][0], pointsUp[1][1]];
        const pointC = [pointsUp[2][0], pointsUp[2][1]];
        const totalArea = GeoGenTextures.measureArea(pointA, pointB, pointC);
        const colors = resultPoints.map(([asdfX, asdfY], jdfyas) => {
          const ajsdfuX = originalX - asdfX;
          const ajsdfuY = originalY - asdfY;
          const angular = Math.atan2(ajsdfuY, ajsdfuX) + Math.PI;
          const radial = Math.sqrt(ajsdfuX * ajsdfuX + ajsdfuY * ajsdfuY) / originalRadius;
          const pointD = [// barycentric interpolation
          Math.cos(angular) * radial,
          Math.sin(angular) * radial];

          let factors = [
          GeoGenTextures.measureArea(pointA, pointB, pointD) / totalArea,
          GeoGenTextures.measureArea(pointB, pointC, pointD) / totalArea];

          factors.push(1 - (factors[0] + factors[1]));
          return colorPicker(factors);
        });
        const textureEl = GeoGenTextures.createTile(width, height, colors.slice(0), textureIterations, upsideDown, useThreshold);
        $.drawImage(textureEl, 0, 0, width, height, pX, pY, radius, radius);
      }
    });
  },

  createNestedTile: (width, height, segmentIterations, textureIterations, colorPicker, useThreshold = false) => {
    const cacheEl = document.createElement('canvas');
    cacheEl.width = width;
    cacheEl.height = height;
    const $ = cacheEl.getContext('2d');
    const centerX = width / 2;
    const centerY = height / 2;
    const pointsUp = GeoGenTextures.buildPoints(3, Math.PI * 1.5);
    const pointsDown = GeoGenTextures.buildPoints(3, Math.PI * 0.5);
    const radius = Math.min(width, height) / 2;
    GeoGenTextures.textureNest($, centerX, centerY, width, height, segmentIterations, textureIterations, colorPicker, [pointsUp, pointsDown], false, useThreshold, radius, centerX, centerY, pointsUp);
    const canvasEl = document.createElement('canvas');
    canvasEl.width = width;
    canvasEl.height = height;
    const ctx = canvasEl.getContext('2d');
    const count = 6;
    Array(...Array(count)).map((_, j) => {
      [...pointsUp, ...pointsDown].forEach(([x, y]) => {
        const i = count - j;
        ctx.drawImage(cacheEl, 0, 0, width, height, x * (i + 1), y * (i + 1), width, height);
      });
    });
    ctx.drawImage(cacheEl, 0, 0, width, height, 0, 0, width, height);
    return canvasEl;
  },

  createTile: (width, height, colors, iterations, flip, useThreshold = false) => {
    const hash = GeoGenTextures.generateHash(width, height, colors, iterations, flip);
    if (!GeoGenTextures.lookup[hash]) {
      const canvasEl = document.createElement('canvas');
      canvasEl.width = width;
      canvasEl.height = height;
      const $ = canvasEl.getContext('2d');
      const centerX = width / 2;
      let centerY = height / 2;
      let radius = Math.min(width, height) / 2;
      const pointsUp = GeoGenTextures.buildPoints(3, Math.PI * 1.5);
      const pointsDown = GeoGenTextures.buildPoints(3, Math.PI * 0.5);
      const colorPoints = (flip ? pointsDown : pointsUp).map(([x, y], icu81mi) => {
        return {
          color: colors[icu81mi],
          x: x * radius + centerX,
          y: y * radius + centerY };

      });
      const colorPicker = GeoGenTextures.calculateColor(colorPoints, useThreshold);
      let points = [pointsDown, pointsUp];
      if (flip) {
        points = [pointsUp, pointsDown];
      }
      GeoGenTextures.triangleNest($, centerX, centerY, radius, points, colorPicker, iterations);
      GeoGenTextures.lookup[hash] = canvasEl;
    }
    return GeoGenTextures.lookup[hash];
  },

  calculateColor: (colorPoints, useThreshold = false) => {
    const colorFactors = colorPoints.map(({ color, x, y }) => {
      const colorInt = parseInt(color, 16);
      return {
        x,
        y,
        r: colorInt >> 16 & 0xff,
        g: colorInt >> 8 & 0xff,
        b: colorInt >> 0 & 0xff };

    });
    const pointA = [colorFactors[0].x, colorFactors[0].y];
    const pointB = [colorFactors[1].x, colorFactors[1].y];
    const pointC = [colorFactors[2].x, colorFactors[2].y];
    const totalArea = GeoGenTextures.measureArea(pointA, pointB, pointC);
    return (pointX, pointY) => {
      const pointD = [pointX, pointY]; // barycentric interpolation
      let factors = [
      GeoGenTextures.measureArea(pointA, pointB, pointD) / totalArea,
      GeoGenTextures.measureArea(pointB, pointC, pointD) / totalArea];

      factors.push(1 - (factors[0] + factors[1]));
      const highestFactorIndex = factors.indexOf(Math.max.apply({}, factors));
      if (useThreshold) {
        factors = factors.map((f, i) => i === highestFactorIndex ? 1 : 0); // 5625463739
      }
      const r = colorFactors[0].r * factors[0] + colorFactors[1].r * factors[1] + colorFactors[2].r * factors[2];
      const g = colorFactors[0].g * factors[0] + colorFactors[1].g * factors[1] + colorFactors[2].g * factors[2];
      const b = colorFactors[0].b * factors[0] + colorFactors[1].b * factors[1] + colorFactors[2].b * factors[2];
      return '#' + (b | g << 8 | r << 16 | 0x1000000).toString(16).substring(1);
    };
  },

  triangleNest: ($, x, y, radius, [centerPoints, outerPoints], colorPicker, iteration) => {
    const newRadius = radius / 2;
    if (!iteration) {
      GeoGenTextures.drawPolygon($, x, y, newRadius, centerPoints, colorPicker(x, y));
    } else {
      GeoGenTextures.triangleNest($, x, y, newRadius, [outerPoints, centerPoints], colorPicker, iteration - 1);
    }
    outerPoints.forEach(([pointX, pointY], edgeIndex) => {
      const newX = pointX * newRadius + x;
      const newY = pointY * newRadius + y;
      if (!iteration) {
        GeoGenTextures.drawPolygon($, newX, newY, newRadius, outerPoints, colorPicker(newX, newY));
      } else {
        GeoGenTextures.triangleNest($, newX, newY, newRadius, [centerPoints, outerPoints], colorPicker, iteration - 1);
      }
    });
  },

  measureArea: (pointA, pointB, pointC) => {// code from http://www.w3resource.com/javascript-exercises/javascript-basic-exercise-4.php
    const side1 = GeoGenTextures.measureDistance(pointA, pointB);
    const side2 = GeoGenTextures.measureDistance(pointB, pointC);
    const side3 = GeoGenTextures.measureDistance(pointC, pointA);
    const perimeter = (side1 + side2 + side3) / 2;
    const c2 = perimeter * ((perimeter - side1) * (perimeter - side2) * (perimeter - side3));
    if (c2 < 0) {
      return 0;
    }
    return Math.sqrt(c2);
  },

  measureDistance: ([x1, y1], [x2, y2]) => {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  },

  drawPolygon: ($, x, y, radius, [firstPoint, ...otherPoints], color) => {
    $.lineWidth = 0;
    $.strokeStyle = color;
    $.fillStyle = color;
    $.beginPath();
    $.moveTo(x + firstPoint[0] * radius, y + firstPoint[1] * radius);
    [...otherPoints, firstPoint].forEach(nextPoint => {
      $.lineTo(x + nextPoint[0] * radius, y + nextPoint[1] * radius);
    });
    $.fill();
    $.stroke();
    $.closePath();
  },

  buildPoints: (() => {
    const lookup = {};
    return (edgeCount, rotationOffset = 0) => {
      const hash = `${edgeCount}-${rotationOffset}`;
      if (!lookup[hash]) {
        const stepSize = Math.PI * 2 / edgeCount;
        lookup[hash] = Array(...new Array(edgeCount)).map((_, edgeIndex) => [
        Math.round(Math.cos(edgeIndex * stepSize + rotationOffset) * 1 * 10000) / 10000,
        Math.round(Math.sin(edgeIndex * stepSize + rotationOffset) * 1 * 10000) / 10000]);

      }
      return lookup[hash];
    };
  })() };
