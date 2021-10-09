<!-- Macro-Bar: Speak Languages -->
<!-- default-game-assets -->
<!-- special-setup -->
<!-- speak-languages -->

<!-- Reference URLS -->
[Tougher Together Repo]: https://github.com/Tougher-Together-DnD "Tougher Together DnD"
[Repo Files]: https://github.com/Tougher-Together-DnD/default-game-assets/tree/main/special-setup/speak-languages "Tougher Together Files"

[Collection Icon]: https://raw.githubusercontent.com/Tougher-Together-DnD/default-game-assets/main/character-sheets/macro-bars/images/menu-icon.png#icon
[Avatar]: https://raw.githubusercontent.com/Tougher-Together-DnD/default-game-assets/main/character-sheets/utility/macro-bars/images/menu-avatar.webp
[Screenshot]: https://raw.githubusercontent.com/Tougher-Together-DnD/default-game-assets/main/special-setup/speak-languages/images/screenshot.gif#screenshot
[Roll20 Forum Post]: https://app.roll20.net/forum/post/7969855/speak-in-different-languages/?pagenum=1

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

/* css for markdown */
img[src*="#icon"] { vertical-align:middle; width:2.5em; height:2.5em; }
img[src*="#avatar"] { vertical-align:middle; width:250px; height:250px; margin:15px; float:left; }
img[src*="#screenshot"] { vertical-align:middle; width:800px; }
</style>

# Speak Languages

## Macros*
*Note: Macros intended to be universal token actions should be loaded into the game under *Collections* (![][Collection Icon]) tab*

* Speak-Tongues
* Speak-Tongues-DM

***Required API Scripts***  
<span>*</span> Requires special setup

<br>

## About
With this [Roll20 Trick][Roll20 Forum Post], players can roleplay speaking in different languages.

### Languages
Your race indicates the Languages your character can speak by default, and your Background might give you access to one or more additional Languages of your choice. Note these Languages on your character sheet.

Choose your Languages from the Standard Languages table, or choose one that is Common in your campaign. With your DM’s permission, you can instead choose a language from the Exotic Languages table or a Secret language, such as thieves’ cant or the tongue of druids.

Some of these Languages are actually families of Languages with many dialects. For example, the Primordial language includes the Auran, Aquan, Ignan, and Terran dialects, one for each of the four elemental planes. Creatures that speak different dialects of the same language can communicate with one another. Get with your DM to see if your language can be considered a Dialect of another.

### Supported Languages
*The Following Languages have been loaded into the game for your characters to use.*

* [Language: Abyssal]
* [Language: Celestial]
* [Language: Dark-Speech]
* [Language: Deep-Speech]
* [Language: Draconic]
* [Language: Druidic]
* [Language: Dwarvish]
* [Language: Elvish]
* [Language: Giant]
* [Language: Gnomish]
* [Language: Goblin]
* [Language: Halfling]
* [Language: Infernal]
* [Language: Kraul]
* [Language: Leonin]
* [Language: Loxodon]
* [Language: Minotaur]
* [Language: Orc]
* [Language: Primordial]
* [Language: Sylvan]
* [Language: Thieves-Cant]
* [Language: Undercommon]
* [Language: Vedalken]  

<br>

## Usage
On your character sheet add an attribute to your character sheet called "known_languages". If your character can read/write Dwarvish, Elvish, and Giant; the *known_languages* would have a value of:
```
Dwarvish|Elvish|Giant
```
*Each language is separated by a Vertical Bar* ("|").

If the macros are not available as a token action, a player can use the macros from this character sheet.

1. Go under the *Collections* (![][Collection Icon]) tab and turn on macro bar.
1. This will display a space at the bottom of the window under player names.
1. Open this character sheet, go to *Attributes and Abilities*, and select *Show in Macro Bar*.
1. You can right click on the bar to get options for renaming and changing its color.

![][Screenshot]

<br>

## Footnotes
1. [Source Files][Repo Files]

<!-- DM Notes -->
## Setup
This setup works for games without a Roll20 subscription.

A roll table consisting of fake words for each language has to be created.
A character sheet for each language needs to be created.

On this Macro-Bar character sheet add an attribute "known_languages" with a value of:

```
Abyssal|Celestial|Dark-Speech|Deep-Speech|Draconic|Druidic|Dwarvish|Elvish|Giant|Gnomish|Goblin|Halfling|Infernal|Kraul|Leonin|Loxodon|Minotaur|Orc|Primordial|Sylvan|Thieves-Cant|Undercommon|Vedalken
```

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