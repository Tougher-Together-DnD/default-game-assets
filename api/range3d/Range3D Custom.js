// v1.03
// Computes the distances between 2 tokens on the active player page
// Assumes each square grid is 70 pixels, scaling is used to calculate hex grid maps.
// Script command
// !range @{target|1st Target|token_id},@{target|2nd Target|token_id}
// Set useHeight = true to use Bar2 to calculate range including height difference between targets (bar2 is units of page scale eg. 5ft.) false to ignore height.
// Height calculation currently assumes a medium sized creature (1 unit, eg. 5ft) so a target with 1 unit (5 ft) elevation in an adjacent square is 1 unit away.

// Modded by Mhykiel
// Original script by Kilthar: https://gist.github.com/kilthar/4decaa1d45def15929e83470069f4843

on("chat:message", function (msg) {

	// Add variable to select what token attribute contains elevation data.
	var dataField = "bar3_value"

	// Add variable for better style of message in chat.
	// Original hard coded style: padding:1px 3px;border: 1px solid #8B4513;background: #eeffee; color: #8B4513; font-size: 80%;
	var messageCSS = "width: 189px; border: 1px solid black; background-color: #ffffff; padding: 5px; font-size: 16px;";

	// Consolidate finalMessage and sendChat block.
	var outputResult = function (name1, name2, dist, curUnit, distSQ = 0, blnSQ = false) {
		if (blnSQ === false) {
			// Replace name2 with "creature" to keep token names anonymous.
			var finalMessage = (`Distance between ${name1} and target creature is ${dist} ${curUnit}.`);
			sendChat("RangeFinder", `<div style="${messageCSS}">${finalMessage}</div>`);
		} else {
			var finalMessage = (`Distance between ${name1} and target creature is (${distSQ}) ${dist} ${curUnit}.`);
			sendChat("RangeFinder", `<div style="${messageCSS}">${finalMessage}</div>`);
		}
	}

	var findPlayerPage = function (playerid) {
		if (playerIsGM(playerid)) {
			let player = getObj('player', playerid),
				page = getObj('page', player.get('lastpage'));
			if (page) {
				return page;
			}
		}
		if (_.has(Campaign().get('playerspecificpages'), msg.playerid)) {
			let page = getObj('page', Campaign().get('playerspecificpages')[msg.playerid]);
			if (page) {
				return page;
			}
		}
		return getObj('page', Campaign().get('playerpageid'));
	};


	if (msg.type == "api" && msg.content.indexOf("!range") != -1) {
		var useHeight = true; // true = use Target height difference, false to ignore height

		if (msg.content.indexOf("!range ") != -1) {
			var m = msg.content;
			m = m.replace("!range ", "");
			var l = m.length;

			var p = m.indexOf(",");
			tokenid1 = m.substring(0, p);
			tokenid2 = m.substring(p + 1, l);
		}

		var curPage = findPlayerPage(msg.playerid);
		var curScale = curPage.get("scale_number"); // scale for 1 unit, eg. 1 unit = 5ft 
		var curUnit = curPage.get("scale_units"); // ft, m, km, mi etc.
		var curDiagonalType = curPage.get("diagonaltype"); // One of "foure", "pythagorean" (Euclidean), "threefive", or "manhattan"
		var curGridType = curPage.get("grid_type"); // One of "square", "hex", or "hexr". (hex corresponds to Hex(V), and hexr corresponds to Hex(H))
		var gridSize = 70;

		var token1 = findObjs({ _type: "graphic", layer: "objects", _pageid: curPage.id, _id: tokenid1 })[0];
		var token2 = findObjs({ _type: "graphic", layer: "objects", _pageid: curPage.id, _id: tokenid2 })[0];

		if (token1 && token2) {
			var name1 = token1.get("name");
			var name2 = token2.get("name");

			// DnD 4.0 Distance Calculation
			if (curDiagonalType == "foure" && curGridType == "square") {
				var lDist = Math.abs(token1.get("left") - token2.get("left")) / gridSize;
				var tDist = Math.abs(token1.get("top") - token2.get("top")) / gridSize;
				var zDist = Math.abs((token1.get(dataField) - token2.get(dataField)) / curScale);//gridSize;
				var t1Height = token1.get("height");// to use for token size variation in the fiture
				if (zDist >= 1) {
					zDist = zDist - 1;// based on medium size tokens reduce effective height difference by 1 unit as token is a cube
				}
				if (useHeight != true) zDist = 0;
				var dist = 0;
				dist = Math.floor(Math.max(Math.min(lDist, tDist) + Math.abs(lDist - tDist), zDist));
				//dist = Math.floor(Math.min(lDist, tDist) + Math.abs(lDist - tDist));
				var distSQ = dist;
				dist = dist * curScale;
				
				// var finalMessage = ("Distance between " + name1 + " and " + name2 + " = (" + distSQ + ") " + dist + " " + curUnit);
				// sendChat("RangeFinder", '<div style="padding:1px 3px;border: 1px solid #8B4513;background: #eeffee; color: #8B4513; font-size: 80%;">' + finalMessage + '</div>');
			  outputResult(name1, name2, dist, curUnit, distSQ, true);
			}

			// DnD 3.5 / Pathfinder Distance Calculation
			if (curDiagonalType == "threefive" && curGridType == "square") {
				var lDist = Math.abs(token1.get("left") - token2.get("left"));
				var tDist = Math.abs(token1.get("top") - token2.get("top"));
				var zDist = Math.abs((token1.get(dataField) - token2.get(dataField)) / curScale) * gridSize;

                var t1Height = Number(token1.get("height"));// to use for token size variation in the fiture
				var t2Height = Number(token2.get("height"));// to use for token size variation in the fiture

				if (zDist >= 70) {
					zDist = zDist - ((t1Height + t2Height)/2);// based on medium size tokens reduce effective height difference by 1 unit as token is a cube
				}
				if (useHeight != true) zDist = 0;
				var dist = 0;
				dist = Math.floor(1.5 * Math.min(lDist, tDist) + Math.abs(lDist - tDist))-((t1Height + t2Height)/2);
				zDist = 1.118033988749895 * zDist;//scaling factor for height calculation
				dist = Math.sqrt(dist * dist + zDist * zDist);
				dist = dist * curScale / gridSize;
				dist = curScale * (Math.round(dist / curScale));// rounds to nearest scale unit eg. 5 ft.

				// var finalMessage = ("Distance from " + name1 + " to Target = " + dist + " " + curUnit);
				// sendChat("RangeFinder", '<div style="' + style + '">' + finalMessage + '</div>');
				outputResult(name1, name2, dist, curUnit);
			}

			// Euclidean Distance Calculation
			if (curDiagonalType == "pythagorean" && curGridType == "square") {
				var lDist = Math.abs(token1.get("left") - token2.get("left")) / gridSize;
				var tDist = Math.abs(token1.get("top") - token2.get("top")) / gridSize;
				var zDist = Math.abs((token1.get(dataField) - token2.get(dataField)) / curScale);//gridSize;
				var dist = 0;
				dist = Math.sqrt(lDist * lDist + tDist * tDist);
				//dist = Math.sqrt(lDist * lDist + tDist * tDist + zDist * zDist);
				var distSQ = dist;
				dist = dist * curScale;
				dist = Math.round(dist * 10) / 10;

				// var finalMessage = ("Distance between " + name1 + " and " + name2 + " = " + dist + " " + curUnit);
				// sendChat("RangeFinder", '<div style="padding:1px 3px;border: 1px solid #8B4513;background: #eeffee; color: #8B4513; font-size: 80%;">' + finalMessage + '</div>');
			  outputResult(name1, name2, dist, curUnit);
			}

			// Manhattan Distance Calculation
			if (curDiagonalType == "manhattan" && curGridType == "square") {
				var lDist = Math.abs(token1.get("left") - token2.get("left")) / gridSize;
				var tDist = Math.abs(token1.get("top") - token2.get("top")) / gridSize;
				var dist = 0;
				dist = Math.round(lDist + tDist);
				var distSQ = dist;
				dist = dist * curScale;

				// var finalMessage = ("Distance between " + name1 + " and " + name2 + " = (" + distSQ + ") " + dist + " " + curUnit);
				// sendChat("RangeFinder", '<div style="padding:1px 3px;border: 1px solid #8B4513;background: #eeffee; color: #8B4513; font-size: 80%;">' + finalMessage + '</div>');
			  outputResult(name1, name2, dist, curUnit, distSQ, true);
			}

			// Hex(V) Distance Calculation - Including distance between "Is Drawing" objects to 3 decimal places
			if (curGridType == "hex") {
				var lDist = Math.abs(token1.get("left") - token2.get("left"));
				var tDist = Math.abs(token1.get("top") - token2.get("top"));
				var dist = 0;
				lDist = lDist / 75.19856198446026; // Hex Scaling Factor
				tDist = tDist / 66.96582782426833; // Hex Scaling Factor
				dist = 1.5 * Math.min(lDist, tDist) + Math.abs(lDist - tDist);
				dist = Math.round(dist * curScale * 1000) / 1000; // Decimal point accuracy limit

				// var finalMessage = ("Distance between " + name1 + " and " + name2 + " = " + dist + " " + curUnit);
				// sendChat("RangeFinder", '<div style="padding:1px 3px;border: 1px solid #8B4513;background: #eeffee; color: #8B4513; font-size: 80%;">' + finalMessage + '</div>');
			  outputResult(name1, name2, dist, curUnit);
			}

			// Hex(H) Distance Calculation - Including distance between "Is Drawing" objects to 3 decimal places
			if (curGridType == "hexr") {
				var lDist = Math.abs(token1.get("left") - token2.get("left"));
				var tDist = Math.abs(token1.get("top") - token2.get("top"));
				var dist = 0;
				lDist = lDist / 69.58512749037783; // Hex Scaling Factor
				tDist = tDist / 79.68878998350463; // Hex Scaling Factor
				dist = 1.5 * Math.min(lDist, tDist) + Math.abs(lDist - tDist);
				dist = Math.round(dist * curScale * 1000) / 1000; // Decimal point accuracy limit

				// Deprecated
				// var finalMessage = ("Distance between "+name1+" and "+name2+" = " +dist+" "+curUnit+" left "+lDist+" top "+tDist);
				
				// var finalMessage = ("Distance between " + name1 + " and " + name2 + " = " + dist + " " + curUnit);
				// sendChat("RangeFinder", '<div style="padding:1px 3px;border: 1px solid #8B4513;background: #eeffee; color: #8B4513; font-size: 80%;">' + finalMessage + '</div>');
			  outputResult(name1, name2, dist, curUnit);
			}
		}
		else {
			if (!token1) {
				sendChat("", "Target 1 not found " + name1);

			}
			if (!token2) {
				sendChat("", "Target 2 not found " + name2);

			}
		}
	}
});
