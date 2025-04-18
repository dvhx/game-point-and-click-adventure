// Rooms description
// linter: ngspicejs-lint --browser
"use strict";

var SC = window.SC || {};

SC.rooms = {

    "intro": {
        "layers": ["background.jpg", "flicker2.png"],
        "areas": {
            "new_game": [362,363,662,363,661,437,363,437],
            "continue": [362,471,662,471,661,545,363,545],
        },
        "items": [
            // dialogs
            {
                "if": "true",
                "dialog": "As an apprentice alchemist in a realm steeped in magic, your journey begins with a simple task that leads to untold mysteries. Explore hidden secrets, unlock forbidden doors, and master the arcane arts to forge your destiny.",
            },
            // clickables
            {
                "if": "true",
                "title": "Start new game",
                "area": "new_game",
                "add": ["new_game"],
                "remove": ["apple", "book", "door1", "key", "gave_book",
                           "lab", "hallway", "locked_room", "storeroom"],
                "room": "hallway",
            },
            {
                "if": "hallway",
                "title": "Continue game where you left it",
                "layers": ["continue.webp"],
                "area": "continue",
                "room": "CURRENT_ROOM",
            }
        ]
    },

    "lab": {
        "layers": ["background.jpg", "background_flicker.png"],
        "areas": {
            "hallway": [0,800,1024,800,1024,1024,0,1024],
            "key": [881,467,991,481,991,516,879,503],
        },
        "items": [
            // dialogs
            {
                "if": "new_game",
                "dialog": "So, you're the new apprentice, huh? Try not to get lost on your first day. Fetch the Book of Spells from the storeroom. Even you should be able to manage that. And please, don’t test my patience—I’d rather not have to brew an antidote for incompetence.",
            },
            {
                "if": "!new_game && !book && !gave_book",
                "dialog": "So, you're back empty-handed, huh? I’m not surprised. Did the storeroom swallow you whole, or did you just forget how to read directions? Go back and bring me the Book of Spells, unless you want your first lesson to be on my bad side!",
            },
            {
                "if": "book",
                "remove": ["book"],
                "add": ["gave_book"],
                "dialog": "Alchemist frowns as you hand over the book: \"What took you so long? I sent you for the book of spells ages ago! I don't have time to dawdle. Why don't you wait in the hallway for a bit? I'll need about half an hour to finish this potion, and then we can proceed with the next task.\" He seems to be really immersed in his work and no longer pay attention to me.",
            },
            {
                "if": "gave_book",
                "dialog": "What are you doing back here already? Didn't I tell you to wait in the hallway? I'm in the thick of this potion, and I can't have any distractions. Off with you now, and don't come back until I call for you!",
            },
            // clickables
            {
                "if": "true",
                "area": "hallway",
                "title": "Back to hallway",
                "room": "hallway",
                "remove": ["new_game"],
                "bottom": true
            },
            {
                "if": "!book && !gave_book",
                "title": "Nice little shelf, currently empty, hmm...",
                "area": "key",
            },
            {
                "if": "(book || gave_book) && !key",
                "title": "Grab the key",
                "area": "key",
                "layers": ["key.png", "key_glint1.png", "key_glint2.png"],
                "add": ["key"],
                "dialog_replace": "With a quick glance to ensure the alchemist remains engrossed in his work, I quietly slip the key into my pocket, feeling a rush of exhilaration. This small victory could be the turning point in my journey.",
            },
            {
                "if": "(book || gave_book) && key",
                "title": "Return key",
                "area": "key",
                "layers": [],
                "remove": ["key"],
                "dialog_replace": "I carefully returned the key",
            }
        ]
    },

    "hallway": {
        "layers": ["background.jpg", "flicker.png"],
        "areas": {
            "locked_room": [166,393,264,428,256,693,158,735],
            "kitchen": [329,439,367,458,367,687,338,653],
            "lab": [499,664,502,514,534,485,589,481,626,523,625,665],
            "storeroom": [0,860,1024,860,1024,1024,0,1024],
        },
        "items": [
            // dialogs
            {
                "if": "new_game",
                "dialog": "The dim light barely pierces the shadows as I stand in the hallway, the door ahead calling me to the alchemist's lab and the mysteries within.",
            },
            {
                "if": "!new_game && !book && !gave_book",
                "dialog": "I should go to the storeroom to look for the book of spells, otherwise alchemist will get angry",
            },
            {
                "if": "book",
                "dialog": "Walking down the dimly lit hallway, you clutch the old book of spells tightly. The alchemist's lab door looms ahead, and you can almost feel his impatience pressing through the thick wooden barrier. You quicken your pace, eager to avoid his ire.",
            },
            {
                "if": "gave_book && !key && !locked_room",
                "dialog": "I couldn't help but notice the key hanging on the pile of clutter in the lab. With his usual mutterings and wild gestures, he seemed completely absorbed in deciphering spells. This might be my chance to quietly slip back and retrieve the key without him noticing.",
            },
            {
                "if": "gave_book && !key && locked_room",
                "dialog": "He is so busy that I can take the key any time I want.",
            },
            {
                "if": "gave_book && key && !locked_room",
                "dialog": "With the key now in my possession, it's time to unlock the mysterious door and uncover what secrets lie behind it.",
            },
            {
                "if": "gave_book && key && locked_room",
                "dialog": "I can't shake the feeling that something important is hidden in that locked room. I should probably go back and investigate more thoroughly before the alchemist calls me.",
            },
            // clickables
            {
                "if": "key",
                "title": "Locked room",
                "area": "locked_room",
                "room": "locked_room",
            },
            {
                "if": "!key",
                "title": "Locked room",
                "area": "locked_room",
                "dialog_replace": "The door won't budge. It's locked tight, and the ancient wood creaks ominously under your touch. You sense there's something important behind it, but the alchemist's lab awaits."
            },
            {
                "if": "lunchtime",
                "title": "Kitchen",
                "area": "kitchen",
                "room": "kitchen",
            },
            {
                "if": "!lunchtime",
                "title": "Kitchen",
                "area": "kitchen",
                "dialog_replace": "Pausing at the entrance to the open kitchen, your stomach grumbles but you remind yourself: The alchemist insists no one enters the kitchen before lunch. I'll have to resist the tempting aromas and return later."
            },
            {
                "if": "true",
                "title": "Go to the alchemist's lab",
                "area": "lab",
                "room": "lab",
            },
            {
                "if": "!new_game",
                "title": "Go to the storeroom",
                "area": "storeroom",
                "room": "storeroom",
                "bottom": true
            },
        ]
    },

    "storeroom": {
        "layers": ["background_empty.jpg", "flicker.png"],
        "areas": {
            "hallway": [494,394,651,388,642,607,503,616],
            "apple": [231,617,266,617,266,651,231,651],
            "book": [364,386,400,394,400,419,370,413],
            "": [],
        },
        "items": [
            // dialogs
            {
                "if": "!book && !gave_book",
                "dialog": "As you step into the dimly lit storeroom, the scent of aged parchment and mysterious herbs fills the air. Your master, the renowned alchemist, has entrusted you with a crucial task: find the Book of Spells hidden somewhere within these shelves.",
            },
            {
                "if": "book && !gave_book",
                "dialog": "Let's bring the book to the lab. This dark room gives me the creeps.",
            },
            {
                "if": "gave_book",
                "dialog": "This dark room gives me the creeps.",
            },
            // clickables
            {
                "if": "!book && !gave_book",
                "title": "Go back to hallway without book",
                "area": "hallway",
                "dialog_replace": "I can't leave without the book the alchemist sent me to fetch—I'll be in real trouble if I return empty-handed.",
            },
            {
                "if": "book || gave_book",
                "title": "Go back to hallway",
                "area": "hallway",
                "room": "hallway",
            },
            {
                "if": "!apple",
                "title": "Eat apple",
                "area": "apple",
                "layers": ["apple.png"],
                "dialog_replace": "I munched on a crisp apple and decided to pocket a few of its seeds—who knows when they might come in handy.",
                "add": ["apple"]
            },
            {
                "if": "!book && !gave_book",
                "title": "Grab the book",
                "area": "book",
                "layers": ["book.webp"],
                "add": ["book"],
                "dialog_replace": "This must be it, but I can't make sense of this book... I'm just an apprentice. I need to return to the alchemist's lab before he gets angry. This dark room gives me the creeps.",
                "closeup": ["book_closeup.webp"]
            },
            {
                "if": "book",
                "title": "Return the book back on the shelf",
                "area": "book",
                "layers": [],
                "remove": ["book"],
                "dialog_replace": "Let's explore room some more before I return with the book",
            }
        ]
    },

    "locked_room": {
        "layers": ["background.jpg", "flicker.png"],
        "areas": {
            "hallway": [0,800,1024,800,1024,1024,0,1024],
        },
        "items": [
            // dialogs
            {
                "if": "true",
                "dialog": "The room looks older than the rest of the building, with its ancient wooden walls and flickering candlelight. It must be one of the oldest parts of the house. The air feels thick with mystery, as though the emptiness itself conceals hidden secrets waiting to be uncovered.",
            },
            // clickables
            {
                "if": "true",
                "title": "THE END",
                "area": "hallway",
                "room": "intro",
                "bottom": true
            },
            {
                "if": "false",
                "title": "Back to hallway",
                "area": "hallway",
                "room": "hallway",
                "bottom": true
            }
        ]
    }
};

