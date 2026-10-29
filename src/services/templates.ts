import { Book } from '../types/book';

export const createBlankBook = (title = 'Untitled Book', author = 'Anonymous'): Book => {
  const now = Date.now();
  return {
    id: `book-${now}-${Math.random().toString(36).slice(2, 7)}`,
    title,
    subtitle: '',
    author,
    genre: 'Fiction',
    language: 'English',
    synopsis: '',
    dedication: '',
    copyright: `© ${new Date().getFullYear()} ${author}. All rights reserved.`,
    foreword: '',
    cover: {
      style: 'classic',
      primaryColor: '#1e293b',
      secondaryColor: '#3b82f6',
      textColor: '#ffffff',
      titleFont: 'display',
      authorFont: 'serif',
      emblem: 'book',
      customImage: null,
    },
    chapters: [
      {
        id: `ch-${now}-1`,
        title: 'Chapter 1: The Beginning',
        subtitle: 'Where everything starts',
        content: `The morning mist hung low over the valley, quiet and undisturbed. 

Write your story here. Use markdown for formatting:
- **Bold text** for emphasis
- *Italics* for internal thoughts
- > Blockquotes for letters, dialogue or epigraphs
- --- or * * * for scene transitions

Every word you write is automatically saved to your browser in the background. No accounts or signups required.`,
        status: 'in_progress',
        createdAt: now,
        updatedAt: now,
      },
    ],
    settings: {
      defaultFont: 'serif',
      fontSize: 18,
      lineHeight: 1.75,
      pageWidth: 'medium',
    },
    createdAt: now,
    updatedAt: now,
  };
};

export const sampleNovelTemplate: Book = {
  id: 'sample-novel-001',
  title: 'The Cartographer of Shadows',
  subtitle: 'A Tale of the Edge of the World',
  author: 'Julian V. Sterling',
  genre: 'Literary Fantasy',
  language: 'English',
  synopsis: 'In a city where maps are forbidden by the High Council, an archivist discovers an uncharted archipelago that only reveals itself when the tides recede under a lunar eclipse.',
  dedication: 'For those who wander uncharted paths and search for wonder between the lines.',
  copyright: `© ${new Date().getFullYear()} Julian V. Sterling. All rights reserved.\nFirst Edition.\nPublished via BookMaker Studio.`,
  foreword: 'Some maps are drawn in ink; others are etched into the memory of salt and stone.',
  cover: {
    style: 'vintage',
    primaryColor: '#1c1917',
    secondaryColor: '#d97706',
    textColor: '#fef3c7',
    titleFont: 'cinzel',
    authorFont: 'serif',
    emblem: 'compass',
    customImage: null,
  },
  chapters: [
    {
      id: 'ch-sample-1',
      title: 'Prologue: The Ink that Remembers',
      subtitle: 'Winter, Year 742 of the Harbor Era',
      content: `The lantern flickered against the damp limestone of the vault.

Master Caleb dipped his goose-feather quill into the sepia ink, his arthritic knuckles trembling just enough to give the coastlines a lifelike tremor. Across the continent of Sol-Kareen, there were three hundred and twelve officially sanctioned guild cartographers. Caleb was the only one who had survived the Inscription Purge of the previous winter.

"Tell me, boy," he whispered without glancing at the shadow near the threshold. "Do you hear the water inside the vellum?"

Elias didn't answer right away. He stepped softly onto the flagstones, mindful of the salt-stained sea charts drying on racks suspended from the cedar rafters. The air smelled of beeswax, lavender oil, and the sharp mineral tang of dried squid ink.

"I hear only the tide outside the seawall, Master," Elias said quietly.

"Then you are not listening closely enough," Caleb chuckled, a dry rustle like parchment dragged over stone. "Every true map is alive. It resists being captured. Once you press iron gall onto linen paper, you do not simply document the earth. You bind it."

* * *

Outside, the clock tower in the Citadel began its twelve low tollings. With each reverberation, the harbor water slapped against the pilings below, carrying with it the cold salt spray of the outer strait.

Elias unrolled the bundle he had smuggled from the Lower Docks. The paper within was not linen or papyrus. It was pale as bone, textured like reptile skin, and when he held his candle near, veins of iridescent indigo seemed to pulse beneath the surface.

"Where did you get this?" Caleb's voice had lost its dry humor. His breath caught in his throat.

"The wreck at Pelican Shoals," Elias said. "It was locked in an iron strongbox sealed with tallow."

Caleb reached out a withered hand, his fingers stopping a fraction of an inch above the strange material. "May the Archon forgive us," he murmured. "This is not a map of what exists. This is a charter of what is coming."`,
      status: 'completed',
      notes: 'Sets up the tone, the forbidden nature of mapmaking, and the mysterious living parchment.',
      createdAt: Date.now() - 86400000 * 3,
      updatedAt: Date.now() - 86400000 * 2,
    },
    {
      id: 'ch-sample-2',
      title: 'Chapter I: The Iron Watchtower',
      subtitle: 'Echoes upon the Harbor',
      content: `Dawn broke over the port of Valais like a bruised plum—purple and gray against the jagged rim of the cliffs. 

The gulls had been screaming since the third watch. In the fish markets along the lower harbor, hawkers covered their baskets of silver herring with wet burlap, glancing nervously toward the Watchtower that loomed over the bay like an iron spear.

Elias made his way down the cobbled steps of the Fishmonger's Stair. His leather satchel felt three times its normal weight against his ribs. Inside lay the fragment of pale vellum, carefully wrapped in oilcloth to shield it from the morning drizzle.

> "A map is not a mirror of nature; it is a confession of desire."
> — The Book of Forbidden Meridian, Verse IV

He paused at the fountain of the Three Mariners. A group of Harbor Wardens stood near the gateway, their breastplates glistening with rain, long pikes grounded against the stones. They were checking the travel permits of every carter and peddler entering from the high road.

"You there," one of the Wardens called out, his visor lifted just enough to reveal sharp, suspicious eyes. "Boy with the satchel. Halt."

Elias slowed his pace, taking a calm, steady breath before turning. In the guild, they taught apprentices that the secret to deception was not hiding, but utter transparency.

"Good morning, Warden," Elias said, his voice level. "I am delivering draughtsman's chalk and pumice to the harbor master's clerk."

The Warden approached, his heavy boots clattering on the wet flagstones. His gaze drifted down to the satchel, lingering on the worn leather strap...`,
      status: 'in_progress',
      notes: 'Introduction of the Wardens and the danger Elias faces.',
      createdAt: Date.now() - 86400000 * 2,
      updatedAt: Date.now() - 86400000,
    },
    {
      id: 'ch-sample-3',
      title: 'Chapter II: The Island That Wanders',
      subtitle: 'Whispers from the Outer Strait',
      content: `In the tavern known as The Blind Barnacle, sailors swore by two things: that the rum was watered down, and that the Isle of Skorr had moved four leagues west during the storm of autumn.

Elias sat in the corner booth, a cup of lukewarm mint tea between his palms, listening to the murmurs around him.

Old Captain Thorne slammed his pewter mug onto the oak board. "I tell you, her light wasn't where the stars said she ought to be! The beacon at Cape Dread was thirty degrees south of our compass heading. Either the world is spinning off its axle, or that spit of rock is afloat like a cork!"

Laughter erupted from the deckhands at the bar, but Elias did not laugh.

He opened his satchel under the table. In the dim lantern light, he peeked at the vellum. 

The ink had changed. 

The archipelago line had shifted toward the margin, leaving a delicate trail of blue droplets where the coastline had been only three hours before. The map was navigating itself.`,
      status: 'draft',
      notes: 'Revealing the magical property of the living map.',
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now(),
    },
  ],
  settings: {
    defaultFont: 'serif',
    fontSize: 18,
    lineHeight: 1.8,
    pageWidth: 'medium',
  },
  createdAt: Date.now() - 86400000 * 5,
  updatedAt: Date.now(),
};

