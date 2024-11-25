# New Game Checklist

## Adjust the Token Markers

These markers will be used by players and Combat Master (api) to mark status affects on characters.

![Token Markers](https://raw.githubusercontent.com/Tougher-Together-DnD/default-game-assets/refs/heads/main/tutorials/images/token-marker-sets.png)

## Add Game and Looking For Group Descriptions

The markdown for the game descriptions is very limited. Use the template under `templates` / `campaign-details`.

Then edit the `game-description` to a more concise version for LFG post.

## Add Forum Posts

When adding forum posts use the markdown templates. However instead of copy-pasting the markdown, Render the markdown in the VS Code previewer and copy-paste the rendered version. This will retain images and styling in the forum post.

Some Markdown documents may contain too much data to be successfully saved in one Forum Post. Break these up into one main post and subsequent replies.

Close and make sticky the following order:
Here’s the reversed order of your list:

1. Apply Here (Only in LFG)  
2. Character Introductions (open)  
3. Dungeon Master Introduction (optional)  
4. House Rules and Modifications (In LFG As well)  
5. Important Links (closed)

## Enable and Configure API Scripts

***

### Style Markdown Documentation

![Style Markdown API Scripts](https://raw.githubusercontent.com/Tougher-Together-DnD/default-game-assets/refs/heads/main/tutorials/images/style-markdown-api-scripts.png)


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
>Repeat this process for all three scripts available at the [GitHub repository](https://github.com/Tougher-Together-DnD/default-game-assets/tree/main/api/style-markdown-handouts).

3. **Restart the API Sandbox:**
- After adding all scripts, click the **Restart API Sandbox** button to ensure they are active.

#### Usage Instructions

1. **Create or Edit a Handout:**
   - In your Roll20 game, go to the **Journal** tab.
   - Create a new handout called `Style Sheet`
   - In the 'GM Notes' add the CSS content
     - [Style Sheet](https://github.com/Tougher-Together-DnD/default-game-assets/blob/main/templates/handouts/ttd-default.css)
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
   1. [Github Repository](https://github.com/Tougher-Together-DnD/default-game-assets/tree/main/handouts/quick-reference)

***

### 5th Edition OGL by Roll20 Companion

Use the API script to enable the Ammo and Spell tracking for the OGL 5e Sheet.

***

### Tokenmod

This script is used in many DM and Player Macros.

***

### Aura/Tint HealthColors

This script is used to remove bars and show players auras to determine health.

## Use VTTES

[VTTES Recommended Settings]()

