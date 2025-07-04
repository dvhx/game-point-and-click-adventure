# History

I started this game/demo with the intent to test LLMs for image and text generation in point and click adventure style game.
I explicitly wanted NOT to create a framework and only make the game.
After making v1 as a few static HTML pages and seeing how tedious and error prone it is, 
I wanted to make simple, easy to use, point and click framework, how hard can it be?
Well, it took me 32 attempts in span of 3 weeks to find the one I was finally happy with.

## v1
- 3 rooms, 1 inventory item
- start in storeroom, grab book, bring it to alchemist
- everything written as separate static page, no framework
- conclusion: this is easy (but tedious and error prone)

## v2
- 4 rooms, 2 inventory items
- new quest: steal key, unlock room
- same system as v1
- I was not aware of hidden complexity, lot of states were unhandled or slightly broken
- took me 1 day to add new room, it's getting ridiculous
 - conclusion: it is more complex than I thought

## v3
- 5 rooms (added intro window), 2 inventory items (+ few hidden to handle "flow")
- all data in one json + validator of bad/unhandled states
- 41 different states (27 are not possible but needs to be explicitly stated as such to avoid unhandled states, this is a good feature!)
- adding new inventory item is half hour job
- I haven't added new room in 3 days!
- conclusion: this is better than v2 but not a good system

## v4
- Attempt to move logic to rooms themselves
- lot of custom coding, checks will be impossible
- attempt seen in js/room_hallway.js
- conclusion: every time I change something I need to read entire ever growing decision function
  and place new code in correct place and without checks this will be very difficult.

## v5
- Attempt to use small code snippets to change entire world.
- For example talking to alchemist will change dialog in hallway even tho i havent go there yet.
  Stealing key will not put it in inventory but marks door as unlocked and remove key from alchemist lab.
- Room spec file is 5x smaller, room rendering is 50% smaller.
- One major problem with this is updates, as the world changes and is stored in local storage, when
  I make some small change it isn't immediately visible I have to basically restart the game,
  which makes testing very repetitive. However this is easily solvable by some automated scripts
  so that I don't have to click the same thing over and over.
- this seems to be first version that could allow me to do complex mechanics relatively easy

## v6
- Polygons as separate entities with their own lifecycle:
- it is really no different than one big json?
- no it is different because big json described room, this describes polygons or smaller things

## v7
- Not just polygons but dialogs also as separate entities, everything, in separate jsons
- in storeroom I could not make picking and returning book easily, I could not easily do "I'll look around some more..."
    - solution a) polygon could rewrite dialog.textContent but then there will be issue after room reload
        - it took me 30 minutes to write 15 lines of json config, it's too difficult to use
    - solution b) explicit "book_returned_on_shelve" inventory item - makes other things too complicated, I would have to add it to "ignore" everywhere

## v8
- Write quests as some official internal table and use those ids for behavior changes,e.g.
    Q1: {1: 'alchemist tell about book', 2: 'in the hallway', 3: 'in the storeroom', 4: 'grabing the book',
        5: 'returning the book on shelf', 6: 'leaving storeroom', 7: 'hallway with book', 8: 'in lab with book',
        9: 'told to go to hallway', 10: 'returned to lab'},
    Q2: {1: 'grab the key', 2: 'in the hallway', 3: 'opening the door', 4: 'opening the locked room', 5: 'in the hallway'}
- then code would look like: if (state === Q1.2) { dialog = ...; layers = ... } or something like that
- never implemented, looks too limited, no idea how partial quests would mix

## v9
- items are objects and only they know what they are doing, e.g. pixk book and when clicking on empty shelve book will say
  it belongs to this polygon and will react in a way that it removes itself from the inventory and inserts itself onto bookshelf

## v10
- modify some of the code based versions, and make npcs and polygons are objects:
    if (player.has('book')) { player.remove('book'); shelf.add('book'); }

