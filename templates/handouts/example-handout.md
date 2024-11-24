<style>
body {
  font-family: "Georgia", serif;
	padding: 75px 30px;
	background:
		url('https://raw.githubusercontent.com/Tougher-Together-DnD/default-game-assets/refs/heads/main/templates/handouts/images/standard/handout-page_1.png') top center no-repeat,
		url('https://raw.githubusercontent.com/Tougher-Together-DnD/default-game-assets/refs/heads/main/templates/handouts/images/standard/handout-page_3.png') bottom center no-repeat,
		url('https://raw.githubusercontent.com/Tougher-Together-DnD/default-game-assets/refs/heads/main/templates/handouts/images/standard/handout-page_2.png') center repeat-y;
	background-color: #f4f4f4;
	background-size: 
		100% auto,
		100% auto,
		auto 100%;
}

h1, h2, h3, h4, h5, h6 {
	font-family: "Cinzel", serif;
	font-variant: small-caps;
	letter-spacing: 2px;
	margin-bottom: .5rem;
	color: #34627B;
	text-shadow: 2px 2px 4px rgba(63,107,169, 0.8);
}

h3 {
    border-bottom: 2px solid #c9ad6a;
}

hr {
    border: none;
    background: url('https://raw.githubusercontent.com/Tougher-Together-DnD/default-game-assets/refs/heads/main/templates/campaign-details/images/horizontal-ruler-1.png') left top no-repeat;
    height: 32px !important;
    background-size: contain;
    margin: 0;
}

hr.style2 {
height: 2px;
background-color: #c9ad6a;
display: block;
border: 0;
}

hr.style3 {
height: 2px;
background-color: #c9ad6a;
display: block;
border: 0;
}

blockquote {
box-sizing: border-box;
box-shadow: 1px 4px 6px #888888;
background: WhiteSmoke;
border: 1px solid #333333;
width:60%;
font-family: "Patrick Hand", cursive, sans-serif;
}

p.blockquote {
font-family: "Patrick Hand", cursive, sans-serif;
}

table {
box-shadow: 1px 4px 6px #888888;
border: 1px solid #333333;
}

tbody {
font-style: italic;
}

tr:first-child {
background-color: gray;
}

tr:nth-child(even) {
background-color: white;
}

tr:nth-child(odd) {
background-color: gainsboro;
}

tr:nth-child(last) {
background-color: beige;
}

td.align-left {
border: 1px solid #333333;
text-align: left;
color: red;
}

td.align-center {
border: 1px solid #333333;
text-align: center;
color: blue;
}

td.align-right {
border: 1px solid #333333;
text-align: right;
color: green;
}

ol {
list-style-type: decimal;
}

ul {
list-style-type: square;
}

pre {
display: block;
border-radius: 3px;
background: #2b2b2b;
unicode-bidi: embed;
font-family: monospace;
color: #bababa;
white-space: pre;
}

code {
border-radius: 3px;
background: #2b2b2b;
unicode-bidi: embed;
font-family: monospace;
color: #bababa;
white-space: pre;
padding: 1px;
margin: 1px;
}

li.ordered {
font-weight: lighter;
}

li.unordered {
font-style: italic;
}

p {
font-family:inherit;
font-size:inherit;
}

img_mountain {
float: right;
width: 87px;
height: 100px;
}
</style>

![Main Banner](https://raw.githubusercontent.com/Tougher-Together-DnD/default-game-assets/refs/heads/main/templates/campaign-details/images/gm-introduction.png)

# The Homebrewery *V3*
Welcome traveler from an antique land. Please sit and tell us of what you have seen. The unheard of monsters, who slither and bite. Tell us of the wondrous items and and artifacts you have found, their mysteries yet to be unlocked. Of the vexing vocations and surprising skills you have seen.

---

____


***

##### hFrellomcv natrjm

### Homebrew D&D made easy


>> #### PDF Creation
>> PDF Printing works best in Google Chrome. If you are having quality/consistency issues, try using Chrome to print instead.
>>
>> After clicking the "Print" item in the navbar a new page will open and a print dialog will >?pop-up.
>> * Set the **Destination** to "Save as PDF"
>> * Set **Paper Size** to "Letter"
>> * If you are printing on A4 paper, make sure to have the **PRINT → {{far,fa-file}} A4 Pagesize** snippet in your brew
>> * In **Options** make sure "Background Images" is selected.
>> * Hit print and enjoy! You're done!
>>
>> If you want to save ink or have a monochrome printer, add the **PRINT → {{fas,fa-tint}} Ink Friendly** snippet to your brew!

The Homebrewery makes the creation and sharing of authentic looking Fifth-Edition homebrews easy. It uses [Markdown](https://help.github.com/articles/markdown-basics/) with a little CSS magic to make your brews come to life.

**Try it!** Simply edit the text on the left and watch it *update live* on the right. Note that not every button is visible on this demo page. Click New {{fas,fa-plus-square}} in the navbar above to start brewing with all the features!

![homebrew mug](https://i.imgur.com/hMna6G0.png)

#### V3 vs Legacy
The Homebrewery has two renderers: Legacy and V3. The V3 renderer is recommended for all users because it is more powerful, more customizable, and continues to receive new feature updates while Legacy does not. However Legacy mode will remain available for older brews and veteran users.

### Bugs, Issues, Suggestions?
- Check the [Frequently Asked Questions](/faq) page first for quick answers.
- Get help or the right look for your brew by posting on [r/Homebrewery](https://www.reddit.com/r/homebrewery/submit?selftext=true&title=%5BIssue%5D%20Describe%20Your%20Issue%20Here) or joining the [Discord Of Many Things](https://discord.gg/by3deKx).
- Report technical issues or provide feedback on the [GitHub Repo](https://github.com/naturalcrit/homebrewery/).

##### Example
| Mastery Property | Effect                                                                          | Applicable Weapons                                                  |
| ---------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| **Cleave**       | Make an additional attack against a second adjacent target.                     | Greataxe, Halberd                                                   |
| **Graze**        | Deal damage equal to your ability modifier on a missed attack.                  | Glaive, Greatsword                                                  |
| **Nick**         | Make an additional attack with your off-hand weapon during the Attack action.   | Dagger, Light Hammer, Sickle, Cane Scimitar                         |
| **Push**         | Push the target 10 feet away after a successful hit.                            | Greatclub, Pike, Warhammer, Heavy Crossbow                          |
| **Sap**          | Impose disadvantage on the target's next attack roll after a hit.               | Mace, Spear, Flail, Longsword, Morningstar, War Pick, Pistol        |
| **Slow**         | Reduce the target's speed by 10 feet until the start of your next turn.         | Club, Javelin, Light Crossbow, Sling, Whip, Longbow, Musket         |
| **Topple**       | Force the target to make a Constitution saving throw or fall prone after a hit. | Quarterstaff, Battleaxe, Lance, Maul, Trident                       |
| **Vex**          | Gain advantage on your next attack roll against the same target after a hit.    | Handaxe, Dart, Shortbow, Rapier, Shortsword, Blowgun, Hand Crossbow |

## Images
Images must be hosted online somewhere, like [Imgur](https://www.imgur.com). You use the address to that image to reference it in your brew\*.

Using *Curly Injection* you can assign an id, classes, or inline CSS properties to the Markdown image syntax.

![alt-text](https://s-media-cache-ak0.pinimg.com/736x/4a/81/79/4a8179462cfdf39054a418efd4cb743e.jpg)

<br>

<br>

