/**
 Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

 http://aws.amazon.com/apache2.0/

 or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

 /**
 * App ID for the skill
 */
var APP_ID = 'amzn1.ask.skill.c2d3ff33-17e2-4606-9f2a-2026785dfd99'; //replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

var MemDeck = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
MemDeck.prototype = Object.create(AlexaSkill.prototype);
MemDeck.prototype.constructor = MemDeck;

// ----------------------- Override AlexaSkill request and intent handlers -----------------------

MemDeck.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

MemDeck.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    handleWelcomeRequest(response);
};

MemDeck.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

/**
 * override intentHandlers to map intent handling functions.
 */
MemDeck.prototype.intentHandlers = {
    "OneshotCardIntent": function (intent, session, response) {
        handleOneshotCardRequest(intent, session, response);
    },

    "OneshotPositionIntent": function (intent, session, response) {
        handleOneshotPositionRequest(intent, session, response);
    },

    "DialogDeckIntent": function (intent, session, response) {
        // Determine if this turn is for deck, for card, for position, or an error.
        // We could be passed  s with values, no slots, slots with no value.
        var deckSlot = intent.slots.Stack;
        var cardSlot = intent.slots.Card;
        var positionSlot = intent.slots.Position;

        if (deckSlot && deckSlot.value) {
            handleDeckDialogRequest(intent, session, response);
        } else if (cardSlot && cardSlot.value) {
            handleCardDialogRequest(intent, session, response);
        } else if (positionSlot && positionSlot.value) {
            handlePositionDialogRequest(intent, session, response);
        } else {
            handleNoSlotDialogRequest(intent, session, response);
        }
    },

    "AvailableDecksIntent": function (intent, session, response) {
        handleAvailableDecksRequest(intent, session, response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        handleHelpRequest(response);
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};

// -------------------------- MemDeck Domain Specific Business Logic --------------------------

// set decks
var DECKS = {
    'new deck': {
      name:"New Deck",
      order:[
        "ace of clubs",
        "two of clubs",
        "three of clubs",
        "four of clubs",
        "five of clubs",
        "six of clubs",
        "seven of clubs",
        "eight of clubs",
        "nine of clubs",
        "ten of clubs",
        "jack of clubs",
        "queen of clubs",
        "king of clubs",
        "ace of hearts",
        "two of hearts",
        "three of hearts",
        "four of hearts",
        "five of hearts",
        "six of hearts",
        "seven of hearts",
        "eight of hearts",
        "nine of hearts",
        "ten of hearts",
        "jack of hearts",
        "queen of hearts",
        "king of hearts",
        "ace of diamonds",
        "two of diamonds",
        "three of diamonds",
        "four of diamonds",
        "five of diamonds",
        "six of diamonds",
        "seven of diamonds",
        "eight of diamonds",
        "nine of diamonds",
        "ten of diamonds",
        "jack of diamonds",
        "queen of diamonds",
        "king of diamonds",
        "ace of spades",
        "two of spades",
        "three of spades",
        "four of spades",
        "five of spades",
        "six of spades",
        "seven of spades",
        "eight of spades",
        "nine of spades",
        "ten of spades",
        "jack of spades",
        "queen of spades",
        "king of spades"
      ]
    },
    'tamariz': {
      name:"Tamariz",
      order:[
        "four of clubs",
        "two of hearts",
        "seven of diamonds",
        "three of clubs",
        "four of hearts",
        "six of diamonds",
        "ace of spades",
        "five of hearts",
        "nine of spades",
        "two of spades",
        "queen of hearts",
        "three of diamonds",
        "queen of clubs",
        "eight of hearts",
        "six of spades",
        "five of spades",
        "nine of hearts",
        "king of clubs",
        "two of diamonds",
        "jack of hearts",
        "three of spades",
        "eight of spades",
        "six of hearts",
        "ten of clubs",
        "five of diamonds",
        "king of diamonds",
        "two of clubs",
        "three of hearts",
        "eight of diamonds",
        "five of clubs",
        "king of spades",
        "jack of diamonds",
        "eight of clubs",
        "ten of spades",
        "king of hearts",
        "jack of clubs",
        "seven of spades",
        "ten of hearts",
        "ace of diamonds",
        "four of spades",
        "seven of hearts",
        "four of diamonds",
        "ace of clubs",
        "nine of clubs",
        "jack of spades",
        "queen of diamonds",
        "seven of clubs",
        "queen of spades",
        "ten of diamonds",
        "six of clubs",
        "ace of hearts",
        "nine of diamonds"
      ]
    },
    'aronson': {
      name:"Aronson",
      order:[
        "ace of clubs",
        "two of clubs",
        "three of clubs",
        "four of clubs",
        "five of clubs",
        "six of clubs",
        "seven of clubs",
        "eight of clubs",
        "nine of clubs",
        "ten of clubs",
        "jack of clubs",
        "queen of clubs",
        "king of clubs",
        "ace of hearts",
        "two of hearts",
        "three of hearts",
        "four of hearts",
        "five of hearts",
        "six of hearts",
        "seven of hearts",
        "eight of hearts",
        "nine of hearts",
        "ten of hearts",
        "jack of hearts",
        "queen of hearts",
        "king of hearts",
        "ace of diamonds",
        "two of diamonds",
        "three of diamonds",
        "four of diamonds",
        "five of diamonds",
        "six of diamonds",
        "seven of diamonds",
        "eight of diamonds",
        "nine of diamonds",
        "ten of diamonds",
        "jack of diamonds",
        "queen of diamonds",
        "king of diamonds",
        "ace of spades",
        "two of spades",
        "three of spades",
        "four of spades",
        "five of spades",
        "six of spades",
        "seven of spades",
        "eight of spades",
        "nine of spades",
        "ten of spades",
        "jack of spades",
        "queen of spades",
        "king of spades"
      ]
    },
    'maigret': {
      name:"Maigret",
      order:[
        "ace of clubs",
        "two of clubs",
        "three of clubs",
        "four of clubs",
        "five of clubs",
        "six of clubs",
        "seven of clubs",
        "eight of clubs",
        "nine of clubs",
        "ten of clubs",
        "jack of clubs",
        "queen of clubs",
        "king of clubs",
        "ace of hearts",
        "two of hearts",
        "three of hearts",
        "four of hearts",
        "five of hearts",
        "six of hearts",
        "seven of hearts",
        "eight of hearts",
        "nine of hearts",
        "ten of hearts",
        "jack of hearts",
        "queen of hearts",
        "king of hearts",
        "ace of diamonds",
        "two of diamonds",
        "three of diamonds",
        "four of diamonds",
        "five of diamonds",
        "six of diamonds",
        "seven of diamonds",
        "eight of diamonds",
        "nine of diamonds",
        "ten of diamonds",
        "jack of diamonds",
        "queen of diamonds",
        "king of diamonds",
        "ace of spades",
        "two of spades",
        "three of spades",
        "four of spades",
        "five of spades",
        "six of spades",
        "seven of spades",
        "eight of spades",
        "nine of spades",
        "ten of spades",
        "jack of spades",
        "queen of spades",
        "king of spades"
      ]
    }
};

function handleWelcomeRequest(response) {
    var whichDeckPrompt = "Which deck do we want to use?",
        speechOutput = {
            speech: "Welcome to the MemDeck Trainer."
                + whichDeckPrompt,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        },
        repromptOutput = {
            speech: "Once you tell me what stack we will be using, "
                + "you can ask for the position of specific card in the deck "
                + "or the name of card at a specific position. "
                + "Also, you can simply open MemDeck and ask a question like, "
                + "where is the Ace of Hearts in a Tamariz stack? "
                + "or, name the card at the twenty-seventh position."
                + "For a list of currently available decks, ask what decks are available. "
                + whichDeckPrompt,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };

    response.ask(speechOutput, repromptOutput);
}

function handleHelpRequest(response) {
    var repromptText = "Which deck do we want to use?",
        speechOutput = "You can ask for the position of specific card "
            + "or the name of card at a specific position"
            + "from one of the decks"
            + "or you can simply open MemDeck and ask a question like, "
            + "where is the Ace of Hearts in a Tamariz deck? "
            + "or, name the card at the twenty-seventh position."
            + "For a list of currently available decks, ask what decks are available. "
            + "Or you can say exit. "
            + repromptText;

    response.ask(speechOutput, repromptText);
}

/**
 * Handles the case where the user asked or for, or is otherwise being with available decks
 */
function handleAvailableDecksRequest(intent, session, response) {
    // get decks re-prompt
    var repromptText = "Which deck do we want to use?",
        speechOutput = "Currently, I know the order of these decks: " + getAllDecksText()
            + ". "+ repromptText;

    response.ask(speechOutput, repromptText);
}

/**
 * Handles the dialog step where the user provides a deck
 */
function handleDeckDialogRequest(intent, session, response) {

    var deck = getDeckFromIntent(intent, false),
        repromptText,
        speechOutput;
    if (deck.error) {
        repromptText = "Currently, I know the order of these decks: " + getAllDecksText()
            + ". Which deck do we want to use?";
        // if we received a value for the incorrect deck, repeat it to the user, otherwise we received an empty slot
        speechOutput = "I'm sorry, I don't know that stack. " + repromptText;
        response.ask(speechOutput, repromptText);
        return;
    }

    // if we don't have a card yet, go to card. If we have a card, we perform the final request
    if (session.attributes.card) {
        getFinalCardResponse(deck, session.attributes.card, response);
    // if we don't have a position yet, go to position. If we have a position, we perform the final request
    } else if (session.attributes.position) {
        getFinalPositionResponse(deck, session.attributes.position, response);
    } else {
        // set deck in session and prompt for card or position
        session.attributes.deck = deck;
        speechOutput = "From the " + deck.name +" stack, name a position or name of card.";
        repromptText = "Name a position or name of card for the " + deck.name + " stack.";

        response.ask(speechOutput, repromptText);
    }
}

/**
 * Handles the dialog step where the user provides a card name
 */
function handleCardDialogRequest(intent, session, response) {

    var card = getCardFromIntent(intent, false),
        repromptText,
        speechOutput;

    if (!card) {
        repromptText = "Please try again saying a card name, for example, Ace of Spades. "
            + " Which card are you looking for?";
        speechOutput = "I'm sorry, I didn't understand that card name. " + repromptText;

        response.ask(speechOutput, repromptText);
        return;
    }

    // if we don't have a deck yet, go to deck. If we have a deck, we perform the final request
    if (session.attributes.deck) {
        getFinalCardResponse(session.attributes.deck, card, response);
    } else {
        // set card in session and prompt for deck
        session.attributes.card = card;
        speechOutput = "For which deck?";
        repromptText = "Which deck are you looking in?";

        response.ask(speechOutput, repromptText);
    }
}

/**
 * Handles the dialog step where the user provides a card position
 */
function handlePositionDialogRequest(intent, session, response) {

    var cardPosition = getPositionFromIntent(intent, false),
        repromptText,
        speechOutput;

    if (!cardPosition) {
        repromptText = "Please try again saying a card position, for example, the 22nd position. "
            + " Which position are you looking for?";
        speechOutput = "I'm sorry, I didn't understand that card position. " + repromptText;

        response.ask(speechOutput, repromptText);
        return;
    }

    // if we don't have a deck yet, go to deck. If we have a deck, we perform the final request
    if (session.attributes.deck) {
        getFinalDeckResponse(session.attributes.deck, cardPosition, response);
    } else {
        // set deck in session and prompt for date
        session.attributes.position = cardPosition;
        speechOutput = "For which deck?";
        repromptText = "Which deck are you looking in?";

        response.ask(speechOutput, repromptText);
    }
}

/**
 * Handle no slots, or slot(s) with no values.
 * In the case of a dialog based skill with multiple slots,
 * when passed a slot with no value, we cannot have confidence
 * it is the correct slot type so we rely on session state to
 * determine the next turn in the dialog, and reprompt.
 */
function handleNoSlotDialogRequest(intent, session, response) {
    if (session.attributes.deck) {
        // get card name/position re-prompt
        var repromptText = "Please try again saying a card name, like the Queen of Hearts, "
          + "or a card position, like the 11th position.",
          speechOutput = repromptText;

        response.ask(speechOutput, repromptText);
    } else {
        // get deck re-prompt
        handleAvailableDecksRequest(intent, session, response);
    }
}

/**
 * This handles a one-shot interaction, where the user utters a phrase like:
 * 'Alexa, open MemDeck and get card for the Tamariz'.
 * If there is an error in a slot, this will guide the user to the dialog approach.
 */
function handleOneshotCardRequest(intent, session, response) {

    // Determine deck, using default if none provided
    var deck = getDeckFromIntent(intent, false),
        repromptText,
        speechOutput;
    if (deck.error) {
        // invalid deck. move to the dialog
        repromptText = "Currently, I know the order of these decks: " + getAllDecksText()
            + ". Which deck do we want to use?";
        // if we received a value for the incorrect deck, repeat it to the user, otherwise we received an empty slot
        speechOutput = "I'm sorry, I don't know that stack. " + repromptText;

        response.ask(speechOutput, repromptText);
        return;
    }

    // Determine custom card
    var card = getCardFromIntent(intent);
    if (!card) {
        // Invalid card. set card in session
        session.attributes.deck = deck;
        repromptText = "Please try again saying a card name, for example, Ten of Diamonds. ",
            + "Which card do we want to locate?";
        speechOutput = "I'm sorry, I didn't understand that card. " + repromptText;

        response.ask(speechOutput, repromptText);
        return;
    }

    // all slots filled, either from the user or by default values. Move to final request
    getFinalCardResponse(deck, card, response);
}

/**
 * This handles the one-shot interaction, where the user utters a phrase like:
 * 'Alexa, open MemDeck and get card for the Tamariz'.
 * If there is an error in a slot, this will guide the user to the dialog approach.
 */
function handleOneshotPositionRequest(intent, session, response) {

    // Determine deck, using default if none provided
    var deck = getDeckFromIntent(intent, false),
        repromptText,
        speechOutput;
    if (deck.error) {
        // invalid deck. move to the dialog
        repromptText = "Currently, I know the order of these decks: " + getAllDecksText()
            + ". Which deck do we want to use?";
        // if we received a value for the incorrect deck, repeat it to the user, otherwise we received an empty slot
        speechOutput = "I'm sorry, I don't know that stack. " + repromptText;

        response.ask(speechOutput, repromptText);
        return;
    }

    // Determine custom position
    var cardPosition = getPositionFromIntent(intent, false);
    if (!cardPosition) {
        // Invalid position. set position in session
        session.attributes.deck = deck;
        repromptText = "Please try again saying a card location, for example, the 32nd position "
            + "What location do we want to discover?";
        speechOutput = "I'm sorry, I didn't understand that location. " + repromptText;

        response.ask(speechOutput, repromptText);
        return;
    }

    // all slots filled, either from the user or by default values. Move to final request
    getFinalPositionResponse(deck, cardPosition, response);
}

/**
 * Both the one-shot and dialog based paths lead to this method to issue the request, and
 * respond to the user with the final answer.
 */
function getFinalCardResponse(deck, card, response) {
    var cardPos = Nth(deck.order.indexOf(card.name).toString()),
        speechOutput = "The " + card.name + " is at the " + cardPos + " position in the "
            + deck.name + " stack. ";

    response.tellWithCard(speechOutput, "MemDeck", speechOutput);
}

/**
 * Both the one-shot and dialog based paths lead to this method to issue the request, and
 * respond to the user with the final answer.
 */
function getFinalPositionResponse(deck, position, response) {
    var cardPos = Nth(position.name),
        speechOutput = "The " + deck.order[position.name] + " is at the " + cardPos + " position in the "
            + deck.name + " stack. ";

    response.tellWithCard(speechOutput, "MemDeck", speechOutput);
}

/**
 * Gets the deck from the intent, or returns an error
 */
function getDeckFromIntent(intent, assignDefault) {

    var deckSlot = intent.slots.Stack;
    // slots can be missing, or slots can be provided but with empty value.
    // must test for both.
    if (!deckSlot || !deckSlot.value) {
        if (!assignDefault) {
            return {
                error: true
            };
        } else {
            // For sample skill, default to New Deck.
            return {
                name: DECKS['new deck'].name,
                order: DECKS['new deck'].order
            };
        }
    } else {
        // lookup the Deck..
        var deckName = deckSlot.value;
        if (DECKS[deckName.toLowerCase()]) {
            return {
                name: DECKS[deckName.toLowerCase()].name,
                order: DECKS[deckName.toLowerCase()].order
            };
        } else {
            return {
                error: true,
                name: deckName.toLowerCase()
            };
        }
    }
}

/**
 * Gets the card from the intent, or returns an error
 */
function getCardFromIntent(intent, assignDefault) {

    var cardSlot = intent.slots.Card;
    // slots can be missing, or slots can be provided but with empty value.
    // must test for both.
    if (!cardSlot || !cardSlot.value) {
        if (!assignDefault) {
            return {
                error: true
            };
        } else {
            // For sample skill, default to Ace of Spades.
            return {
              name: "Ace of Spades"
            };
        }
    } else {
      return {
        name: cardSlot.value
      };
    }
}

/**
 * Gets the position from the intent, or returns an error
 */
function getPositionFromIntent(intent, assignDefault) {

    var positionSlot = intent.slots.Position;
    // slots can be missing, or slots can be provided but with empty value.
    // must test for both.
    if (!positionSlot || !positionSlot.value) {
        if (!assignDefault) {
            return {
                error: true
            };
        } else {
            // For sample skill, default to 1.
            return {
              name: "1"
            };
        }
    } else {
      //remove suffix
      return {
        name: positionSlot.value.slice(0,-2)
      };
    }
}

function Nth(str) {
  var lastltr = str.substr(-1);
    if (lastltr === "1") {
      return str + "st";
    }

    if (lastltr === "2") {
      return str + "nd";
    }

    if (lastltr === "3") {
      return str + "rd";
    }

    return str + "th";
}

function getAllDecksText() {
    var deckList = '';
    for (var deck in DECKS) {
        deckList += DECKS[deck].name + ", ";
    }

    return deckList;
}


// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    var MemDeck = new MemDeck();
    MemDeck.execute(event, context);
};
