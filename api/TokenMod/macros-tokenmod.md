# Macros

Macros dependent on the Token-Mod API being installed in your game.

##### Vision-and-Light-Sources

```
?{
Choose Vision and Light Options:
|Clear Token Settings,
!token-mod --set has_bright_light_vision#off light_sensitivity_multiplier#100.0 has_night_vision#off night_vision_distance#0ft night_vision_effect#none night_vision_tint#transparent emits_bright_light#off bright_light_distance#0ft emits_low_light#off low_light_distance#0ft lightColor#transparent has_directional_bright_light#off directional_bright_light_total#0 directional_bright_light_center#0 statusmarkers#-401-Action-Debuff::5818063 defaulttoken
|Normal Vision,
!token-mod --set has_bright_light_vision#on light_sensitivity_multiplier#100.0 has_night_vision#on night_vision_distance#20ft night_vision_effect#dimming#5ft night_vision_tint##674ea7 defaulttoken
|Blinded Condition,
!token-mod --set has_bright_light_vision#on light_sensitivity_multiplier#1.0 has_night_vision#off defaulttoken
|Darkvision,
!token-mod --set has_bright_light_vision#on light_sensitivity_multiplier#100.0 has_night_vision#on night_vision_distance#60 night_vision_effect#dimming#30ft night_vision_tint##674ea7 defaulttoken
|Superior Darkvision,
!token-mod --set has_bright_light_vision#on light_sensitivity_multiplier#100.0 has_night_vision#on night_vision_distance#120 night_vision_effect#dimming#60ft night_vision_tint##674ea7 defaulttoken
|Snuff Emitting Light,
!token-mod --set emits_bright_light#off emits_low_light#off lightColor#transparent defaulttoken &#013; !token-mod --set statusmarkers#-401-Action-Debuff::5818063
|Hold Candle,
!token-mod --set emits_bright_light#on bright_light_distance#5ft emits_low_light#on low_light_distance#10ft lightColor#transparent defaulttoken &#013; !token-mod --set statusmarkers#+401-Action-Debuff::5818063
|Hold Torch,
!token-mod --set emits_bright_light#on bright_light_distance#20ft emits_low_light#on low_light_distance#20ft lightColor#transparent defaulttoken &#013; !token-mod --set statusmarkers#+401-Action-Debuff::5818063
|Hold Lantern (Hood Off),
!token-mod --set emits_bright_light#on bright_light_distance#30ft emits_low_light#on low_light_distance#30ft lightColor#transparent defaulttoken &#013; !token-mod --set statusmarkers#+401-Action-Debuff::5818063
|Hold Lantern (Hood On),
!token-mod --set emits_bright_light#on bright_light_distance#0ft emits_low_light#on low_light_distance#5ft lightColor#transparent defaulttoken &#013; !token-mod --set statusmarkers#+401-Action-Debuff::5818063
|Hold Bullseye Lantern,
!token-mod --set emits_bright_light#on bright_light_distance#60ft emits_low_light#on low_light_distance#60ft lightColor#transparent has_directional_bright_light#on directional_bright_light_total#30 directional_bright_light_center#90 defaulttoken &#013; !token-mod --set statusmarkers#+401-Action-Debuff::5818063
|Emit Light Spell,
!token-mod --set emits_bright_light#on bright_light_distance#20ft emits_low_light#on low_light_distance#20ft lightColor#transparent defaulttoken
|Emit Darkness Spell,
!token-mod --set emits_bright_light#on bright_light_distance#15ft emits_low_light#off low_light_distance#0ft lightColor##674ea7 defaulttoken
|Emit Faerie Fire Spell,
!token-mod --set emits_low_light#on low_light_distance#10ft lightColor##ff00ff defaulttoken
}
```

###### Commit-to-Layer

```
?{
Commit to Layer:
|Token,
!token-mod --set layer#objects
|GM,
!token-mod --set layer#gmlayer
|Map,
!token-mod --set layer#map
|Lighting,
!token-mod --set layer#walls
}
```

###### Make-This-Player-Token

```
!token-mod --set controlledby#?{Who the Controlling Player} represents#?{Which Character does it Represent} showplayers_bar1#on bar1_link#hp ?{Elevation or AC|Elevation,showplayers_bar2#on bar2_value#0 bar2_max#0|Armor Class,bar2_link#ac} showplayers_bar3#on bar3_link#hp_temp bar3_value#0 &#013; DM manually check/change bars' Text Overlay visibility. (Elevation should be visible)
```

### Set-PlayerShown-Tooltip

```
!token-mod --set show_tooltip#?{Show|Yes,on|No,off} ?{Update Tooltip|No,|Yes,tooltip#?{Tooltip Text}}
```


