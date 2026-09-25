# The Grateful Dead: 2,358 Shows

I want four data essays on thirty years of Grateful Dead concerts, 1965 to 1995, built entirely from a real open database of shows and setlists. The reader is curious about the band or about what setlist data can reveal, and needs no statistics. Each piece stands alone, but they share one dataset and one color language for five ideas: a show, a song as a reusable entity, a segue from one song straight into the next, an era of the band's history, and a venue. By the end the reader can see how the repertoire grew and turned over across six eras, where the band went, what a typical show was shaped like, and which songs flowed into which.

## Articles

### 1. Setlist Archaeology
How the band's most-played songs entered, peaked, vanished and returned across six eras. The signature figure is a streamgraph of the top 60 titles over thirty years, colored by the era of each song's debut, where clicking a layer isolates it. A companion grid of sparklines, one per title with its own scale and sortable by first appearance, peak year or total, lets the reader read any single song's life. Drums and Space get their own look, including why they dip in the early 1970s. The piece ends on what a fixed panel of sixty career staples can and cannot show about the repertoire narrowing late in the band's career.

### 2. The Touring Life
The geography of every show. A US map sizes cities by show count and colors them by decade, linked to a shows-per-year bar chart and a top-20 venue leaderboard so that clicking a year or a venue filters the rest. The signature interactive animates tour routes along the interstate network, one year at a time or all thirty years with a rolling window and a month-by-month playhead. A seasonal chart shows which months the band was on the road.

### 3. The Grammar of a Dead Show
What opened and closed each set, and how the format of a show evolved. The reader sees the average shape of a show (set one, set two with Drums and Space inside it, encore), bar charts of the top openers and closers for each set, and a sortable song-by-slot matrix showing that most songs belonged to one job while a few worked several. A per-year chart of setlist length shows the long shows of the early 1970s and the gradual shortening after.

### 4. The Segue Graph
How songs flowed into each other. A force-directed network of the most frequent segue pairs lets the reader click a song to see its neighborhood. A Markov walker takes 100 steps from a chosen song and compares its visit counts against the chain's exact long-run share. Then a co-occurrence figure asks which songs share a show more often than chance, with a toggle between a naive chance model based on career totals and one based on same-year play rates, and the reader watches most apparent affinities evaporate once era is accounted for.

## What to get right

- All data must come from a real public source, Jef Smith's open Grateful Dead show database (gdshowsdb), processed by a script you keep with the project so every number can be regenerated. Never hand-type or invent arrays for a figure. Credit the source on every page.
- State the coverage honestly: 2,358 dated shows, of which only 2,076 have a recorded setlist, and almost all the missing ones are before 1971. Counts are setlist entries, so reprises count twice. Say which subset a figure uses (top 60 songs, top 100 segue pairs, top 200 co-occurrence pairs), and mark years where most shows lack a setlist.
- Audit the source data: it has at least one misdated debut and mangled accented characters in some venue names. Distinguish plays from shows (Drums "at 34 of 41 shows" versus "36 plays"), cities from city names (two Portlands), and a venue's town from the metro it sits in. The database's third set is usually the encore; say so where it matters.
- Check every claim against the data before writing it, especially the tempting Deadhead folklore: debut years, when Drums and Space became nightly, when Mickey Hart left and returned, which songs "disappeared", and whether the setlist narrowed late in the career. Where a chance model is involved, a naive one will manufacture affinities that are really just two songs from the same era.
- Any song classification used for color (rocker, ballad, cover, original) must be sourced or shown as your own judgment; better to color by a data-derived property such as debut era.