## v11
- make world navigable and then sprinkle some events, for example grabing book is no different than going to different room
  problem: this would not allow me to grab 2 books in different order
  also it's hard to wrap my head around the fact that storeroom with and without book are 2 rooms
  or 3 rooms if we consider that giving book to alchemist is 3rd state.

## v12
- like v11 but strictly only rooms, no shelves making virtual rooms
- walking should be easy, everything is unlocked
  (making walking simulator should be very easy, and a first step - but that's not how the game is made!)
- non-door polygons are handled as different objects
- doors passable but absence of item causes deny message
- non-door polygons generally add/remove from inventory or cause dialogs
- I only implemented grabing and returning book on shelf and it is 50 lines of repetetive and not so clean code

## v13
- play it and when I the player disagree with the state I edit dialog or items or bg
  and it will automatically add correct states and filters
- imho making events would be diffictult because events are non-states

## v14
- like v12 but items are json not code and to show instant the book was
  grabed I use ephemeral items that are only used once a then
  automatically removed from inventory. I will also have to separate between item 
  (is added/removed from inventory) and switch (does something)
- Conclusion: I failed to implement fully book, and it was very difficult
  json that would theoretically implemented book was 60 lines long that is insane

## v15
- there is only 1 event type - click (I shouldn't separate entry, click, pick etc...),
  object type doesn't matter. This imho doesn't simplify anything.

## v16
- make picking and returning first-class action, not just inventory operation or part of background
- There are 5 types of objects:
    1. room
    2. door (leads to other room, can be locked (we stay in current room and dialog changes))
    3. pickable (object that can be picked once and added to inventory, e.g. apple)
    4. returnable (object that can be picked and returned back, e.g. book)
    5. switch (changes something in the room or elsewhere without picking, switch can be implemented by returnable but returnable cannot be implemented by switch so returnable is superrior and we will use it instead of switch)

- pickable - one action related to picking (add, remove, dialog, layers, room)
- returnable - (add, remove, pick dialog, return dialog, pick layers, return layers, pick room, return room?)
- Minor issue with the book, when I pick it it says "I found a book", when I put it back,
  it says "Let's explore some more", but when I pick it again it says "I found a book".
  Technically it should say something like "Ok let's go back" because I already found it
  before. Some of the other versions could solve it via had-book or other methods (or ignore it).
  v16 could solve it by pick_dialog2 which is displayed on second pick or by having filters
  in dialog: "pick_dialog": {"": "I found book", "had-book": "Let's go back to lab"}
- For now I think it's not big issue as long as v16 brings significant simplifications.

##  v17
- Like v16 but
           "book": {
                "some_boolean": true, <-- will ignore things that isn't now but was in inventory, seems limited use
           "door1": {
                "require": ["book"],
                "some_boolean": true, <-- will ignore things that isn't now but was in inventory, seems limited use

##  v18
- Like v16 but
            "book": {
                "has": [], <-- not needed as book was matched already, but then again I can use book AND foo
                "has_not": ['gave_book'],   <-- book AND !foo
            "door1": {
                "require": ["book"],
                "require_not": ["gave_book"], ... here it's getting more complicated: !gave_book && book

## v19
- Like v16 but
            "book && !gave_book": {...
            (needs komplex parser, and now I can't decide which is key anymore)
            "door1": {... careful, this is about clicking, not displaying, so doors are impossible

## v20
- Like v16 but
            "book,!gave_book": {...
            (needs simpler parser, key is first item by convention, cant do brackets)
- will not work for door1

## v21
- Like v16 but
            "book": {
                "pick_once": true, <-- problem with returning book on shelf

## v22
- Like v16 but
            "book": {
                "visible": "!book && !gave_book",
                "clickable": "!book && !gave_book",
            "door1": {
                "visible": true,
                "clickable": true,
                "require": "book || gave_book",
                "require_dialog": "I should bring the book"
            imho too complicated

## v23
- Like v22 but multistate

            "book": {
                coords...
                "!book && !gave_book": {
                    clickable: true,
                    layers: ["book.png"],
                    title: "Grab the book"
                },
                "book": {
                    clickable: true,
                    layers: [],
                    title: "return book on shelf"
                },
                "gave_book": {
                    clickable: false,
                    layers: [],
                    title: null
                },
            }
            "door1": {
                coords...
                "!book": {
                    clickable: true,
                    layers: [],
                    title: "Go back to hallway",
                    "dialog": "I should find the book"
                },
                "book || gave_book": {
                    clickable: true,
                    layers: [],
                    title: "Go back to hallway",
                    "room": "hallway"
                },

## v24
- Like v23 but functions

            "book": {
                "visible_snippet": "function1",
                "clickable_snippet": "function2",
                "click_snippet": "function3",
            "door1": {
                "visible_snippet": "function4",
                "clickable_snippet": "function5",
                "click_snippet": "function6",

## v25
- Like v16 but

            "book": {
                "eol": "gave_book",  <-- if has "gave_book" then entire "book" will be ignored, imho not good if room needs to be in some kind of end state, I have to show something.
            "door1": {
                "translate": {gave_book: "book"} <-- stupid idea

## v26
- Like v16 but
            "book": {
                "visible": "!book && !gave_book",
                "clickable": "!gave_book",
            },
            "door1": {
                "require": "book || gave_book",
                "require_dialog": "I can't return without the book";
            }

## v27
- Like v16 but
            make "Object that is grabbed and returned but then gave to someone" first class object
            and make both book and door1 understand this lifecycle

            "book": {
                "type": "repickable_and_givable",
                ..
            },
            "door1": {
                "require": "book",      // because book is givable it here checks "book || gave_book" automatically
                ..
            },

## v28
- Like v27 but implicit "givable" for all, if I have "gave_book" it would be same as having "book",
 but if I have "gave_book" then as if the book didn't exist? or was taken but not re-pickable?
 this is getting ridiculous.

## v29
- Like v28 but explicit gave test
            "door1": {
                "gave_test": true
                "require": "book",
                ..
            },

## v30
- Like v16 but doors use "or" and book will have end state
            "door1": {
                "require": "book || gave_book"
                "require_dialog": "I can't leave without the book"
            },
            "book": {
                "end": "gave_book",
                "end_layers": [],
            }

## v31
- like v22 multistate items but not in coords but in states

            "book": {
                coords: [...],
                inventory: {
                    "!book && !gave_book": {
                        layers: ["book.png"],
                        title: "Grab the book",

                        add: ["book"],
                        dialog: "This must be it, but I can't make sense of this book... I'm just an apprentice. I need to return to the alchemist's lab before he gets angry. This dark room gives me the creeps.",
                        closeup: ["book_closeup.webp"]
                    },
                    "book": {
                        layers: [],
                        title: "Return book on the shelf"

                        remove: ["book"],
                        dialog: "Let's explore room some more before I return with the book",
                    },
                    "gave_book": {
                        layers: [],
                        title: null
                    },
                }
            }
            "door1": {
                coords: [...],
                inventory: {
                    "!book": {
                        layers: [],
                        title: "Go back to hallway",
                        "dialog": "I should find the book"
                    },
                    "book || gave_book": {
                        layers: [],
                        title: "Go back to hallway",
                        "room": "hallway"
                    },
                }

- Conclusion: yep, this is doable, a bit more complex but otherwise ok

## v32
- like v31 but minor change that all coords moved to one object and use it's names (keys), 
  e.g. "book_shelf" when referencing polygon instead of copy-pasting polygon coordinates for each item
- In v32 everything was possible to do and it was relatively simple so no new versions were made

# Conclusion

For years I was recommending point-and-click as newbie friendly type of game to make. I no longer recommend it.
If you want anything more than one-way flow with 2-3 different endings, this genre has surprising amount 
of complexity and special cases. Very often with each new interaction you will find that your current code
is either incapable of doing it or it require ridiculous amount of typing in million places. If you don't believe
try making your own point-and-click game with free movements and with returning things where you picked them.



