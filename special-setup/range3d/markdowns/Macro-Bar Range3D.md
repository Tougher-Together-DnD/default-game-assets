<!-- Macro-Bar: Range3D -->
<!-- default-game-assets -->
<!-- special-setup -->
<!-- range3d -->

<!-- Reference URLS -->
[Tougher Together Repo]: https://github.com/Tougher-Together-DnD "Tougher Together DnD"
[Repo Files]: https://github.com/Tougher-Together-DnD/default-game-assets/tree/main/special-setup/range3d "Tougher Together Files"

[Collection Icon]: https://raw.githubusercontent.com/Tougher-Together-DnD/default-game-assets/main/character-sheets/macro-bars/images/menu-icon.png#icon
[Avatar]: https://raw.githubusercontent.com/Tougher-Together-DnD/default-game-assets/main/character-sheets/utility/macro-bars/images/template-avatar.webp
[Screenshot]: https://raw.githubusercontent.com/Tougher-Together-DnD/default-game-assets/main/character-sheets/macro-bars/images/macro-screenshot.png
[Range3D-URL]: https://github.com/Tougher-Together-DnD/default-game-assets/blob/main/special-setup/range3d/Range3D%20Custom.js

<!-- External Tools -->
[Github-URL]: https://github.com/Tougher-Together-DnDLRN2live@gain$22
 
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

/* css for markdown */
img[src*="#icon"] { vertical-align:middle; width:2.5em; height:2.5em; }
img[src*="#avatar"] { vertical-align:middle; width:250px; height:250px; margin:15px; float:left; }
img[src*="#screenshot"] { vertical-align:middle; width:800px; }
</style>

# Range3D

## Macros*
*Note: Macros intended to be universal token actions should be loaded into the game under *Collections* (![][Collection Icon]) tab*

* Get-Range \* <sup>1</sup>

***Required API Scripts:***  
<span>\*</span> Requires special setup   
<span>1</span> [Range3D Custom][Range3D-URL] *Custom Download*

<br>

## About
Using this API Script and a bit of work, you can add a third dimension to your games. By storing elevation and depth information in Bar 3, tokens can be compared to get accurate ranges between them.

For this to calculate the distances properly, the Map Settings for "Measurement" must be "Pathfinder/3.5 Compatible."

<br>

## Usage
If the macros are not available as a token action, a player can use the macros from this character sheet.

1. Go under the *Collections* (![][Collection Icon]) tab and turn on macro bar.
1. This will display a space at the bottom of the window under player names.
1. Open this character sheet, go to *Attributes and Abilities*, and select *Show in Macro Bar*.
1. You can right click on the bar to get options for renaming and changing its color.

![][Screenshot]

Select your token as the source and click on the macro. It will ask for target token to get range to.

<br>

## Footnotes
1. [Source Files][Repo Files]

<!-- DM Notes -->
## Setup
1. Upload the API Script to game. [Range3D script][Roll20 API script] is a modded version that takes the value of Bar 3 to perform the math on. It then converts distances into the map units. Bar 3 will represent a tokens elevation or depth in numerical units

1. Using the "Game Settings" page set "Game Default Settings" tokens to have Bar 3 0/0 "Visible to Everyone". Also set the "Default Sheet Settings" to make bar 3 min and max values 0. Creatures grabbed from the compendium will have the 3rd bar automatically setup when dragged into game. 

1. Launch the game and use the "Apply Default Settings" to all the layers. This will change every token on any of your maps to begin displaying the third bar as desired.

1. Unfortunately, Characters in Modules, or Addons, when dropped on the map will continue to produce the character sheets default token. This is the most tedious step. Find the token page and go through each token adding the 3rd bar as desired. Then be sure to make it the default token. This can be made easier to perform by opening the character sheets up and using the [VTT Enhancement Suite][VTT Enhancment Suite-URL] to change the token.

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
