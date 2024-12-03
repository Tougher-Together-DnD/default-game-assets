
<!--
```mermaid
flowchart TD
    A[Is the Character's intent vs the environment, object, or motive inherently or purposefully challenging?]
    A --\>|No| B[Roleplay success]
    A --\>|Yes| C[Is the Character's intent likely within their basic 'wheel house'?]
    C --\>|Yes| D[Roleplay success]
    C --\>|No| E[Set a DC for an Ability Check, Save, or Attack Roll]
    E --\> F[Are the character's passives equal to or higher than the DC?]
    F --\>|Yes| G[Roleplay success]
    F --\>|No| H[Player rolls dice, adjust score vs DC to determine result]
    H --\>|Roll is equal to or higher than DC| I[Roleplay success]
    H --\>|Roll is lower than DC| J[Roleplay setback]
```
-->

<!--
```mermaid
graph TD
	direction LR
	subgraph Turn["Your Turn"]
		direction LR
		subgraph Action["Action"]
			direction LR
			subgraph Bonus["Bonus"]
				direction LR
				subgraph Move["Movement"]
					direction LR
					subgraph Free["Free"]
						subgraph FreeList["`
							• Speak Briefly (no reply)
							• Draw an Item
							• Drop an Item
							• Drop Concentration
							• Draw or Sheathe a Weapon
							• Interact with Environment
							• Look Around
						`"]
						end
					end
					subgraph MoveList["`
						• Movement
						• Communicate /w Allies (include a reply)
						• Toss an Item
						• Mount/Dismount
						• Perform a Free `"]
					end
				end
				subgraph BonusList["`
					• Attack Off Hand Weapon
					• Activate Abilities
					• Cast a Spell (1 ba)
					• Martial Mastery
					• Pin/Lift
					• Overrun
					• Break a Condition
					• Drink a Potion
					• Search/Study/Insight
					• Perform a 1/2 Movement Action`"]
				end
			end
			subgraph ActionList["`
				• Attack w/ Weapon
				• Cast Spell (1 action)
				• Unarmed Strike
				• Disengage
				• Dodge
				• Grapple/Shove
				• Hide
				• Ready
				• Administer Potion
				• Operate Machine or Tool
				• Perform a Bonus Action
				• Perform a Movement Action
				• Perform a Free Action`"]
			end
		end
	end
```
-->