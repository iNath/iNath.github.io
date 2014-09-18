/**
 * Essai with https://github.com/nfroidure/MIDIFile
 */

var MIDIFile = require('midifile');
var util = require('util');
var fs = require('fs');

// ------------
// Some defines

var SUBTYPE_NOTE_ON = 9;
var SUBTYPE_NOTE_OFF = 8;


// -------------------
// Some util functions

var toArrayBuffer = function(buffer) {
    var ab = new ArrayBuffer(buffer.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return ab;
};

var logObject = function(obj){
    console.log(util.inspect(obj, {depth: null}));
};


// ---------
// Some init

var file = toArrayBuffer(fs.readFileSync('../resource/midi_version/rh/notes.mid'));
var midi = new MIDIFile(file);


// ----------------------
// Extract informations

var events = midi.getMidiEvents();
var eventsCount = events.length;

//console.log(events);


// Separate levels
// noteNumber: 72, 84, 96
var levels = {
    low: [],
    medium: [],
    high: [],
    legendary: []
};

for(var i=0;i<eventsCount;i++){
    var event = events[i];
    var noteNumber = event.param1;

    if(event.subtype != SUBTYPE_NOTE_OFF && event.subtype != SUBTYPE_NOTE_ON) continue;

    if(60 <= noteNumber && noteNumber < 72){
        levels.low.push(event);
    } else if(82 <= noteNumber && noteNumber < 96){
        levels.medium.push(event);
    } else if(96 <= noteNumber && noteNumber < 108) {
        levels.high.push(event);
    } else { // TODO: fix it for 4 levels
        //throw Error("noteNumber out of range : " + noteNumber);
    }
}

for(var i=0;i<20;i++){
    logObject(levels.low[i]);
}

var noteNumberOffset = 60;
var output = [[],[],[],[],[],[],[],[],[],[],[],[]];
var input = levels.low;
var buffer = [];
for(var i=0;i<input.length;i++){
    if(input[i].subtype == SUBTYPE_NOTE_ON){
        buffer.push(input[i])
    }

    else if(input[i].subtype == SUBTYPE_NOTE_OFF){
        var onSaved = null;
        for(var j=0;j<buffer.length;j++){
            if(buffer[j].param1 == input[i].param1){
                onSaved = buffer[j];
                buffer.splice(j, 1);
                break;
            }
        }

        if(!onSaved) {
            throw Error("Unexpected noteOff for this note");
        }



        var noteNumberIndex = input[i].param1 - noteNumberOffset;
        output[noteNumberIndex].push({
            delay: Math.round(onSaved.playTime),
            duration: Math.round(input[i].playTime - onSaved.playTime)
        });
    }
}

// Suppression des doublons, à voir pourquoi ils sont présents parfois
for(var i=0;i<output.length;i++){
    for(var j=0;j<output[i].length-1;j++){
        if(output[i][j].delay == output[i][j+1].delay
        && output[i][j].duration == output[i][j+1].duration){
            output[i].splice(j+1, 1);
        }
    }
}


fs.writeFileSync('output.js', util.inspect(output));
