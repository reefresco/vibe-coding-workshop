// Song data format:
//
// Sections are either type:"tab" or type:"chords".
//
// Tab sections have a `tab` array of strings (one per string, e→E order).
//
// Chord sections have a `lines` array. Each line has:
//   - strums: [{chord, dir}]  — dir is "d" (down) or "u" (up)
//   - lyric: string
//
// When a chord changes MID-line (e.g. D→Am on strum 5 of 8), the strum row
// clearly shows the exact moment of change — that's the whole point.

const songs = [
  {
    id: "wish-you-were-here",
    title: "Wish You Were Here",
    artist: "Pink Floyd",
    key: "G major",
    difficulty: "intermediate",
    sections: [
      {
        name: "Intro — Fingerpicking",
        type: "tab",
        note: "Play this fingerpicking pattern slowly before the vocals start. Repeat 2x. Each note is picked individually — no strumming.",
        tab: [
          "e|--0---------0---------0---2---3---2--|",
          "B|------1-3-1---1-3-1-1-----------3---|",
          "G|--0-0-----------0-0--0-0----------0--|",
          "D|-------------------------------------|",
          "A|-------------------------------------|",
          "E|-------------------------------------|"
        ]
      },
      {
        name: "Verse 1",
        type: "chords",
        lines: [
          {
            strums: [
              { chord: "Em7", dir: "d" }, { chord: "Em7", dir: "u" },
              { chord: "Em7", dir: "d" }, { chord: "Em7", dir: "u" },
              { chord: "G",   dir: "d" }, { chord: "G",   dir: "u" },
              { chord: "G",   dir: "d" }, { chord: "G",   dir: "u" }
            ],
            lyric: "So, so you think you can tell           heaven from hell,"
          },
          {
            strums: [
              { chord: "Em7", dir: "d" }, { chord: "Em7", dir: "u" },
              { chord: "Em7", dir: "d" }, { chord: "Em7", dir: "u" },
              { chord: "G",   dir: "d" }, { chord: "G",   dir: "u" },
              { chord: "G",   dir: "d" }, { chord: "G",   dir: "u" }
            ],
            lyric: "blue skies from pain,                  can you tell a green field"
          },
          {
            strums: [
              { chord: "A",   dir: "d" }, { chord: "A",   dir: "u" },
              { chord: "A",   dir: "d" }, { chord: "A",   dir: "u" },
              { chord: "C",   dir: "d" }, { chord: "C",   dir: "u" },
              { chord: "C",   dir: "d" }, { chord: "C",   dir: "u" }
            ],
            lyric: "from a cold steel rail?                a smile from a veil?"
          },
          {
            // NOTE: D → Am happens mid-line on strum 4→5.
            // This is exactly the kind of mid-pattern chord change that
            // traditional chord charts make unclear. Here it's obvious.
            strums: [
              { chord: "D",   dir: "d" }, { chord: "D",   dir: "u" },
              { chord: "D",   dir: "d" }, { chord: "D",   dir: "u" },
              { chord: "Am",  dir: "d" }, { chord: "Am",  dir: "u" },
              { chord: "G",   dir: "d" }, { chord: "G",   dir: "u" }
            ],
            lyric: "Do you think you can tell?"
          }
        ]
      },
      {
        name: "Tab Break — Between Verses",
        type: "tab",
        note: "Return to the picking pattern between verses. One pass through.",
        tab: [
          "e|--2---0---------0---------3---2---0--|",
          "B|--------3-1-3-1---1-3-1-3---------1--|",
          "G|--2-2-----------0-0-------0-0-----0--|",
          "D|-------------------------------------|",
          "A|-------------------------------------|",
          "E|-------------------------------------|"
        ]
      },
      {
        name: "Verse 2",
        type: "chords",
        lines: [
          {
            strums: [
              { chord: "Em7", dir: "d" }, { chord: "Em7", dir: "u" },
              { chord: "Em7", dir: "d" }, { chord: "Em7", dir: "u" },
              { chord: "G",   dir: "d" }, { chord: "G",   dir: "u" },
              { chord: "G",   dir: "d" }, { chord: "G",   dir: "u" }
            ],
            lyric: "Did they get you to trade              your heroes for ghosts?"
          },
          {
            strums: [
              { chord: "Em7", dir: "d" }, { chord: "Em7", dir: "u" },
              { chord: "Em7", dir: "d" }, { chord: "Em7", dir: "u" },
              { chord: "G",   dir: "d" }, { chord: "G",   dir: "u" },
              { chord: "G",   dir: "d" }, { chord: "G",   dir: "u" }
            ],
            lyric: "Hot ashes for trees?                  hot air for a cool breeze?"
          },
          {
            strums: [
              { chord: "A",   dir: "d" }, { chord: "A",   dir: "u" },
              { chord: "A",   dir: "d" }, { chord: "A",   dir: "u" },
              { chord: "C",   dir: "d" }, { chord: "C",   dir: "u" },
              { chord: "C",   dir: "d" }, { chord: "C",   dir: "u" }
            ],
            lyric: "Cold comfort for change?               Did you exchange"
          },
          {
            // Mid-pattern chord change: D → Am on strum 5
            strums: [
              { chord: "D",   dir: "d" }, { chord: "D",   dir: "u" },
              { chord: "D",   dir: "d" }, { chord: "D",   dir: "u" },
              { chord: "Am",  dir: "d" }, { chord: "Am",  dir: "u" },
              { chord: "G",   dir: "d" }, { chord: "G",   dir: "u" }
            ],
            lyric: "a walk-on part in the war"
          },
          {
            strums: [
              { chord: "D",   dir: "d" }, { chord: "D",   dir: "u" },
              { chord: "D",   dir: "d" }, { chord: "D",   dir: "u" },
              { chord: "Am",  dir: "d" }, { chord: "Am",  dir: "u" },
              { chord: "G",   dir: "d" }, { chord: "G",   dir: "u" }
            ],
            lyric: "for a lead role in a cage?"
          }
        ]
      },
      {
        name: "Chorus",
        type: "chords",
        lines: [
          {
            strums: [
              { chord: "C",   dir: "d" }, { chord: "C",   dir: "u" },
              { chord: "C",   dir: "d" }, { chord: "C",   dir: "u" },
              { chord: "D",   dir: "d" }, { chord: "D",   dir: "u" },
              { chord: "D",   dir: "d" }, { chord: "D",   dir: "u" }
            ],
            lyric: "How I wish, how I wish you were here."
          },
          {
            strums: [
              { chord: "Am",  dir: "d" }, { chord: "Am",  dir: "u" },
              { chord: "Am",  dir: "d" }, { chord: "Am",  dir: "u" },
              { chord: "G",   dir: "d" }, { chord: "G",   dir: "u" },
              { chord: "G",   dir: "d" }, { chord: "G",   dir: "u" }
            ],
            lyric: "We're just two lost souls swimming in a fish bowl,"
          },
          {
            strums: [
              { chord: "C",   dir: "d" }, { chord: "C",   dir: "u" },
              { chord: "C",   dir: "d" }, { chord: "C",   dir: "u" },
              { chord: "D",   dir: "d" }, { chord: "D",   dir: "u" },
              { chord: "D",   dir: "d" }, { chord: "D",   dir: "u" }
            ],
            lyric: "year after year,"
          },
          {
            strums: [
              { chord: "Am",  dir: "d" }, { chord: "Am",  dir: "u" },
              { chord: "Am",  dir: "d" }, { chord: "Am",  dir: "u" },
              { chord: "G",   dir: "d" }, { chord: "G",   dir: "u" },
              { chord: "G",   dir: "d" }, { chord: "G",   dir: "u" }
            ],
            lyric: "running over the same old ground."
          },
          {
            strums: [
              { chord: "C",   dir: "d" }, { chord: "C",   dir: "u" },
              { chord: "C",   dir: "d" }, { chord: "C",   dir: "u" },
              { chord: "D",   dir: "d" }, { chord: "D",   dir: "u" },
              { chord: "D",   dir: "d" }, { chord: "D",   dir: "u" }
            ],
            lyric: "What have we found?                   The same old fears."
          },
          {
            strums: [
              { chord: "Am",  dir: "d" }, { chord: "Am",  dir: "u" },
              { chord: "Am",  dir: "d" }, { chord: "Am",  dir: "u" },
              { chord: "G",   dir: "d" }, { chord: "G",   dir: "u" },
              { chord: "G",   dir: "d" }, { chord: "G",   dir: "u" }
            ],
            lyric: "Wish you were here."
          }
        ]
      }
    ]
  },

  {
    id: "knockin-on-heavens-door",
    title: "Knockin' on Heaven's Door",
    artist: "Bob Dylan",
    key: "G major",
    difficulty: "beginner",
    sections: [
      {
        name: "Verse 1",
        type: "chords",
        lines: [
          {
            // G → D cross the bar — common beginner chord change
            strums: [
              { chord: "G",  dir: "d" }, { chord: "G",  dir: "u" },
              { chord: "G",  dir: "d" }, { chord: "G",  dir: "u" },
              { chord: "D",  dir: "d" }, { chord: "D",  dir: "u" },
              { chord: "D",  dir: "d" }, { chord: "D",  dir: "u" }
            ],
            lyric: "Mama, take this badge off of me"
          },
          {
            // G stays 4 strums, then switches to Am on strum 5
            strums: [
              { chord: "G",  dir: "d" }, { chord: "G",  dir: "u" },
              { chord: "G",  dir: "d" }, { chord: "G",  dir: "u" },
              { chord: "Am", dir: "d" }, { chord: "Am", dir: "u" },
              { chord: "Am", dir: "d" }, { chord: "Am", dir: "u" }
            ],
            lyric: "I can't use it anymore"
          },
          {
            strums: [
              { chord: "G",  dir: "d" }, { chord: "G",  dir: "u" },
              { chord: "G",  dir: "d" }, { chord: "G",  dir: "u" },
              { chord: "D",  dir: "d" }, { chord: "D",  dir: "u" },
              { chord: "D",  dir: "d" }, { chord: "D",  dir: "u" }
            ],
            lyric: "It's getting dark, too dark to see"
          },
          {
            strums: [
              { chord: "G",  dir: "d" }, { chord: "G",  dir: "u" },
              { chord: "G",  dir: "d" }, { chord: "G",  dir: "u" },
              { chord: "Am", dir: "d" }, { chord: "Am", dir: "u" },
              { chord: "Am", dir: "d" }, { chord: "Am", dir: "u" }
            ],
            lyric: "I feel like I'm knockin' on heaven's door"
          }
        ]
      },
      {
        name: "Chorus",
        type: "chords",
        lines: [
          {
            strums: [
              { chord: "G",  dir: "d" }, { chord: "G",  dir: "u" },
              { chord: "G",  dir: "d" }, { chord: "G",  dir: "u" },
              { chord: "D",  dir: "d" }, { chord: "D",  dir: "u" },
              { chord: "D",  dir: "d" }, { chord: "D",  dir: "u" }
            ],
            lyric: "Knock, knock, knockin' on heaven's door"
          },
          {
            // Note: chorus uses C instead of Am here — different chord than verse!
            strums: [
              { chord: "G",  dir: "d" }, { chord: "G",  dir: "u" },
              { chord: "G",  dir: "d" }, { chord: "G",  dir: "u" },
              { chord: "C",  dir: "d" }, { chord: "C",  dir: "u" },
              { chord: "C",  dir: "d" }, { chord: "C",  dir: "u" }
            ],
            lyric: "Knock, knock, knockin' on heaven's door"
          },
          {
            strums: [
              { chord: "G",  dir: "d" }, { chord: "G",  dir: "u" },
              { chord: "G",  dir: "d" }, { chord: "G",  dir: "u" },
              { chord: "D",  dir: "d" }, { chord: "D",  dir: "u" },
              { chord: "D",  dir: "d" }, { chord: "D",  dir: "u" }
            ],
            lyric: "Knock, knock, knockin' on heaven's door"
          },
          {
            strums: [
              { chord: "G",  dir: "d" }, { chord: "G",  dir: "u" },
              { chord: "G",  dir: "d" }, { chord: "G",  dir: "u" },
              { chord: "C",  dir: "d" }, { chord: "C",  dir: "u" },
              { chord: "C",  dir: "d" }, { chord: "C",  dir: "u" }
            ],
            lyric: "Knock, knock, knockin' on heaven's door"
          }
        ]
      },
      {
        name: "Verse 2",
        type: "chords",
        lines: [
          {
            strums: [
              { chord: "G",  dir: "d" }, { chord: "G",  dir: "u" },
              { chord: "G",  dir: "d" }, { chord: "G",  dir: "u" },
              { chord: "D",  dir: "d" }, { chord: "D",  dir: "u" },
              { chord: "D",  dir: "d" }, { chord: "D",  dir: "u" }
            ],
            lyric: "Mama, put my guns in the ground"
          },
          {
            strums: [
              { chord: "G",  dir: "d" }, { chord: "G",  dir: "u" },
              { chord: "G",  dir: "d" }, { chord: "G",  dir: "u" },
              { chord: "Am", dir: "d" }, { chord: "Am", dir: "u" },
              { chord: "Am", dir: "d" }, { chord: "Am", dir: "u" }
            ],
            lyric: "I can't shoot them anymore"
          },
          {
            strums: [
              { chord: "G",  dir: "d" }, { chord: "G",  dir: "u" },
              { chord: "G",  dir: "d" }, { chord: "G",  dir: "u" },
              { chord: "D",  dir: "d" }, { chord: "D",  dir: "u" },
              { chord: "D",  dir: "d" }, { chord: "D",  dir: "u" }
            ],
            lyric: "That long black cloud is comin' down"
          },
          {
            strums: [
              { chord: "G",  dir: "d" }, { chord: "G",  dir: "u" },
              { chord: "G",  dir: "d" }, { chord: "G",  dir: "u" },
              { chord: "Am", dir: "d" }, { chord: "Am", dir: "u" },
              { chord: "Am", dir: "d" }, { chord: "Am", dir: "u" }
            ],
            lyric: "I feel like I'm knockin' on heaven's door"
          }
        ]
      }
    ]
  },

  {
    id: "house-of-the-rising-sun",
    title: "House of the Rising Sun",
    artist: "The Animals",
    key: "A minor",
    difficulty: "intermediate",
    sections: [
      {
        name: "Intro — Arpeggio Picking",
        type: "tab",
        note: "The whole song uses this arpeggio pattern (pick each note individually, do NOT strum). In 6/8 time — count 1-2-3-4-5-6.",
        tab: [
          "e|--0-----------0-----------0-----------0----------|",
          "B|----1-------1---1-------3---3-------1---1---------|",
          "G|------2---2---------2-2---------2-2---------2----|",
          "D|--------2-----------0-----------2-----------2----|",
          "A|--0-----------0-----------0-----------0----------|",
          "E|-------------------------------------------------|",
          "",
          "     Am          C          D          F"
        ]
      },
      {
        name: "Verse 1 — Strum version (easier)",
        type: "chords",
        lines: [
          {
            // Am → C across the bar
            strums: [
              { chord: "Am", dir: "d" }, { chord: "Am", dir: "u" },
              { chord: "Am", dir: "d" }, { chord: "Am", dir: "u" },
              { chord: "C",  dir: "d" }, { chord: "C",  dir: "u" },
              { chord: "C",  dir: "d" }, { chord: "C",  dir: "u" }
            ],
            lyric: "There is a house in New Orleans"
          },
          {
            strums: [
              { chord: "D",  dir: "d" }, { chord: "D",  dir: "u" },
              { chord: "D",  dir: "d" }, { chord: "D",  dir: "u" },
              { chord: "F",  dir: "d" }, { chord: "F",  dir: "u" },
              { chord: "F",  dir: "d" }, { chord: "F",  dir: "u" }
            ],
            lyric: "they call the Rising Sun"
          },
          {
            strums: [
              { chord: "Am", dir: "d" }, { chord: "Am", dir: "u" },
              { chord: "Am", dir: "d" }, { chord: "Am", dir: "u" },
              { chord: "C",  dir: "d" }, { chord: "C",  dir: "u" },
              { chord: "C",  dir: "d" }, { chord: "C",  dir: "u" }
            ],
            lyric: "And it's been the ruin of many a poor boy"
          },
          {
            // E chord on strum 5 — mid-line chord change
            strums: [
              { chord: "D",  dir: "d" }, { chord: "D",  dir: "u" },
              { chord: "D",  dir: "d" }, { chord: "D",  dir: "u" },
              { chord: "E",  dir: "d" }, { chord: "E",  dir: "u" },
              { chord: "E",  dir: "d" }, { chord: "E",  dir: "u" }
            ],
            lyric: "And God I know I'm one"
          }
        ]
      },
      {
        name: "Verse 2",
        type: "chords",
        lines: [
          {
            strums: [
              { chord: "Am", dir: "d" }, { chord: "Am", dir: "u" },
              { chord: "Am", dir: "d" }, { chord: "Am", dir: "u" },
              { chord: "C",  dir: "d" }, { chord: "C",  dir: "u" },
              { chord: "C",  dir: "d" }, { chord: "C",  dir: "u" }
            ],
            lyric: "My mother was a tailor"
          },
          {
            strums: [
              { chord: "D",  dir: "d" }, { chord: "D",  dir: "u" },
              { chord: "D",  dir: "d" }, { chord: "D",  dir: "u" },
              { chord: "F",  dir: "d" }, { chord: "F",  dir: "u" },
              { chord: "F",  dir: "d" }, { chord: "F",  dir: "u" }
            ],
            lyric: "she sewed my new blue jeans"
          },
          {
            strums: [
              { chord: "Am", dir: "d" }, { chord: "Am", dir: "u" },
              { chord: "Am", dir: "d" }, { chord: "Am", dir: "u" },
              { chord: "E",  dir: "d" }, { chord: "E",  dir: "u" },
              { chord: "E",  dir: "d" }, { chord: "E",  dir: "u" }
            ],
            lyric: "My father was a gambling man"
          },
          {
            strums: [
              { chord: "Am", dir: "d" }, { chord: "Am", dir: "u" },
              { chord: "Am", dir: "d" }, { chord: "Am", dir: "u" },
              { chord: "E",  dir: "d" }, { chord: "E",  dir: "u" },
              { chord: "E",  dir: "d" }, { chord: "E",  dir: "u" }
            ],
            lyric: "down in New Orleans"
          }
        ]
      }
    ]
  }
];
