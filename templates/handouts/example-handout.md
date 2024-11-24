<style>

/*bg */
body {
    padding: 75px 30px;
    background:
        url('https://raw.githubusercontent.com/Tougher-Together-DnD/default-game-assets/refs/heads/main/templates/handouts/images/standard/handout-page_1.png') top center no-repeat,
        url('https://raw.githubusercontent.com/Tougher-Together-DnD/default-game-assets/refs/heads/main/templates/handouts/images/standard/handout-page_3.png') bottom center no-repeat,
        url('https://raw.githubusercontent.com/Tougher-Together-DnD/default-game-assets/refs/heads/main/templates/handouts/images/standard/handout-page_2.png') center repeat-y;
    background-color: #f4f4f4;

    /* Make background images scale dynamically */
    background-size: 
        50% auto, /* Adjusts the first image to scale with the width */
        50% auto, /* Adjusts the second image to scale with the width */
        auto 100%; /* Adjusts the third image to scale with the height */
}

h1, h2, h3, h4, h5, h6 {

    font-family: 'mrs eaves', 'times new roman', times, baskerville, garamond;

    color: #34627B;

    font-variant: small-caps;

    letter-spacing: 2px;

    font-size: 42px !important;

    text-shadow: 2px 2px 4px rgba(52, 98, 123, 0.8);

    clear: both;

}

h2 {

    font-size: 28px !important;

}

h3 {

    font-size: 20px !important;

    border-bottom: 2px solid #C9AD6A;

}

h4, h5 {

    font-size: 16px !important;

}

p {

    font-family: Georgia;

    font-size: 1rem;

    margin-bottom: 1rem;

    text-indent: 20px;

}

p.first-of-type {

    font-size: 13px !important;

    margin-bottom: 0px;

    text-indent: 0px !important;

}

h1 + p::first-letter, 
h2 + p::first-letter, 
blockquote + p::first-letter {

    display: inline-block;

    font-size: 1.5rem;

    color: #ffffff;

    background-color: rgba(52, 98, 123, 0.8);

    border: 2px solid #ffffff;

    padding: 2px 6px;

    margin-right: 5px;

    font-family: "Cinzel", serif;

    text-transform: uppercase;

    border-radius: 8px;

    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);

}

ul {

    font-family: Georgia !important;

    font-size: 15px;

    list-style-position: inside;

    padding-left: 5px;

    margin-bottom: 0px;

    text-indent: -5px;

}

li {

    font-family: Georgia !important;

    font-size: 15px;

    list-style-position: inside;

    margin-bottom: 0px;

    text-indent: -5px;

}

blockquote {

  float:right;

  width: 40%;

  margin: 1.5rem !important;

  padding: 10px 10px !important;

  background-color: rgba(201, 159, 119, 0.5) !important;

  border-top: 3px solid #8655B6;

  border-bottom: 3px solid #8655B6;

  border-left: 0px solid;

  border-right: 0px solid;

  box-shadow: 1px 4px 14px #888;

}

table {

  width: 598px !important;

  border: none !important;

  border: 0px solid #000000 !important;

  border-collapse: collapse;

  margin: 1rem 0;

  font-size: 1rem;

}

th, td {

  border: 1px solid #000 !important;

  padding: 8px;

  text-align: left;

}

th {

  background-color: #34627B;

  color: #ffffff !important;

  text-transform: uppercase;

}

tr:nth-child(odd) {

  background-color: rgba(118, 197, 120, 0.2);

}

hr {

    background: url('https://raw.githubusercontent.com/Tougher-Together-DnD/default-game-assets/refs/heads/main/templates/campaign-details/images/horizontal-ruler-1.png') no-repeat top center;

    background-size: contain;

    height: 50px;

}

.ttd-top-center-image {

    margin-top: 40px;

    display: block;

    margin-left: auto;

    margin-right: auto;

}
</style>

![Main Banner](https://raw.githubusercontent.com/Tougher-Together-DnD/default-game-assets/refs/heads/main/templates/campaign-details/images/gm-introduction.png)

# The Homebrewery *V3*
Welcome traveler from an antique land. Please sit and tell us of what you have seen. The unheard of monsters, who slither and bite. Tell us of the wondrous items and and artifacts you have found, their mysteries yet to be unlocked. Of the vexing vocations and surprising skills you have seen.

---

____


***

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

