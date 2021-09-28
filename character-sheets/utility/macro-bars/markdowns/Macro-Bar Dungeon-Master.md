<!-- Macro Bar: Dungeon-Master -->

<!-- Reference URLS -->
[Character Sheet]: https://github.com/Tougher-Together-DnD/default-game-assets/blob/main/macros/Macro%20Bar%20Dungeon-Master.json

<!-- API URLs -->
[CarryTokens-URL]: https://github.com/Roll20/roll20-api-scripts/tree/master/CarryTokens  
[CombatMaster-URL]: https://github.com/Roll20/roll20-api-scripts/tree/master/CombatMaster  
[CombatMaster-Config-URL]: https://github.com/Tougher-Together-DnD/common-assets/blob/main/Roll20%20Game%20Files/api-scripts/configs/combat-master-config.json
[libTokenMarkers-URL]: https://github.com/Roll20/roll20-api-scripts/tree/master/libTokenMarkers
[Magic Store-URL]: https://github.com/Tougher-Together-DnD/default-game-assets/blob/main/api-scripts/Magic%20Store%20v2.0.0.js
[Multi-World Calendar v6.2.0-URL]: https://github.com/Tougher-Together-DnD/default-game-assets/blob/main/api-scripts/Multi-World%20Calendar%20v6.2.0.js
[RaiseHand-URL]: https://github.com/Roll20/roll20-api-scripts/tree/master/HandsUp
[RecursiveTables-URL]: https://github.com/Roll20/roll20-api-scripts/tree/master/RecursiveTable
[Teleport-URL]: https://github.com/Roll20/roll20-api-scripts/tree/master/Teleport
[TokenMod-URL]: https://github.com/Roll20/roll20-api-scripts/tree/master/TokenMod

<!-- External Tools -->
[Github-URL]: https://github.com/Tougher-Together-DnD
[Firefox-URL]: https://www.mozilla.org
[VTTES Enhancement Suite-URL]: https://addons.mozilla.org/en-US/firefox/addon/roll20-enhancement-suite/

<style>
/* CSS style for NaturalCrit Homebrew render. */
.phb#p1{ text-align:left; }
.phb#p1:after{ display:none; }
.phb p+p { margin-top:.2em; }
.phb blockquote { margin-top:1em; margin-bottom:2em; }
.phb h1, .phb h2, .phb h3, .phb h4, sup, span { color:#006699; }
span { font-weight:bold; }
ul li { line-height:2; }
.phb table tbody tr td { border:1px solid #1C6EA4; }
th:empty { display:none; }
</style>

<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" alt="" height="1">

### Macros
*Note: Macros to be shared between Players and Dungeon Masters, or are intended as universal token actions, should be loaded into game under "Collections" tab.*

* Ability-Check <span>*</span>
* Apply-Conditions-Short <sup>9</sup>
* Apply-Spells-Short <sup>9</sup>
* Apply-Status-Short <sup>9</sup>
* Calendar <sup>6</sup>
* Carry-Tokens-Menu <sup>1</sup>
* Combat-Master-Menu <sup>2</sup> <sup>3</sup> <sup>4</sup>
* Combat-Master-Next-Turn <sup>2</sup>
* Damage-Target <sup>9</sup>
* Damage-Six-Targets <sup>9</sup>
* Heal-Target <sup>9</sup>
* Magic-Store-Menu <sup>5</sup>
* Make-Default-Token <sup>9</sup>
* NPC-Info
* PC-Info
* Quick-Calculator
* RaiseHand <sup>7</sup>
* Resize-Full <sup>9</sup>
* Resize-Half <sup>9</sup>
* Roll-Initiative
* Saving-Throw <span>*</span>
* Show-URL-Image
* Skill-Check <span>*</span>
* Special-Effect
* Teleport-Menu <sup>8</sup>
* Toggle-Talking-To-Myself
* Whisper-Target-Token

<span>*</span> Copy/paste macro text from [Failsafe][Failsafe-URL] if macro breaks after transfer.

#### Required API Scripts: 
<span>1</span> [CarryTokens][CarryTokens-URL]  
<span>2</span> [CombatMaster][CombatMaster-URL]  
<span>3</span> [libTokenMarkers][libTokenMarkers-URL]  
<span>4</span> [CombatMaster Config JSON][CombatMaster-Config-URL]  
<span>5</span> [Magic Store][Magic Store-URL] *Custom download*  
<span>6</span> [Multi-World Calendar v6.2.0][Multi-World Calendar v6.2.0-URL] *Custom download*  
<span>7</span> [RaiseHand][RaiseHand-URL]  
<span>8</span> [Teleport][Teleport-URL]  
<span>9</span> [TokenMod][TokenMod-URL]  

### Footnotes

1. [VTTES JSON Character Sheet][Character Sheet]

<!-- GM Notes --> 
### About
Using a character sheet to manage macros is a [Stupid Roll20 Trick](https://app.roll20.net/forum/post/5899495/stupid-roll20-tricks-and-some-clever-ones/?pageforid=7605679#post-7605679). Tools such as the transmogrifier only allow moving pages, characters, decks, handouts , roll tables, and jukebox playlists. However, macros can not be moved.

It is a tedious error prone process to copy and paste macro code between games. Unless you use some ingenuity or tools like the [Firefox][Firefox-URL] addon, [VTTES Enhancement Suite-URL][VTTES Enhancement Suite-URL].  

#### Pros:
* Manage catagories of macros separated into different character sheets.
* Easily move macros between games.

#### Cons:
* Character sheets are resource intensive. They have many fields that will go unused with this technique. A lot of characters may negatively impact Roll20 performance.
* Selecting ☐ *Show as Token Action* will only show a macro button for a token representing this character sheet. Not for all tokens like macros in the game-wide *Collection* tab. 
* If you want Players to use these macros, they need to be added to "Can Be Edited and Controlled By" permission list. They can inadvertently or purposefully alter the macros.

### Setup
Create a character sheet. Under its *Attributes and Abilities*  tab add macros.

When doing nested macros, be sure to reference other macros in the same character sheet as ~Macro-Name. As opposed to #Macro-Name for game-wide accessible macros stored under the *Collection* tab.

Edit the character sheet by adding the appropriate users in the "In Player's Journal" and "Can Be Edited and Controlled By" fields. This does not have to be done for the GM, as they have permissions to all assets.

### Usage
When you want to copy all your macros to a new game, move or import this character sheet.

#### Free VTT Move
This technique can be used for free, even with games that have different owners, just swap the JSON file.

1. Using [VTTES Enhancement Suite-URL][VTTES Enhancement Suite-URL] export the character sheet as JSON to your local hard drive.

1. In the new game create a character to hold your macros. Using VTT go to the "Export & Overwrite" tab, there Overwrite the new character with your JSON file. 

#### Character Vault Move
If the owner of the game does not have a Roll20 subscription, their game will have limited vault access.

1. From the Campaign Page, under "Game Settings" they can set *Allow players to import their own Characters?* to "Yes".
   
1. Then a subscribed player can import the Macro Character as they do for any characters.

#### Transmogrifier Move
And finally, the easiest most intuitive move is with the transmogrifier. This only works if you own both games.
