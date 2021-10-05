<!-- Macro-Bar: Players -->
<!-- default-game-assets -->
<!-- utility -->
<!-- macro-bars -->

<!-- Reference URLS -->
[Tougher Together Repo]: https://github.com/Tougher-Together-DnD "Tougher Together DnD"
[Repo Files]: https://github.com/Tougher-Together-DnD/default-game-assets/tree/main/character-sheets/utility/macro-bars "Tougher Together Files"

[Collection Icon]: https://raw.githubusercontent.com/Tougher-Together-DnD/default-game-assets/main/character-sheets/macro-bars/images/menu-icon.png#icon
[Avatar]: https://raw.githubusercontent.com/Tougher-Together-DnD/default-game-assets/main/character-sheets/utility/macro-bars/images/menu-avatar.webp
[Screenshot]: https://raw.githubusercontent.com/Tougher-Together-DnD/default-game-assets/main/character-sheets/macro-bars/images/macro-screenshot.png#screenshot
[Roll20 Forum Post]: https://app.roll20.net/forum/post/7969855/speak-in-different-languages/?pagenum=1

<!-- External Tools -->
[Github-URL]: https://github.com/Tougher-Together-DnD
[Firefox-URL]: https://www.mozilla.org
[VTTES Enhancement Suite-URL]: https://addons.mozilla.org/en-US/firefox/addon/roll20-enhancement-suite/

<!-- API URLs -->
[Failsafe-URL]: https://raw.githubusercontent.com/Tougher-Together-DnD/default-game-assets/main/collections/macros/failsafe-ability-saving-skills.txt
[CarryTokens-URL]: https://github.com/Roll20/roll20-api-scripts/tree/master/CarryTokens  
[CombatMaster-Custom-URL]: https://github.com/Tougher-Together-DnD/default-game-assets/blob/main/special-setup/combat-master/Combat%20Master%20Custom.js  
[CombatMaster-Config-URL]: https://raw.githubusercontent.com/Tougher-Together-DnD/default-game-assets/main/special-setup/combat-master/combat-master-config.txt
[libTokenMarkers-URL]: https://github.com/Roll20/roll20-api-scripts/tree/master/libTokenMarkers
[Multi-World Calendar v6.2.0-URL]: https://github.com/Tougher-Together-DnD/default-game-assets/blob/main/api-scripts/Multi-World%20Calendar%20v6.2.0.js
[RaiseHand-URL]: https://github.com/Roll20/roll20-api-scripts/tree/master/HandsUp
[Teleport-URL]: https://github.com/Roll20/roll20-api-scripts/tree/master/Teleport
[TokenMod-URL]: https://github.com/Roll20/roll20-api-scripts/tree/master/TokenMod

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

/* css for markdown */
img[src*="#icon"] { vertical-align:middle; width:2.5em; height:2.5em; }
img[src*="#avatar"] { vertical-align:middle; width:250px; height:250px; margin:15px; float:left; }
img[src*="#screenshot"] { vertical-align:middle; width:800px; }
</style>

# Players

## Macros
*Note: Macros to be shared between Players and Dungeon Masters, or are intended as universal token actions, should be loaded into game under "Collections" tab.*

* Ability-Check <span>*</span>
* Calendar <sup>5</sup>
* Carry-Tokens-Menu <sup>1</sup>
* Combat-Master-Menu <sup>2</sup> <sup>3</sup> <sup>4</sup>
* Heal-Target <sup>7</sup>
* PC-Info
* Quick-Calculator
* RaiseHand <sup>6</sup>
* Resize-Double <sup>7</sup>
* Resize-Half <sup>7</sup>
* Roll-Initiative
* Saving-Throw <span>*</span>
* Show-URL-Image
* Skill-Check <span>*</span>
* Special-Effect
* Toggle-Talking-To-Myself
* Whisper-DM
* Whisper-Target-Token

<span>*</span> Copy/paste macro text from [Failsafe][Failsafe-URL] if macro breaks after transfer.

***Required API Scripts:***  
<span>1</span> [CarryTokens][CarryTokens-URL]  
<span>2</span> [CombatMaster][CombatMaster-Custom-URL]  
<span>3</span> [libTokenMarkers][libTokenMarkers-URL]  
<span>4</span> [CombatMaster Config JSON][CombatMaster-Config-URL]  
<span>5</span> [Multi-World Calendar][Multi-World Calendar v6.2.0-URL]  
<span>6</span> [RaiseHand][RaiseHand-URL]  
<span>7</span> [TokenMod][TokenMod-URL]  

<br>

## Usage
If the macros are not available as a token action, a player can use the macros from this character sheet.

1. Go under the *Collections* (![][Collection Icon]) tab and turn on macro bar.
2. This will display a space at the bottom of the window under player names.
3. Open this character sheet, go to *Attributes and Abilities*, and select *Show in Macro Bar*.
4. You can right click on the bar to get options for renaming and changing its color.

![][Screenshot]

<br>

## Footnotes
1. [Source Files][Repo Files]

<!-- DM Notes -->
## Setup
Load the APIs required for the macros you and your players intend to use. Some macros work without a subscription.

<br>

## Macro-Bar character sheets
Create a character sheet. Under its *Attributes and Abilities*  tab add macros.

When doing nested macros, be sure to reference other macros in the same character sheet as ~Macro-Name. As opposed to #Macro-Name for game-wide accessible macros stored under the *Collections* (![][Collection Icon]) tab.

Edit the character sheet by adding the appropriate users in the "In Player's Journal" and "Can Be Edited and Controlled By" fields. This does not have to be done for the GM, as they have permissions to all assets.

### Free VTTES Move
This technique can be used for free, even with games that have different owners, just swap the JSON file.

1. Using the [Firefox][Firefox-URL] addon, [VTTES Enhancement Suite][VTTES Enhancement Suite-URL] a DM can export macros under *Collections* (![][Collection Icon]) as a JSON file.

2. In the new game create a character to hold your macros. Using VTTES go to the "Export & Overwrite" tab, there Overwrite the new character with your JSON file. 

### Character Vault Move
If the owner of the game does not have a Roll20 subscription, their game will have limited vault access.

1. From the Campaign Page, under "Game Settings" they can set *Allow players to import their own Characters?* to "Yes".
1. Then a subscribed player can import the Macro Character as they do for any vault characters.

### Transmogrifier Move
And finally, the easiest most intuitive way is with the transmogrifier. This only works if you create both games.