export const sampleNonFictionTemplate: Book = {
  id: 'sample-guide-002',
  title: 'The Art of Deep Focus',
  subtitle: 'A Practical Guide to Solitary Craft in a Distracted World',
  author: 'Dr. Evelyn Vance',
  genre: 'Non-Fiction / Productivity',
  language: 'English',
  synopsis: 'A methodical exploration of cognitive stamina, deliberate isolation, and the architecture of creative momentum.',
  dedication: 'To everyone striving to do meaningful work amidst endless noise.',
  copyright: `© ${new Date().getFullYear()} Dr. Evelyn Vance.\nAll rights reserved.`,
  foreword: 'Attention is the rarest and purest form of generosity.',
  cover: {
    style: 'modern',
    primaryColor: '#0f172a',
    secondaryColor: '#06b6d4',
    textColor: '#ffffff',
    titleFont: 'sans',
    authorFont: 'sans',
    emblem: 'feather',
    customImage: null,
  },
  chapters: [
    {
      id: 'nf-ch-1',
      title: '1. The Cognitive Sanctuary',
      subtitle: 'Building a Boundary Around Your Mind',
      content: `The modern knowledge worker operates under an illusion of multi-threaded capacity. We convince ourselves that toggling between twenty browser tabs, an inbox, and a manuscript is multitasking.

In reality, neuroscientists have demonstrated that the human brain does not parallel-process complex executive tasks. Instead, it incurs a severe penalty known as *context-switching residue*.

### The Rule of the Monastic Hour

To produce work of enduring value, one must construct a daily cognitive sanctuary. 

1. **Physical Boundary**: A designated physical workspace where no non-work devices are allowed.
2. **Digital Boundary**: Completely offline drafting environments—such as this in-browser local editor with zero server ping and no feeds.
3. **Temporal Boundary**: Ninety uninterrupted minutes of singular devotion to the task.

> "To produce at your peak level you need to work for extended periods with full concentration on a single task free from distraction."
> — The Deep Work Principle`,
      status: 'completed',
      createdAt: Date.now() - 86400000 * 2,
      updatedAt: Date.now(),
    },
  ],
  settings: {
    defaultFont: 'sans',
    fontSize: 16,
    lineHeight: 1.7,
    pageWidth: 'medium',
  },
  createdAt: Date.now() - 86400000 * 3,
  updatedAt: Date.now(),
};
