import * as Tone from 'tone'

module.exports = class Sequencer {
    constructor (instrument, sequence) {
        
        let part = new Tone.Part(((time, value)=>{
            instrument.play(value.note, time, value.velocity);
        }), sequence).stop()
        
        part.loop = true;

        this.part = part;
        this.instrument = instrument;
        this.sequence = sequence;

    }

    start(time) {
        this.part.start(time)
    }

    stop(time) {
        this.part.stop(time);
    }

}
