# The Game Is the Math

I want a ten-part series on combinatorial game theory (two players, perfect information, no luck) where every article starts with a game against the computer, and the theorem comes after the reader has lost a few times and noticed a pattern. Each article's theory is reused by the next: XOR from Nim explains Hackenbush, Grundy values explain sums, Hackenbush fractions become surreal numbers, and games too hot to be numbers need temperature.

It is for puzzle-minded readers comfortable with binary and fractions. At the end they should be able to beat a non-expert at Nim and Dots and Boxes, compute a Grundy value by hand, read a value like {2 | -1}, and say why Hex cannot end in a draw.

## Articles

**Act I: Impartial games** (both players have the same moves)

### 1. Nim
The losing positions in Nim are exactly those whose heap sizes XOR to zero (Bouton's theorem). The reader plays Nim against a computer that never misses a win and then sees heap sizes laid out in binary until the column-parity rule appears.

### 2. Green Hackenbush
Every stalk is a Nim heap, and every tree reduces to one. The reader cuts edges against the computer, then collapses forks with the colon principle until a tree becomes one stalk.

### 3. The Sprague-Grundy Theorem
Every impartial game is equivalent to a Nim heap, whose size is the minimum excludant of its options. The reader labels a game tree with mex values, then plays several different games at once and wins by XORing their Grundy values.

### 4. Misère Play
When the last player to move loses, Nim changes only in the endgame, and most other games lose their clean theory. The reader plays normal and misère Nim side by side from one position and sees the strategies agree until every heap is 0 or 1, then plays misère Marienbad (heaps 1, 3, 5, 7).

**Act II: Partizan games and surreal numbers** (Left and Right have different moves)

### 5. Blue-Red Hackenbush
When Left cuts only blue edges and Right only red, a position has a value that can be a fraction. The reader plays stalks and sums of stalks and finds a blue edge topped by a red one is worth one half.

### 6. Surreal Numbers and Simplicity
Conway's numbers are built from Left and Right sets, and the value of {a | b} is the simplest number between them. The reader grows the birthday tree day by day, compares and adds numbers with Conway's recursive definitions traced step by step, and reads Hackenbush positions as surreal numbers.

### 7. Domineering
In Domineering both players want to move first, so positions stop being numbers. The reader places dominoes on small boards against a perfect opponent, meets the 2x2 board as the switch ±1, and checks a sum of separated regions against a search of the whole board.

### 8. Temperature and Cooling
A hot game has a temperature, what a player would pay for the right to move, and the rule of thumb is to play in the hottest component. The reader reads a thermograph off a game tree, plays a sum of switches against an exhaustive opponent, and tries it on small Go endgames.

**Act III: Games in the wild**

### 9. Hex and Positional Games
Hex can never end in a draw, so strategy stealing shows the first player has a winning strategy even on boards where nobody knows it. The reader plays Hex, then fills the board at random a thousand times and sees that someone always connects. Close with positional games and the Hales-Jewett theorem.

### 10. Dots and Boxes
Expert Dots and Boxes is decided by who has to open the long chains. The reader counts chains and loops in endgame positions, learns the double-cross, and applies the long chain rule, including one position where it points the wrong way.

## What to get right

- A computer described as optimal must be optimal, and never make an illegal move. Everything through article 8 can be solved exactly at these sizes; Hex and Dots and Boxes opponents will be heuristics, and the captions say so.
- Easy to get wrong: the long chain rule is that the first player wants dots plus long chains to be even, with long meaning three or more boxes and loops not counted; the 2x2 Domineering board is ±1, not star; {a | a} is a+*, not an integer; {a | b} with a < b is the simplest number between them, not the average; a sum of switches is worth the alternating sum of their temperatures to the first mover, not the sum of their swings.
- Solved-board facts need dates from sources: 8x8 Domineering is a first-player win (2000), with only outcomes known for larger boards; which Hex openings win on small boards (on 4x4 only some do); when 8x8 and 9x9 Hex were solved; 4x5 Dots and Boxes is a tie (Barker and Korf). Strategy stealing only gives "first player does not lose" in games that can draw.
- Use Gale's argument for why Hex cannot draw.
- Blue always means Left and red always means Right, positive values favor Left, and the three acts each have their own accent color.
- Primary sources are Winning Ways, On Numbers and Games and Siegel's Combinatorial Game Theory. Leave out biography you cannot verify.
