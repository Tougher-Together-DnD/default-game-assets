# New Game Checklist

## Use VTTES

[VTTES Recommended Settings](https://raw.githubusercontent.com/Tougher-Together-Gaming/default-game-assets/refs/heads/main/tutorials/images/vttes-changed-settings.png)

## Update Campaign Page

### Adjust the Token Markers

These markers will be used by players and Combat Master (api) to mark status affects on characters.

![Token Markers](https://raw.githubusercontent.com/Tougher-Together-Gaming/default-game-assets/refs/heads/main/tutorials/images/token-marker-sets.png)

### Add Game and Looking For Group Descriptions

The markdown for the game descriptions is very limited. Use the template under `templates` / `campaign-details`.

Then edit the `game-description` to a more concise version for LFG post.

### Add Looking for Group Banner

Use the Krita template to create a banner for the Game.

Once uploaded this banner will go into your library. It is more efficient to create a template game and duplicate it for players to use.

### Add Forum Posts

When adding forum posts use the markdown templates. However instead of copy-pasting the markdown, Render the markdown in the VS Code previewer and copy-paste the rendered version. This will retain images and styling in the forum post.

Some Markdown documents may contain too much data to be successfully saved in one Forum Post. Break these up into one main post and subsequent replies.

Close and make sticky the following order:
Here’s the reversed order of your list:

1. Apply Here (Only in LFG)  
2. Character Introductions (open)  
3. Dungeon Master Introduction (optional)  
4. House Rules and Modifications (In LFG As well)  
5. Important Links (closed)

### Adjust Game Settings

* Check `Allow public access to this game?`
* (Optional) Pick `Game background image`
* UnCheck `Allow players to create their own Characters?` (We will be using the Welcome API to auto create sheets for players)
* Check `Allow players to transfer Characters?` (So players can use characters from the Creation Server and their Vault; If there is a need to delete archive toon)
* Skip `Game Default Settings`
* Choose `ROLL QUERIES` = Always Roll Advantage
* Choose `WHISPER ROLLS TO GM` = Never Whisper Rolls
* Choose `AUTO DAMAGE ROLL` - Auto Roll Damage and Crits
* Check:
  * ADD DEX TIEBREAKER TO INITIATIVE
  * SHOW GLOBAL SAVE MODIFIER FIELD
  * SHOW GLOBAL SKILL MODIFIER FIELD
  * SHOW GLOBAL ATTACK MODIFIER FIELD
  * SHOW GLOBAL DAMAGE MODIFIER FIELD
* Choose `ADD CHARACTER NAME TO TEMPLATES` = On
* Choose `AMMO TRACKING` = On (Will be using the Companion API script)
* Set `BAR 3 LINK` = hp_temp

For Games using Elevation:
* Set `BAR 2 VALUE` = 0
* Set `BAR 2 MAX` = 0

*Save changes and return to Settings for the Game Default Settings*
* Game Default Settings
  * Choose Measurement = Pathfinder (This works to find more accurate distances with 3D Range)
  * (Optional) Change Grid Color to 'Grey' (third grey over)
  * (Optional) Adjust the Opacity to *Half of default*
  * Enable `dynamic lighting barriers restrict movement`
  * Set Bar 2 Values to 0/0 (this will bar is used for Elevation)
  * Check `See` for Bars 1,2,3
  * Choose Bar 2 Text Overlay 'Visible to Everyone'
* Save Defaults

## Enable and Configure API Scripts

### Style Markdown Documentation

![Style Markdown API Scripts](https://raw.githubusercontent.com/Tougher-Together-Gaming/default-game-assets/refs/heads/main/tutorials/images/style-markdown-api-scripts.png)


To enhance your Roll20 game with Markdown-styled handouts and bios, follow these steps to install and configure the necessary API scripts.

>Note:
>Ensure you have a Roll20 Pro subscription, as API script access is exclusive to Pro users. 

#### Installation Steps

1. **Access the API Scripts Section:**
   - Navigate to your game's main page on Roll20.
   - Click on the **Settings** dropdown menu.
   - Select **Mod (API) Scripts**.

2. **Create New Scripts:**
   - In the Mod (API) Scripts page, click on the **New Script** tab.
   - For each of the three scripts, perform the following:
   - **Name the Script:** Enter a descriptive name for the script.
   - **Paste the Code:** Copy the script code from the provided GitHub repository and paste it into the editor.
   - **Save the Script:** Click **Save Script** to add it to your game.

>Note:
>Repeat this process for all three scripts available at the [GitHub repository](https://github.com/Tougher-Together-Gaming/default-game-assets/tree/main/api/style-markdown-handouts).

3. **Restart the API Sandbox:**
- After adding all scripts, click the **Restart API Sandbox** button to ensure they are active.

#### Usage Instructions

1. **Create or Edit a Handout:**
   - In your Roll20 game, go to the **Journal** tab.
   - Create a new handout called `Style Sheet`
   - In the 'GM Notes' add the CSS content
     - [Style Sheet](https://github.com/Tougher-Together-Gaming/default-game-assets/blob/main/templates/handouts/ttd-default.css)
   - Once saved, the Style Sheet Handout will have an ID after `[css]()` 

2. **Apply Markdown Formatting:**
   - Create new handouts
   - In the GM Notes add your markdown code
     - At the top reference the CSS and activate the API
```
[md]
[css](-OCVFMyYfsylqoZPiW6l)

# Header 1 ...
```

3. **Save and View:**
- Save the handout.
- The content will be rendered and converted by the API script

4. Upload the Mrkdown templates or import the VTTES handouts
   1. [Github Repository](https://github.com/Tougher-Together-Gaming/default-game-assets/tree/main/handouts/quick-reference)

### 5th Edition OGL by Roll20 Companion

Use the API script to enable the Ammo and Spell tracking for the OGL 5e Sheet.

### Tokenmod

This script is used in many DM and Player Macros.

Be sure to check `Players can use --ids`

### Aura/Tint HealthColors

> WARNING
> If developing a game do not add this API. It adds Auras to token hard coded, these are then improperly saved with the token when VTTES is exported.

This script is used to remove bars and show players auras to determine health.

When in Game set the settings to ![Aura Health Colors Settings](https://raw.githubusercontent.com/Tougher-Together-Gaming/default-game-assets/refs/heads/main/tutorials/images/aura-health-colors-settings.png)

Use the custom script so that temp hp is used when damage is taken.

### Combat Master

> WARNING
> This API script is only fully functional while used in 'Jumpgate' version games.
> Suggest only implementing in player games not templates of development.

This makes running combat easier. Use the `libTokenMarkers` Script to add custom markers to Combat Tracker.

Load the Combat Master settings with recommended settings.





