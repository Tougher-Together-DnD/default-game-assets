# TokenMod v0.8.78

TokenMod provides an interface for setting almost all adjustable properties of a token.

## Commands

```plaintext
!token-mod <--help | --rebuild-help | --help-statusmarkers | --ignore-selected | --current-page | --active-pages | --api-as | --config | --on | --off | --flip | --set | --move | --report | --order> <parameter> [<parameter> ...] ... [--ids | <token_id> | [<token_id> ...]]
```

This command takes a list of modifications and applies them to the selected tokens (or tokens specified with `--ids` by a GM or player depending on configuration).

### Notes:
- Each `--option` can be specified multiple times and in any order.
- Use `{{` and `}}` to span multiple lines for clarity:
  ```plaintext
  !token-mod {{
    --on
      flipv
      fliph
    --set
      rotation|180
      bar1|[[8d8+8]]
      light_radius|60
      light_dimradius|30
      name|"My bright token"
  }}
  ```

### Available Options
- `--help`: Displays help.
- `--rebuild-help`: Recreates the help handout in the journal.
- `--help-statusmarkers`: Outputs the list of known status markers to chat.
- `--ignore-selected`: Prevents modifications to selected tokens (only modifies tokens passed with `--ids`).
- `--current-page`: Modifies tokens on the caller's current page.
- `--active-pages`: Modifies tokens on pages where there is a player or the GM.
- `--api-as <playerid>`: Sets the player ID for the API.
- `--config`: Sets configuration options.
- `--on`: Turns on specified parameters (see Boolean Arguments below).
- `--off`: Turns off specified parameters (see Boolean Arguments below).
- `--flip`: Toggles specified parameters (see Boolean Arguments below).
- `--set`: Sets key-value pairs (e.g., `bar1|50`).
- `--move`: Moves tokens in a specified direction.
- `--order`: Changes token ordering (`tofront`, `toback`, etc.).
- `--report`: Displays a report of changes to each token.
- `--ids`: Specifies token IDs to modify.

---

## Boolean Arguments

The `--on`, `--off`, and `--flip` options apply to properties with true/false values. Examples:

```plaintext
!token-mod --on showname light_hassight --off isdrawing --flip flipv fliph
```

### Available Boolean Properties
- `showname`
- `show_tooltip`
- `showplayers_name`
- `light_hassight`
- `isdrawing`
- `flipv`
- `fliph`

Set booleans with `--set` using `true` or `false` values:
```plaintext
!token-mod --set showname|yes isdrawing|no
```

---

## Token Specification

Tokens can be modified by selection or using `--ids`:

```plaintext
!token-mod --ids @{target|1|token_id} @{target|2|token_id} --on showname
```

Use `--ignore-selected` to avoid modifying currently selected tokens.

---

## Dynamic Lighting Properties

### Updated Dynamic Lighting
- `has_bright_light_vision`: Enables vision for a token.
- `has_night_vision`: Allows tokens to see without light.
- `emits_bright_light`: Activates bright light emission.

Set dynamic lighting properties:
```plaintext
!token-mod --set light_radius|40 light_dimradius|20
```

---

## Bulk Setting Rolls

Set multiple attributes with the `--set` option:
```plaintext
!token-mod --set bar1_value|[[1d20+5]] bar2_value|[[2d6+3]]
```

---

## Managing Status Markers

Add, toggle, or remove status markers:
```plaintext
!token-mod --set statusmarkers|+blue|-red|!green
```

Clear all status markers:
```plaintext
!token-mod --set statusmarkers|=
```

---

## Managing Images and Multi-Sided Tokens

Set token images:
```plaintext
!token-mod --set imgsrc|https://path-to-image.png
```

Add or remove sides:
```plaintext
!token-mod --set imgsrc|+https://new-side.png
!token-mod --set imgsrc|-3
```

Set the current side:
```plaintext
!token-mod --set currentside|2
```

---

## Configuration Options

Modify script configurations with `--config`:
```plaintext
!token-mod --config players-can-ids|yes
```

---

## Reporting Changes

Generate a report with `--report`:
```plaintext
!token-mod {{
  --set bar1_value|-[[2d6+3]]
  --report all|"{name} takes {bar1_value:abschange} damage."
}}
```
