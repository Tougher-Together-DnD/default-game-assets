/*!
		version: 0.0.1
		author: Clinton Mulligan
		license: BSD 3-Clause License
		Copyright (c) 2021, Clinton Mulligan. All rights reserved.
		https://raw.githubusercontent.com/Tougher-Together-DnD/common-assets/main/LICENSE.md
!*/

/* eslint-disable no-undef */
var onlyDoors = onlyDoors || (function initOnlyDoors() {

	let debug = true;
	let lockStatusmarker = "padlock";

	let message = {};
	let queue = [];

	// ANCHOR Lib Functions

	const isDoor = (strTokenID) => {
		let obj = getObj("graphic", strTokenID);
		let strPlayerName = message.who;

		if (debug) {
			log(`isDoor: Checking if token is a door... using ID ${strTokenID} found ${JSON.stringify(obj)}`);
		}

		let blnCorrectLayer = (obj.get("layer") === "objects") ? true : false;
		let strBarValue = obj.get("bar3_value").toString();

		if (blnCorrectLayer && strBarValue.startsWith("-")) {

			if (debug) {
				log(`isDoor: Selected token is likely a Door.`);
			}

			return true;
		} else {

			if (debug) {
				log(`isDoor: Selected token is NOT a Door.`);
			}

			sendChat("", `/w ${strPlayerName} That is not a door.`);
			return false;
		}
	};

	const toggleDoors = (door, twin, path) => {

		if (debug) {
			log(`toggleDoors: Swapping layers of door tokens.`);
			log(`Door: ${door}`);
			log(`Twin: ${twin}`);
			log(`Path: ${path}`);
		}

		door.set({ layer: ("objects" === door.get("layer") ? "gmlayer" : "objects") });
		twin.set({ layer: ("objects" === twin.get("layer") ? "gmlayer" : "objects") });
		path.set({ layer: ("walls" === path.get("layer") ? "gmlayer" : "walls") });

		// Perform change effect.
		let strAction = door.get("bar2_max");
		if (strAction != "") {
			sendChat("", `${strAction}`);
		}
		return;
	};

	const getDoorInfo = (strTokenID) => {

		if (debug) {
			log(`getDoorInfo: From selected tokens, producing 'info' of door objects and states...`);
		}

		let info = {};
		info.objDoor = getObj("graphic", strTokenID);

		let arrTokenIDs = info.objDoor.get("bar3_value").split(/\s+/);

		info.objPath = getObj("path", arrTokenIDs[0]);
		info.objTwin = getObj("graphic", arrTokenIDs[1]);
		info.strState = arrTokenIDs[2];

		let strMirrorDoorID = (info.objDoor.get("bar1_value") == "teleportpad") ? info.objDoor.get("bar1_max") : info.objTwin.get("bar1_max");

		// ANCHOR getDoorInfo check for Mirror Doors.
		if (strMirrorDoorID != "") {

			if (debug) {
				log(`getDoorInfo: Finding Mirror Doors.`);
			}

			info.objMirrorDoor = getObj("graphic", strMirrorDoorID);

			let strPathID = info.objMirrorDoor.get("bar3_value").split(/\s+/)[0];
			let strTwinID = info.objMirrorDoor.get("bar3_value").split(/\s+/)[1];

			info.objMirrorTwin = getObj("graphic", strTwinID);
			info.objMirrorPath = getObj("path", strPathID);

		} else {
			info.objMirrorDoor = "";
			info.objMirrorTwin = "";
			info.objMirrorPath = "";
		}

		if (debug) {
			log(`getDoorInfo: Constructed and returning 'info': ${JSON.stringify(info)}`);
		}

		return info;
	};

	// ANCHOR Top Level Functions.
	const lockUnlockDoors = (tokens) => {

		tokens.map(function evalSelectedTokensOpenCLoseDoors(obj) {

			if (isDoor(obj._id)) {

				let objDoorInfo = getDoorInfo(obj._id);

				/*
				** info object from getDoorInfo() **
				{
				objDoor:[object],
				objTwin:[object],
				objPath:[object],
				strState: "Open" or "Closed",
				objMirrorDoor:"" or [object],
				objMirrorTwin: "" or [object],
				objMirrorPath: "" or [object]
				}
				*/

				if (debug) {
					log(`lockUnlockDoors: Received Door info as ${JSON.stringify(objDoorInfo)}`);
				}

				let strEffectedDoors = `${objDoorInfo.objDoor.get("_id")}`;

				if (objDoorInfo.objMirrorDoor !== "") {
					let strEffectedDoors = `${objDoorInfo.objDoor.get("_id")} ${objDoorInfo.objMirrorDoor.get("_id")}`;
				}

				let strPlayerID = message.playerid;
				let strPlayerName = message.who;
				let keyHolder = (objDoorInfo.objDoor.get("controlledby").startsWith(",")) ? objDoorInfo.objDoor.get("controlledby").slice(1) : objDoorInfo.objDoor.get("controlledby")
				let isLocked = objDoorInfo.objDoor.get("statusmarkers").split(",")
					.includes(lockStatusmarker);

				if (objDoorInfo.strState == "Open") {
					sendChat("", `/w ${strPlayerName} Door must be closed before locking.`);
					return;
				}

				// See if player has control to lock unlock.

				log(strPlayerID + " holder: " + keyHolder)

				if (isLocked && strPlayerID !== keyHolder && !(strPlayerName.includes("(GM)"))) {
					sendChat("", `/w ${strPlayerName} You don't have the key to that door.`);
					return;
				}

				if (!isLocked ) {
					// Lock Door
					sendChat("", `!token-mod --ignore-selected --ids ${strEffectedDoors} --set statusmarkers|${lockStatusmarker}`);

					log(`GMname: ${strPlayerName.includes("(GM)")} with name: ${strPlayerName}`);
					if (strPlayerName.includes("(GM)")) {
						sendChat("", `!token-mod --ignore-selected --ids ${strEffectedDoors} --set controlledby||+${strPlayerID}`);
					} else {
						// sendChat( "OnlyDoors", `/w ${strPlayerName} You (as ${strPlayerName}) locked a door.` );
						sendChat("", `!token-mod --ignore-selected --ids ${strEffectedDoors} --set controlledby||+${strPlayerID}`);
					}
				} else {
					sendChat("", `!token-mod --ignore-selected --ids ${strEffectedDoors} --set statusmarkers|-${lockStatusmarker}`);
					sendChat("", `!token-mod --ignore-selected --ids ${strEffectedDoors} --set controlledby|`);

				}

				// !token-mod --ignore-selected --ids -MkLm02ZaDWqQ3sYWZrf -MkLm06CBmybGkoNmVel --[[1t[Magic-Portal]]]

				// Perform change effect.
				let strAction = objDoorInfo.objDoor.get("bar3_max");
				if (strAction != "") {
					sendChat("", `${strAction}`);
				}
			}

		});

		return;
	};

	const openCloseDoors = (tokens) => {

		tokens.map(function evalSelectedTokensOpenCLoseDoors(obj) {

			if (isDoor(obj._id)) {

				let objDoorInfo = getDoorInfo(obj._id);

				/*
				** info object from getDoorInfo() **
				{
				objDoor:[object],
				objTwin:[object],
				objPath:[object],
				strState: "Open" or "Closed",
				objMirrorDoor:"" or [object],
				objMirrorTwin: "" or [object],
				objMirrorPath: "" or [object]
				}
				*/

				let strPlayerName = message.who;

				if (debug) {
					log(`openCloseDoors: Received Door info as ${JSON.stringify(objDoorInfo)}`);
				}

				// See if door is locked.
				let isLocked = objDoorInfo.objDoor.get("statusmarkers").split(",")
					.includes(lockStatusmarker);

				if (isLocked) {
					sendChat("", `/w ${strPlayerName} That Door is locked!`);
					return;
				}

				toggleDoors(objDoorInfo.objDoor, objDoorInfo.objTwin, objDoorInfo.objPath);

				if (objDoorInfo.objMirrorDoor != "") {
					toggleDoors(objDoorInfo.objMirrorDoor, objDoorInfo.objMirrorTwin, objDoorInfo.objMirrorPath);
				}
			}
		});
		return;
	};

	const linkDoors = (tokens) => {
		let parts = {};

		if (debug) {
			log(`linkDoors: Configuring Doors from selected tokens...`);
		}

		// Make sure three items are selected.
		if (tokens.length > 3) {
			sendChat("OnlyDoors", "/w gm You have selected too many things, looking among them for what I need.");

		} else if (tokens.length < 3) {

			sendChat("OnlyDoors", "/w gm You have not selected enough things.");
			return;
		}

		// Identify and get the ID for each each type of selected item.
		tokens.map(function makeDoorLinks(token) {
			let obj = getObj(token._type, token._id);

			switch (true) {
				case (obj.get("type") === "graphic" && obj.get("bar3_value") === "DoorOpen"):
					parts.DoorOpen = obj;
					break;

				case (obj.get("type") === "graphic" && obj.get("bar3_value") === "DoorClosed"):
					parts.DoorClosed = obj;
					break;

				case (obj.get("type") === "path"):
					log("Path object:" + JSON.stringify(obj));
					parts.Path = obj;
					break;
			}
		});

		if (parts.DoorOpen && parts.DoorClosed && parts.Path) {

			parts.DoorOpen.set({
				bar3_value: `${parts.Path.id} ${parts.DoorClosed.id} Open`,
				layer: "objects"
			});

			parts.DoorClosed.set({
				bar3_value: `${parts.Path.id} ${parts.DoorOpen.id} Closed`,
				layer: "gmlayer"
			});

			parts.Path.set({ layer: "gmlayer" });

		} else {
			sendChat("OnlyDoors", "/w GM Couldn't find required pieces:<ul>"
				+ (parts.DoorOpen ? "" : "<li>A token with bar3_value of \"DoorOpen\".</li>")
				+ (parts.DoorClosed ? "" : "<li>A token with bar3_value of \"DoorClosed\".</li>")
				+ (parts.Path ? "" : "<li>A path for Dynamic Light Layer.</li>")
				+ "</ul>"
			);
		}

		return;
	};

	// ANCHOR Command to Function mapping.
	let mapCommand2Function = {
		"link": function (args) {
			linkDoors(args[0]);
		},
		"open-close": function (args) {
			openCloseDoors(args[0]);
		},
		"lock-unlock": function (args) {
			lockUnlockDoors(args[0]);
		}
	};

	// ANCHOR API Handlers
	const msgHandler = (msg) => {

		// Ignore chat messages not relevant to this script.
		/*
		if ( !(msg.type === "api" && msg.content.includes("!OnlyDoors") && "selected" in msg )) {
			return;
		}
		*/

		if (!(msg.type === "api" && msg.content.includes("!OnlyDoors"))) {
			return;
		}

		if (debug) {
			log(`msgHandler: Processing chat message...${JSON.stringify(msg)}`);
		}

		let commands = msg.content.split("--").map(Function.prototype.call, String.prototype.trim)
		commands.shift();

		// ANCHOR assign current state variables.
		message = msg;
		queue = commands;

		// let tokens = msg.selected;
		let tokens = [{ "_id": `${commands.shift()}`, "_type": "graphic" }];

		log(tokens)

		queue.map(function (element) {
			let arrSegments = element.split(" ");
			let strCommand = arrSegments[0];
			let arrArguments = (arrSegments.length <= 1) ? "" : arrSegments[1].split("|");

			return mapCommand2Function[strCommand]([tokens, ...arrArguments]);
		});
	};

	const RegisterEventHandlers = () => {
		on("chat:message", msgHandler);
	};

	return { startup: RegisterEventHandlers };

}());

// ANCHOR On load of Game.
on("ready", () => {
	onlyDoors.startup();
});
