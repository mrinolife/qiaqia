/* QiaQia art pack — Chiikawa-style hand-drawn SVG mascots, decos & scenes.
   Plain script, no modules. Assigns window.QQ_ART.
   All output deterministic per (kind,mood)/(name) via seeded jitter. */
(function () {
  "use strict";

  var INK = "#4a3f35";
  var SW = 2.5;
  var BLUSH = "#ffb6c1";

  // ---- deterministic RNG (FNV seed + xorshift-ish mix) ----
  function mkRand(str) {
    var h = 2166136261 >>> 0;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return function () {
      h = Math.imul(h ^ (h >>> 15), 2246822519) >>> 0;
      h = Math.imul(h ^ (h >>> 13), 3266489917) >>> 0;
      h = (h ^ (h >>> 16)) >>> 0;
      return h / 4294967296;
    };
  }

  function f1(n) { return Math.round(n * 10) / 10; }
  function mid(a, b) { return f1((a[0] + b[0]) / 2) + " " + f1((a[1] + b[1]) / 2); }

  // wobbly closed blob through points (smooth quadratics + jitter)
  function blob(R, pts, fill, amp, extraAttr) {
    amp = amp == null ? 1.4 : amp;
    var p = pts.map(function (q) { return [q[0] + (R() - 0.5) * amp, q[1] + (R() - 0.5) * amp]; });
    var n = p.length;
    var d = "M" + mid(p[n - 1], p[0]);
    for (var i = 0; i < n; i++) {
      d += "Q" + f1(p[i][0]) + " " + f1(p[i][1]) + " " + mid(p[i], p[(i + 1) % n]);
    }
    d += "Z";
    return '<path d="' + d + '" fill="' + fill + '" stroke="' + INK + '" stroke-width="' + SW +
      '" stroke-linejoin="round"' + (extraAttr || "") + "/>";
  }

  // wobbly open stroke through points
  function wline(R, pts, opts) {
    opts = opts || {};
    var amp = opts.amp == null ? 1.0 : opts.amp;
    var p = pts.map(function (q) { return [q[0] + (R() - 0.5) * amp, q[1] + (R() - 0.5) * amp]; });
    var n = p.length;
    var d = "M" + f1(p[0][0]) + " " + f1(p[0][1]);
    if (n === 2) d += "L" + f1(p[1][0]) + " " + f1(p[1][1]);
    else {
      for (var i = 1; i < n - 1; i++) {
        var end = (i === n - 2) ? f1(p[n - 1][0]) + " " + f1(p[n - 1][1]) : mid(p[i], p[i + 1]);
        d += "Q" + f1(p[i][0]) + " " + f1(p[i][1]) + " " + end;
      }
    }
    return '<path d="' + d + '" fill="' + (opts.fill || "none") + '" stroke="' + (opts.stroke || INK) +
      '" stroke-width="' + (opts.w || SW) + '" stroke-linecap="round" stroke-linejoin="round"/>';
  }

  function dot(x, y, r, fill) {
    return '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + r + '" fill="' + (fill || INK) + '"/>';
  }

  function mirror(pts) { return pts.map(function (p) { return [100 - p[0], p[1]]; }); }

  function sparkle4(x, y, s, fill) {
    return '<path d="M' + x + ' ' + (y - s) + 'Q' + (x + s * 0.22) + ' ' + (y - s * 0.22) + ' ' + (x + s) + ' ' + y +
      'Q' + (x + s * 0.22) + ' ' + (y + s * 0.22) + ' ' + x + ' ' + (y + s) +
      'Q' + (x - s * 0.22) + ' ' + (y + s * 0.22) + ' ' + (x - s) + ' ' + y +
      'Q' + (x - s * 0.22) + ' ' + (y - s * 0.22) + ' ' + x + ' ' + (y - s) + 'Z" fill="' + (fill || "#ffd66e") + '"/>';
  }

  function tear(x, y) {
    return '<path d="M' + x + ' ' + y + ' q-3.2 4.5 -1.2 7 q2 2 4 0 q2 -2.5 -2.8 -7Z" fill="#9fd3f0" stroke="#7cb9dd" stroke-width="1"/>';
  }

  // ---------------- mascots ----------------
  var CFG = {
    chiikawa:  { fill: "#fffdf8", eyeR: 1.9, eyeDx: 10, eyeY: 46, mouth: "omega" },
    hachiware: { fill: "#fffdf8", eyeR: 2.7, eyeDx: 11, eyeY: 46, hl: true, mouth: "wide" },
    usagi:     { fill: "#fff3c4", eyeR: 2.1, eyeDx: 11, eyeY: 44, mouth: "yell" },
    momonga:   { fill: "#fffdf8", eyeR: 4.4, eyeDx: 11, eyeY: 45, sparkle: true, mouth: "smug" },
    rakko:     { fill: "#d9b38c", eyeR: 2.1, eyeDx: 12, eyeY: 42, cool: true, mouth: "rakko" },
    kurimanju: { fill: "#f5e9d0", eyeR: 2.3, eyeDx: 11, eyeY: 42, lid: true, mouth: "tiny" }
  };

  // pear-ish body (slightly narrower shoulders, wider hips)
  var BODY = [[50, 18], [70, 25], [79, 46], [78, 70], [66, 86], [50, 89], [34, 86], [22, 70], [21, 46], [30, 25]];
  var BUNBODY = [[50, 23], [71, 27], [81, 46], [79, 68], [66, 84], [50, 87], [34, 84], [21, 68], [19, 46], [29, 27]];
  var UBODY = [[50, 26], [69, 32], [78, 50], [77, 71], [65, 87], [50, 90], [35, 87], [23, 71], [22, 50], [31, 32]];
  // rakko: wide flat head, body a touch wider than the head
  var RBODY = [[50, 21], [64, 22.5], [75, 28], [81, 47], [79, 70], [66, 86], [50, 89], [34, 86], [21, 70], [19, 47], [25, 28], [36, 22.5]];

  function limbs(R, fill, mood) {
    var s = "";
    // legs
    s += blob(R, [[36, 86], [32.5, 93], [36, 97.5], [42.5, 95.5], [43, 87.5]], fill, 1.1);
    s += blob(R, [[64, 86], [67.5, 93], [64, 97.5], [57.5, 95.5], [57, 87.5]], fill, 1.1);
    // arms
    if (mood === "cheer") {
      s += blob(R, [[26, 51], [15, 41], [11.5, 33.5], [18.5, 35.5], [28, 47]], fill, 1.1);
      s += blob(R, [[74, 51], [85, 41], [88.5, 33.5], [81.5, 35.5], [72, 47]], fill, 1.1);
    } else {
      s += blob(R, [[23.5, 55], [16, 60.5], [17.5, 67.5], [25, 64]], fill, 1.1);
      s += blob(R, [[76.5, 55], [84, 60.5], [82.5, 67.5], [75, 64]], fill, 1.1);
    }
    return s;
  }

  function eyes(R, c, mood) {
    var dx = c.eyeDx, y = c.eyeY, s = "";
    var lx = 50 - dx, rx = 50 + dx;
    if (mood === "sleep") {
      s += wline(R, [[lx - 4, y - 1], [lx, y + 2.2], [lx + 4, y - 1]], { amp: 0.4 });
      s += wline(R, [[rx - 4, y - 1], [rx, y + 2.2], [rx + 4, y - 1]], { amp: 0.4 });
      return s;
    }
    if (mood === "happy") {
      s += wline(R, [[lx - 4, y + 1], [lx, y - 3.4], [lx + 4, y + 1]], { amp: 0.4 });
      s += wline(R, [[rx - 4, y + 1], [rx, y - 3.4], [rx + 4, y + 1]], { amp: 0.4 });
      return s;
    }
    var yy = mood === "think" ? y - 3 : y;
    var xoff = mood === "think" ? 2.5 : 0;
    if (c.lid && (mood === "idle" || mood === "think" || mood === "sad")) {
      // half-lidded: flat lid line + lower half-disc pupil
      [lx, rx].forEach(function (ex) {
        s += '<path d="M' + (ex + xoff - 3) + ' ' + yy + ' A3 3 0 0 0 ' + (ex + xoff + 3) + ' ' + yy + 'Z" fill="' + INK + '"/>';
        s += wline(R, [[ex + xoff - 4, yy], [ex + xoff + 4, yy]], { amp: 0.3, w: 2.2 });
      });
      return s;
    }
    if (c.cool && mood !== "cheer") {
      // senpai half-lidded: flat lid line just above each pupil
      [lx, rx].forEach(function (ex) {
        s += dot(ex + xoff, yy, c.eyeR);
        s += wline(R, [[ex + xoff - 3.6, yy - 2.8], [ex + xoff + 3.6, yy - 2.8]], { amp: 0.3, w: 2 });
      });
      return s;
    }
    if (c.sparkle) {
      s += dot(lx + xoff, yy, c.eyeR) + dot(rx + xoff, yy, c.eyeR);
      s += dot(lx + xoff - 1.5, yy - 1.5, 1.5, "#fff") + dot(rx + xoff - 1.5, yy - 1.5, 1.5, "#fff");
      s += dot(lx + xoff + 1.4, yy + 1.2, 0.8, "#fff") + dot(rx + xoff + 1.4, yy + 1.2, 0.8, "#fff");
      return s;
    }
    s += dot(lx + xoff, yy, c.eyeR) + dot(rx + xoff, yy, c.eyeR);
    if (c.hl) { s += dot(lx + xoff - 0.9, yy - 0.9, 0.8, "#fff") + dot(rx + xoff - 0.9, yy - 0.9, 0.8, "#fff"); }
    return s;
  }

  function mouth(R, kind, c, mood) {
    var s = "";
    if (kind === "rakko") {
      s += '<ellipse cx="50" cy="49" rx="2.6" ry="2" fill="' + INK + '"/>';
    }
    if (mood === "happy") {
      if (kind === "usagi") return s + '<ellipse cx="50" cy="57" rx="7.5" ry="6.5" fill="#e58f8f" stroke="' + INK + '" stroke-width="' + SW + '"/>';
      return s + '<path d="M44 53 Q50 62.5 56 53 Q50 55.5 44 53Z" fill="#e58f8f" stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round"/>';
    }
    if (mood === "cheer") {
      if (kind === "usagi") return s + '<ellipse cx="50" cy="58" rx="9" ry="8" fill="#e58f8f" stroke="' + INK + '" stroke-width="' + SW + '"/>';
      return s + '<path d="M42 52 Q50 66 58 52 Q50 55 42 52Z" fill="#e58f8f" stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round"/>';
    }
    if (mood === "sad") {
      return s + wline(R, [[43, 58], [45.5, 55.8], [48, 58], [50.5, 60], [53, 58], [55.5, 55.8], [58, 58]], { amp: 0.3, w: 2.2 });
    }
    if (mood === "sleep") {
      return s + wline(R, [[47, 56], [50, 58], [53, 56]], { amp: 0.3, w: 2 });
    }
    if (mood === "think") {
      return s + wline(R, [[46.5, 56.5], [53, 55.5]], { amp: 0.4, w: 2.2 });
    }
    // idle by kind
    switch (c.mouth) {
      case "omega":
        return s + wline(R, [[45.5, 55.5], [47.7, 58.3], [50, 55.5]], { amp: 0.3, w: 2.1 }) +
          wline(R, [[50, 55.5], [52.3, 58.3], [54.5, 55.5]], { amp: 0.3, w: 2.1 });
      case "wide":
        return s + wline(R, [[42, 53], [50, 60.5], [58, 53]], { amp: 0.5, w: 2.3 });
      case "yell":
        return s + '<ellipse cx="50" cy="56.5" rx="7" ry="6" fill="#e58f8f" stroke="' + INK + '" stroke-width="' + SW + '"/>';
      case "smug":
        return s + wline(R, [[45, 54], [50, 57.5], [55, 54]], { amp: 0.4, w: 2.2 });
      case "rakko":
        return s + wline(R, [[50, 51], [50, 54], [46.5, 55.8]], { amp: 0.3, w: 2 }) +
          wline(R, [[50, 54], [53.5, 55.8]], { amp: 0.3, w: 2 });
      default:
        return s + wline(R, [[47, 55], [50, 57], [53, 55]], { amp: 0.3, w: 2 });
    }
  }

  function extras(R, mood) {
    var s = "";
    if (mood === "cheer") {
      s += sparkle4(15, 22, 6.5) + sparkle4(85, 17, 5.5) + sparkle4(90, 45, 4);
    } else if (mood === "sad") {
      s += tear(36, 52) + tear(66, 53);
    } else if (mood === "think") {
      s += dot(74, 26, 1.5) + dot(81, 23, 1.8) + dot(89, 20, 2.1);
      s += '<path d="M20 34 q-3.5 5 -1.3 7.6 q2.2 2 4.3 -0.2 q2 -2.6 -3 -7.4Z" fill="#bfe3f7" stroke="#8cc4e4" stroke-width="1"/>';
    } else if (mood === "sleep") {
      s += '<text x="70" y="30" font-family="Comic Sans MS, cursive, sans-serif" font-size="11" fill="#8aa8c8" transform="rotate(-12 70 30)">z</text>';
      s += '<text x="78" y="19" font-family="Comic Sans MS, cursive, sans-serif" font-size="15" fill="#8aa8c8" transform="rotate(-12 78 19)">Z</text>';
    }
    return s;
  }

  function blush(mood) {
    var r = (mood === "happy" || mood === "cheer") ? 5.4 : 4;
    var op = (mood === "happy" || mood === "cheer") ? 0.9 : 0.75;
    return '<circle cx="30.5" cy="53" r="' + r + '" fill="' + BLUSH + '" opacity="' + op + '"/>' +
           '<circle cx="69.5" cy="53" r="' + r + '" fill="' + BLUSH + '" opacity="' + op + '"/>';
  }

  function mascotBody(R, kind, mood) {
    var c = CFG[kind];
    var s = "";
    // ears / behind-body parts
    if (kind === "chiikawa") {
      s += blob(R, [[35, 10], [40.5, 13], [41.5, 19], [35, 21.5], [29.5, 18], [30, 13]], c.fill, 1.1);
      s += blob(R, [[65, 10], [70, 13], [70.5, 18], [65, 21.5], [58.5, 19], [59.5, 13]], c.fill, 1.1);
    } else if (kind === "hachiware") {
      // rounded-triangle cat ears, bases merged with the head curve
      s += blob(R, [[27.5, 26], [27, 15], [30.5, 7.5], [36.5, 14], [39, 21.5]], "#7db9e8", 1.0);
      s += blob(R, [[72.5, 26], [73, 15], [69.5, 7.5], [63.5, 14], [61, 21.5]], "#7db9e8", 1.0);
    } else if (kind === "usagi") {
      s += blob(R, [[41.5, 30], [38.5, 12], [34.5, 2], [30, 1.5], [28.5, 8], [31.5, 20], [35.5, 32]], c.fill, 1.1);
      s += blob(R, [[58.5, 30], [61.5, 12], [65.5, 2], [70, 1.5], [71.5, 8], [68.5, 20], [64.5, 32]], c.fill, 1.1);
    } else if (kind === "momonga") {
      s += blob(R, [[35, 10], [41, 13], [41.5, 19.5], [34, 22], [28.5, 17.5], [29.5, 12]], c.fill, 1.2);
      s += blob(R, [[65, 10], [71.5, 12], [70.5, 17.5], [66, 22], [58.5, 19.5], [59, 13]], c.fill, 1.2);
      // membrane flaps
      s += blob(R, [[24, 44], [10, 52], [5.5, 65], [11, 77], [22, 74], [25, 60]], c.fill, 1.3);
      s += blob(R, [[76, 44], [90, 52], [94.5, 65], [89, 77], [78, 74], [75, 60]], c.fill, 1.3);
    } else if (kind === "rakko") {
      // small round ears set low on the sides of the flat head
      s += blob(R, [[25, 22], [29.5, 23.5], [30, 28.5], [24, 29.5], [21.5, 25.5]], c.fill, 0.9);
      s += blob(R, [[75, 22], [78.5, 25.5], [76, 29.5], [70, 28.5], [70.5, 23.5]], c.fill, 0.9);
    }
    // body
    s += blob(R, kind === "kurimanju" ? BUNBODY : (kind === "usagi" ? UBODY : (kind === "rakko" ? RBODY : BODY)), c.fill, 1.5);
    // top patterns
    if (kind === "hachiware") {
      // hachiware cap covering most of the head dome, white blaze wedge up the forehead
      s += blob(R, [[23, 41], [36, 42.5], [50, 43], [64, 42.5], [77, 41], [74, 25.5], [60, 16.5], [40, 16.5], [26, 25.5]], "#7db9e8", 1.0);
      s += '<path d="M46.4 46 Q47.4 30 50 19.5 Q52.6 30 53.6 46 Q50 48 46.4 46Z" fill="' + c.fill + '"/>';
      s += wline(R, [[46.5, 44.5], [47.5, 30], [50, 19.5]], { amp: 0.4, w: 2.3 });
      s += wline(R, [[50, 19.5], [52.5, 30], [53.5, 44.5]], { amp: 0.4, w: 2.3 });
    } else if (kind === "kurimanju") {
      s += blob(R, [[19.5, 47], [30, 51.5], [41, 47.5], [50, 52], [59, 47.5], [70, 51.5], [80.5, 47],
                    [76.5, 32], [62, 22.5], [38, 22.5], [23.5, 32]], "#e0b97d", 1.1);
    } else if (kind === "rakko") {
      // large light muzzle patch covering the lower half of the face
      s += '<path d="M35 46 Q50 41 65 46 Q69.5 55 63 62.5 Q50 68 37 62.5 Q30.5 55 35 46Z" fill="#f0e2cd"/>';
      // small scar high on the forehead, off to the side
      s += wline(R, [[63, 22], [67, 25.5]], { amp: 0.3, w: 1.5 }) + wline(R, [[67, 22], [63, 25.5]], { amp: 0.3, w: 1.5 });
    }
    s += limbs(R, c.fill, mood);
    return s;
  }

  function mascot(kind, mood, size) {
    if (!CFG[kind]) kind = "chiikawa";
    if (["idle", "happy", "sad", "cheer", "think", "sleep"].indexOf(mood) < 0) mood = "idle";
    size = size || 64;
    var R = mkRand("qq:" + kind + ":" + mood);
    var c = CFG[kind];
    var s = '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 100 100">';
    s += mascotBody(R, kind, mood);
    s += blush(mood);
    s += eyes(R, c, mood);
    s += mouth(R, kind, c, mood);
    s += extras(R, mood);
    s += "</svg>";
    return s;
  }

  // ---------------- decos ----------------
  var GREEN = "#a8d8a0", WOOD = "#c89b6a";

  var D = {
    grass: function (R) {
      return blob(R, [[12, 90], [18, 62], [24, 84], [30, 52], [38, 82], [50, 44], [62, 82], [70, 52],
                      [76, 84], [82, 62], [88, 90], [50, 92]], GREEN, 1.6);
    },
    tree: function (R) {
      var s = blob(R, [[46, 60], [45, 80], [44, 93], [56, 93], [55, 80], [54, 60]], WOOD, 1);
      s += blob(R, [[50, 12], [72, 20], [80, 40], [72, 58], [50, 64], [28, 58], [20, 40], [28, 20]], "#9cd494", 1.8);
      s += dot(40, 34, 2.4, "#7db874") + dot(60, 42, 2.4, "#7db874") + dot(50, 26, 2.4, "#7db874");
      return s;
    },
    flower: function (R) {
      var s = wline(R, [[50, 92], [48, 74], [50, 58]], { w: 3, stroke: "#7db874" });
      s += blob(R, [[52, 78], [63, 72], [68, 77], [58, 83]], GREEN, 0.9);
      var cx = 50, cy = 38;
      [[0, -13], [12.4, -4], [7.6, 10.5], [-7.6, 10.5], [-12.4, -4]].forEach(function (o) {
        s += blob(R, [[cx + o[0], cy + o[1] - 7], [cx + o[0] + 6.5, cy + o[1]], [cx + o[0], cy + o[1] + 7], [cx + o[0] - 6.5, cy + o[1]]], "#ffd1dc", 1);
      });
      s += '<circle cx="50" cy="38" r="7" fill="#ffd66e" stroke="' + INK + '" stroke-width="2.2"/>';
      return s;
    },
    signpost: function (R) {
      var s = blob(R, [[46.5, 34], [46, 65], [45.5, 92], [54.5, 92], [54, 65], [53.5, 34]], WOOD, 0.9);
      s += blob(R, [[20, 22], [76, 21], [86, 32], [76, 43], [20, 44]], "#d9b380", 1.2);
      s += wline(R, [[28, 30], [54, 29.5]], { w: 2.4 }) + wline(R, [[28, 37], [64, 36.5]], { w: 2.4 });
      return s;
    },
    onigiri: function (R) {
      var s = blob(R, [[50, 18], [66, 38], [78, 65], [70, 78], [50, 80], [30, 78], [22, 65], [34, 38]], "#fffdf8", 1.4);
      s += blob(R, [[40, 56], [60, 56], [61, 79], [39, 79]], "#3d4a3a", 0.9);
      return s;
    },
    star: function (R) {
      return blob(R, [[50, 14], [59.8, 40], [86, 42], [66, 59], [72.5, 85], [50, 71], [27.5, 85], [34, 59], [14, 42], [40.2, 40]], "#ffd66e", 1.2);
    },
    sparkle: function () {
      return sparkle4(50, 50, 34, "#ffd66e") + sparkle4(78, 24, 10, "#ffe9a8") + sparkle4(24, 74, 8, "#ffe9a8");
    },
    cloud: function (R) {
      return blob(R, [[24, 62], [26, 48], [38, 39], [52, 37], [66, 42], [76, 51], [77, 62], [64, 69], [44, 70], [30, 68]], "#ffffff", 1.6);
    },
    weed: function (R) {
      var s = blob(R, [[30, 46], [36, 22], [42, 42], [50, 14], [58, 42], [64, 22], [70, 46], [50, 50]], GREEN, 1.4);
      s += wline(R, [[44, 50], [40, 68], [36, 84]], { w: 2, stroke: "#a97c50" });
      s += wline(R, [[50, 51], [51, 70], [50, 88]], { w: 2, stroke: "#a97c50" });
      s += wline(R, [[56, 50], [61, 66], [65, 82]], { w: 2, stroke: "#a97c50" });
      s += dot(30, 78, 2, "#b98a5a") + dot(72, 72, 1.7, "#b98a5a") + dot(56, 92, 1.8, "#b98a5a");
      return s;
    },
    broom: function (R) {
      var s = wline(R, [[64, 8], [56, 32], [48, 56]], { w: 4.5, stroke: "#a97c50" });
      s += blob(R, [[48, 54], [58, 62], [56, 78], [46, 93], [34, 92], [26, 82], [30, 66], [40, 56]], "#e8c98a", 1.4);
      s += wline(R, [[38, 60], [52, 66]], { w: 2 });
      s += wline(R, [[34, 88], [40, 70]], { w: 1.6 }) + wline(R, [[43, 90], [46, 72]], { w: 1.6 });
      return s;
    },
    pancake: function (R) {
      var s = blob(R, [[22, 74], [50, 68], [78, 74], [78, 82], [50, 88], [22, 82]], "#e0a860", 1);
      s += blob(R, [[22, 60], [50, 54], [78, 60], [78, 68], [50, 74], [22, 68]], "#eec384", 1);
      s += blob(R, [[24, 46], [50, 40], [76, 46], [76, 54], [50, 60], [24, 54]], "#f2cc8e", 1);
      s += blob(R, [[43, 34], [57, 34], [58, 43], [42, 43]], "#fff3b0", 0.7);
      s += wline(R, [[36, 48], [38, 56], [36, 62]], { w: 2.2, stroke: "#c78a3f" });
      s += wline(R, [[64, 48], [62, 56], [64, 62]], { w: 2.2, stroke: "#c78a3f" });
      return s;
    },
    tea: function (R) {
      var s = wline(R, [[56, 4], [54, 18], [51, 34]], { w: 5.5, stroke: "#ff9eb5" });
      s += blob(R, [[36, 26], [64, 26], [61, 60], [59, 88], [41, 88], [39, 60]], "#e8c49a", 1);
      s += wline(R, [[35, 32], [50, 34], [65, 32]], { w: 2.2 });
      s += dot(45, 78, 3.4, "#5a4632") + dot(53, 81, 3.4, "#5a4632") + dot(48, 70, 3.2, "#5a4632") + dot(56, 72, 3, "#5a4632");
      s += '<ellipse cx="50" cy="46" rx="8" ry="4" fill="#f6ddba" opacity="0.8"/>';
      return s;
    },
    mushroom: function (R) {
      var s = blob(R, [[43, 62], [41, 80], [42, 92], [58, 92], [59, 80], [57, 62]], "#fffaf2", 0.9);
      s += blob(R, [[16, 58], [22, 34], [50, 17], [78, 34], [84, 58], [64, 68], [50, 71], [36, 68]], "#e2604f", 1.5);
      s += dot(36, 40, 4.2, "#fff6e6") + dot(58, 32, 3.6, "#fff6e6") + dot(68, 50, 3, "#fff6e6") + dot(44, 55, 2.6, "#fff6e6");
      return s;
    },
    lantern: function (R) {
      var s = '<circle cx="50" cy="52" r="34" fill="#ffcf7a" opacity="0.22"/>';
      s += wline(R, [[50, 4], [50, 20]], { amp: 0.4, w: 2, stroke: "#8a6b4a" });
      s += blob(R, [[42, 18], [58, 18], [60, 24], [40, 24]], "#8a6b4a", 0.6);
      s += blob(R, [[34, 26], [66, 26], [72, 50], [66, 74], [34, 74], [28, 50]], "#ff9a52", 1.4);
      s += wline(R, [[40, 27], [37, 50], [40, 73]], { amp: 0.3, w: 1.6, stroke: "#e2703a" });
      s += wline(R, [[50, 27], [50, 73]], { amp: 0.3, w: 1.6, stroke: "#e2703a" });
      s += wline(R, [[60, 27], [63, 50], [60, 73]], { amp: 0.3, w: 1.6, stroke: "#e2703a" });
      s += blob(R, [[42, 74], [58, 74], [60, 80], [40, 80]], "#8a6b4a", 0.6);
      s += wline(R, [[50, 80], [50, 92]], { amp: 0.3, w: 1.8, stroke: "#8a6b4a" });
      s += sparkle4(50, 89, 3, "#ffe9a8");
      return s;
    },
    hut: function (R) {
      var s = blob(R, [[24, 60], [24, 92], [76, 92], [76, 60]], "#f5e1c8", 0.9);
      s += blob(R, [[16, 62], [50, 30], [84, 62], [70, 66], [50, 50], [30, 66]], "#d9765a", 1.3);
      s += blob(R, [[44, 74], [56, 74], [56, 92], [44, 92]], "#8a6b4a", 0.7);
      s += dot(32, 72, 3, "#fffdf8");
      return s;
    },
    puddle: function (R) {
      var s = blob(R, [[20, 62], [40, 52], [64, 54], [82, 64], [70, 76], [40, 78], [22, 72]], "#a9c9dc", 1.3, ' opacity="0.75"');
      s += wline(R, [[34, 62], [50, 58], [64, 62]], { amp: 0.3, w: 1.6, stroke: "#7fa8bf" });
      s += wline(R, [[38, 70], [50, 67], [60, 70]], { amp: 0.3, w: 1.4, stroke: "#7fa8bf" });
      return s;
    }
  };

  function deco(name, size) {
    if (!D[name]) name = "star";
    size = size || 48;
    var R = mkRand("qqdeco:" + name);
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size +
      '" viewBox="0 0 100 100">' + D[name](R) + "</svg>";
  }

  // ---------------- scenes ----------------
  function place(name, R, x, y, s) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' + D[name](R) + "</g>";
  }

  function scene(variant) {
    var R = mkRand("qqscene:" + variant);
    var s = '<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 400 120" preserveAspectRatio="xMidYMid slice">';
    if (variant === "night") {
      s += '<defs><linearGradient id="qqskyN" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#3e3a6d"/><stop offset="0.7" stop-color="#6d5a8c"/><stop offset="1" stop-color="#9c7fae"/></linearGradient></defs>';
      s += '<rect width="400" height="120" fill="url(#qqskyN)"/>';
      s += '<path d="M330 22 A15 15 0 1 0 342 44 A12 12 0 1 1 330 22Z" fill="#fff3c4" opacity="0.95"/>';
      [[30, 20], [80, 34], [140, 14], [200, 30], [255, 18], [300, 40], [370, 26], [55, 52], [175, 50]].forEach(function (p, i) {
        s += sparkle4(p[0], p[1], i % 2 ? 3 : 4.5, "#fff6c9");
      });
      s += '<path d="M0 92 Q60 78 120 88 Q200 98 280 84 Q340 76 400 88 L400 120 L0 120Z" fill="#5d7d63" stroke="' + INK + '" stroke-width="2"/>';
      s += place("grass", R, 40, 84, 0.28) + place("grass", R, 300, 82, 0.3);
      s += place("weed", R, 180, 86, 0.25);
    } else if (variant === "exam") {
      s += '<rect width="400" height="120" fill="#fdf6e3"/>';
      s += '<rect y="96" width="400" height="24" fill="#e8d5ae"/>';
      s += '<line x1="0" y1="96" x2="400" y2="96" stroke="' + INK + '" stroke-width="2"/>';
      // hanging scroll with 试
      s += '<line x1="60" y1="8" x2="60" y2="18" stroke="' + INK + '" stroke-width="2"/>';
      s += '<rect x="42" y="18" width="36" height="6" rx="3" fill="#8a6b4a" stroke="' + INK + '" stroke-width="1.6"/>';
      s += '<rect x="46" y="24" width="28" height="52" fill="#fffdf8" stroke="' + INK + '" stroke-width="1.8"/>';
      s += '<rect x="42" y="76" width="36" height="6" rx="3" fill="#8a6b4a" stroke="' + INK + '" stroke-width="1.6"/>';
      s += '<text x="60" y="58" text-anchor="middle" font-family="serif" font-size="20" fill="' + INK + '">试</text>';
      // desk
      s += '<rect x="150" y="62" width="130" height="9" rx="3" fill="#b98a5a" stroke="' + INK + '" stroke-width="2"/>';
      s += '<rect x="160" y="71" width="9" height="26" fill="#a97c50" stroke="' + INK + '" stroke-width="2"/>';
      s += '<rect x="262" y="71" width="9" height="26" fill="#a97c50" stroke="' + INK + '" stroke-width="2"/>';
      // paper + lines + pencil
      s += '<g transform="rotate(-4 205 52)"><rect x="182" y="42" width="46" height="20" fill="#fffdf8" stroke="' + INK + '" stroke-width="1.8"/>' +
        '<line x1="188" y1="49" x2="222" y2="49" stroke="#b8ab98" stroke-width="1.6"/>' +
        '<line x1="188" y1="55" x2="214" y2="55" stroke="#b8ab98" stroke-width="1.6"/></g>';
      s += '<g transform="rotate(24 246 56)"><rect x="238" y="53" width="24" height="4.5" rx="2" fill="#ffd66e" stroke="' + INK + '" stroke-width="1.5"/>' +
        '<path d="M262 53 L268 55.3 L262 57.5Z" fill="#f0e2cd" stroke="' + INK + '" stroke-width="1.5"/></g>';
      // window with soft sky
      s += '<rect x="318" y="18" width="56" height="44" rx="4" fill="#cfe8ff" stroke="' + INK + '" stroke-width="2"/>';
      s += '<line x1="346" y1="18" x2="346" y2="62" stroke="' + INK + '" stroke-width="2"/>';
      s += '<line x1="318" y1="40" x2="374" y2="40" stroke="' + INK + '" stroke-width="2"/>';
      s += place("cloud", R, 322, 20, 0.22);
    } else if (variant === "forest") {
      s += '<defs><linearGradient id="qqskyF" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#dff2d8"/><stop offset="0.6" stop-color="#c3e6bd"/><stop offset="1" stop-color="#e8f5df"/></linearGradient></defs>';
      s += '<rect width="400" height="120" fill="url(#qqskyF)"/>';
      s += '<g opacity="0.55">' + place("tree", R, 30, 4, 0.34) + place("tree", R, 100, -2, 0.3) +
        place("tree", R, 250, 2, 0.32) + place("tree", R, 340, 0, 0.3) + "</g>";
      s += '<g opacity="0.85">' + place("tree", R, 70, 18, 0.44) + place("tree", R, 190, 14, 0.4) +
        place("tree", R, 300, 20, 0.42) + "</g>";
      s += '<path d="M0 92 Q80 80 150 88 Q230 96 300 82 Q350 78 400 90 L400 120 L0 120Z" fill="#6fae5e" stroke="' + INK + '" stroke-width="2"/>';
      s += place("tree", R, 6, 40, 0.62) + place("tree", R, 130, 44, 0.58) + place("tree", R, 220, 42, 0.6) + place("tree", R, 360, 46, 0.56);
      s += blob(R, [[150, 96], [210, 92], [214, 100], [154, 104]], "#a97c50", 1);
      s += '<ellipse cx="212" cy="96" rx="5" ry="6" fill="#8a6140" stroke="' + INK + '" stroke-width="1.6"/>';
      s += wline(R, [[165, 95], [190, 93]], { amp: 0.3, w: 1.4, stroke: "#8a6140" });
      s += place("mushroom", R, 58, 88, 0.22) + place("mushroom", R, 260, 84, 0.2) + place("mushroom", R, 340, 90, 0.18);
    } else if (variant === "market") {
      s += '<defs><linearGradient id="qqskyMk" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#4a3a63"/><stop offset="0.6" stop-color="#7a5a7c"/><stop offset="1" stop-color="#c98a72"/></linearGradient></defs>';
      s += '<rect width="400" height="120" fill="url(#qqskyMk)"/>';
      s += '<rect y="94" width="400" height="26" fill="#5a4a52" stroke="' + INK + '" stroke-width="2"/>';
      s += '<line x1="0" y1="94" x2="400" y2="94" stroke="' + INK + '" stroke-width="2"/>';
      s += wline(R, [[0, 14], [100, 22], [200, 12], [300, 24], [400, 14]], { amp: 0.6, w: 1.6, stroke: "#3a2f2a" });
      [[30, 18], [90, 24], [150, 16], [210, 22], [270, 14], [330, 24], [380, 18]].forEach(function (p, i) {
        s += place("lantern", R, p[0], p[1], 0.24 + (i % 2 ? 0.03 : 0));
      });
      s += blob(R, [[40, 66], [39, 84], [41, 96], [109, 96], [111, 84], [110, 66]], "#8a6b4a", 1.1);
      s += blob(R, [[32, 66], [46, 49], [104, 49], [118, 66], [92, 62], [58, 62]], "#d9483f", 1.3);
      s += wline(R, [[52, 50], [46, 66]], { amp: 0.4, w: 1.8, stroke: INK }) +
        wline(R, [[72, 49.5], [68, 66]], { amp: 0.4, w: 1.8, stroke: INK }) +
        wline(R, [[92, 50], [90, 66]], { amp: 0.4, w: 1.8, stroke: INK });
      s += blob(R, [[36, 88], [36, 98], [114, 98], [114, 88]], "#c89b6a", 0.9);
      s += dot(52, 92, 3, "#ffd66e") + dot(64, 91, 2.6, "#e58f8f") + dot(76, 92, 3, "#ffd66e") + dot(88, 91, 2.6, "#e58f8f");
      s += blob(R, [[280, 70], [279, 84], [281, 96], [343, 96], [345, 84], [344, 70]], "#7a5a44", 1.1);
      s += blob(R, [[272, 70], [284, 54], [340, 54], [352, 70], [328, 66], [296, 66]], "#4f7a8c", 1.3);
      s += wline(R, [[292, 55], [288, 70]], { amp: 0.4, w: 1.8, stroke: INK }) +
        wline(R, [[312, 54.5], [310, 70]], { amp: 0.4, w: 1.8, stroke: INK }) +
        wline(R, [[332, 55], [331, 70]], { amp: 0.4, w: 1.8, stroke: INK });
      s += blob(R, [[276, 90], [276, 98], [348, 98], [348, 90]], "#5f8fa0", 0.9);
      s += dot(292, 93, 2.8, "#fffdf8") + dot(304, 92, 2.4, "#ffd66e") + dot(316, 93, 2.8, "#fffdf8") + dot(328, 92, 2.4, "#ffd66e");
      s += sparkle4(160, 40, 3.5, "#ffe9a8") + sparkle4(230, 36, 3, "#ffe9a8");
    } else if (variant === "town") {
      s += '<defs><linearGradient id="qqskyT" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#cfe8ff"/><stop offset="0.7" stop-color="#eef6ea"/><stop offset="1" stop-color="#fdf1e0"/></linearGradient></defs>';
      s += '<rect width="400" height="120" fill="url(#qqskyT)"/>';
      s += '<circle cx="40" cy="22" r="13" fill="#ffe9a8" stroke="#f5cf72" stroke-width="2"/>';
      s += place("cloud", R, 200, 10, 0.3) + place("cloud", R, 320, 16, 0.26);
      s += '<path d="M0 92 Q90 80 170 88 Q250 96 320 82 Q360 76 400 86 L400 120 L0 120Z" fill="#cfe3a8" stroke="' + INK + '" stroke-width="2"/>';
      function cottage(x, y, scale, wallFill, roofFill) {
        var g = '<g transform="translate(' + x + ' ' + y + ') scale(' + scale + ')">';
        g += blob(R, [[10, 50], [10, 90], [70, 90], [70, 50]], wallFill, 1);
        g += blob(R, [[0, 52], [40, 10], [80, 52], [64, 58], [40, 38], [16, 58]], roofFill, 1.4);
        g += '<rect x="34" y="66" width="14" height="24" fill="#8a6b4a" stroke="' + INK + '" stroke-width="1.6"/>';
        g += '<circle cx="54" cy="70" r="4.5" fill="#cfe8ff" stroke="' + INK + '" stroke-width="1.6"/>';
        g += "</g>";
        return g;
      }
      s += place("hut", R, 30, 46, 0.62);
      s += cottage(140, 40, 0.72, "#e8f0e0", "#7fa9c9");
      s += cottage(280, 44, 0.66, "#fbe6e6", "#d9a05a");
      s += place("signpost", R, 220, 60, 0.34);
      s += wline(R, [[356, 96], [356, 60]], { amp: 0.3, w: 3, stroke: "#5a4a3a" });
      s += blob(R, [[350, 48], [362, 48], [364, 58], [348, 58]], "#8a6b4a", 0.8);
      s += '<circle cx="356" cy="42" r="10" fill="#ffe9a8" opacity="0.35"/>';
      s += blob(R, [[349, 36], [363, 36], [363, 50], [349, 50]], "#fff6c9", 0.7);
      s += dot(356, 43, 3, "#ffd66e");
    } else { // meadow
      s += '<defs><linearGradient id="qqskyM" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#cfe8ff"/><stop offset="0.65" stop-color="#eaf4f0"/><stop offset="1" stop-color="#fdf6e3"/></linearGradient></defs>';
      s += '<rect width="400" height="120" fill="url(#qqskyM)"/>';
      s += '<circle cx="352" cy="24" r="15" fill="#ffe9a8" stroke="#f5cf72" stroke-width="2"/>';
      s += place("cloud", R, 40, 8, 0.42) + place("cloud", R, 190, 18, 0.3) + place("cloud", R, 280, 4, 0.36);
      s += '<path d="M0 90 Q70 76 140 86 Q220 96 300 82 Q350 74 400 86 L400 120 L0 120Z" fill="#b7e0a8" stroke="' + INK + '" stroke-width="2"/>';
      s += place("grass", R, 25, 82, 0.3) + place("grass", R, 210, 86, 0.26) + place("grass", R, 340, 80, 0.32);
      s += place("flower", R, 120, 84, 0.3) + place("flower", R, 292, 88, 0.24);
    }
    s += "</svg>";
    return s;
  }

  window.QQ_ART = { mascot: mascot, deco: deco, scene: scene };
})();
