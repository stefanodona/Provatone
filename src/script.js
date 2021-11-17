import * as Tone from "tone"
import { Time } from "tone";
import './tones.js'
// import mm from "@magenta/music"
const mm = require("@magenta/music")


const improvCheckpoint = 'https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/basic_rnn';
const improvRNN = new mm.MusicRNN(improvCheckpoint)

Tone.Transport.bpm.value = 130;
let oneIsOn = false;

const startProgram = async () => {
    try {
        await improvRNN.initialize().then(()=>{if(improvRNN.isInitialized()) console.log("correct init")} );

        const Instr = require("./tones")
        const DrumMachine = require("./drummachine.js")
        const Sequencer = require("./sequencer");

        // DrumMachine.play(note, time) play the instrument mapped to that note at time
        var myDrum = new DrumMachine(
            [
                {name: "kick", note: "C2", obj: new Instr.Kick()},
                {name: "snare", note: "C#2", obj: new Instr.Snare()},
                {name: "hihatC", note: "D2", obj: new Instr.HiHatClosed()},
                {name: "hihatO", note: "D#2", obj: new Instr.HiHatOpen()}
            ]
        );

        var noteSequence = ["C2", "D2" , "C#2", "D2"]; 
        var noteSequence2 = ["C2", "D2" , "C#2", "D#2"];
        
        // type {time: "x:x:x", note: "XX", velocity: X}
        var sequence = [
            {time: 0, note: "C2", velocity: 1},
            {time: 0, note: "D2", velocity: 1},

            {time: "0:0:2", note: "D2", velocity: 0.05},

            {time: "0:1:0", note: "C#2", velocity: 1},
            {time: "0:1:0", note: "D2", velocity: 1},

            {time: "0:1:2", note: "D2", velocity: 0.05},

            {time: "0:2:0", note: "C2", velocity: 1},
            {time: "0:2:0", note: "D2", velocity: 1},

            {time: "0:2:2", note: "D2", velocity: 0.05},     

            {time: "0:3:0", note: "C#2", velocity: 1},
            {time: "0:3:0", note: "D2", velocity: 1},

            {time: "0:3:2", note: "D2", velocity: 0.05},
            {time: "0:3:3", note: "D2", velocity: 0.1},
        ];

        var sequence2 = [...sequence];
        sequence2[11] = {time: "0:3:2", note: "D#2", velocity: 1}
        sequence2.pop();
        console.log(sequence)
        console.log(sequence2)
        /*
        const p1 = new Tone.Part(((time, value)=>{
            myDrum.play(value.note, time)
        }), sequence).stop();

        const p2 = new Tone.Part(((time, value)=>{
            myDrum.play(value.note, time)
        }), sequence2).stop();  

        p1.loop = true;
        p2.loop = true; */

        let mySequencer = new Sequencer(myDrum, sequence);
        let mySequencer2 = new Sequencer(myDrum, sequence2);

        document.getElementById("drummachine").onclick = () => {
            console.log("hi, I'm clicked")
            Tone.Transport.start()
            mySequencer.start(Tone.Transport.position)
            oneIsOn = true;
            console.log("oneIsOn: "+oneIsOn)
        }

        document.getElementById("stop").onclick = () => {
            Tone.Transport.stop();
            Tone.Transport.position = 0;
            oneIsOn = false;
        }

        document.getElementById("switch").onclick = () => {
            console.log(oneIsOn);
            if (oneIsOn) {
                // seq.stop(Tone.Transport.nextSubdivision('1m'))
                // seq2.start(Tone.Transport.nextSubdivision('1m'))
                mySequencer.stop(Tone.Transport.nextSubdivision('1m'))
                mySequencer2.start(Tone.Transport.nextSubdivision('1m'))
            }
            else {
                // seq2.stop(Tone.Transport.nextSubdivision('1m'))
                // seq.start(Tone.Transport.nextSubdivision('1m'))
                mySequencer2.stop(Tone.Transport.nextSubdivision('1m'))
                mySequencer.start(Tone.Transport.nextSubdivision('1m'))
            }
            oneIsOn = !oneIsOn;
        } 

        
    } catch (error) {
        console.log(error);
    }

}

startProgram()