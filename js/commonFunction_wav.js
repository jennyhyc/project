/************************* list *************************
 *¡i Web Audio Base ¡j context, playSound, etc 
 *¡i Sound Collection ¡j DRUMKIT
 ********************************************************/


/***** Web Audio Base *****/
// Start off by initializing a new context.
context = new (window.AudioContext || window.webkitAudioContext)();

if (!context.createGain)
  context.createGain = context.createGainNode;
if (!context.createDelay)
  context.createDelay = context.createDelayNode;
if (!context.createScriptProcessor)
  context.createScriptProcessor = context.createJavaScriptNode;

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
return  window.requestAnimationFrame       || 
  window.webkitRequestAnimationFrame || 
  window.mozRequestAnimationFrame    || 
  window.oRequestAnimationFrame      || 
  window.msRequestAnimationFrame     || 
  function( callback ){
  window.setTimeout(callback, 1000 / 60);
};
})();

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
};

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
};

function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

function loadSounds(obj, soundMap, callback) {
  // Array-ify
  var names = [];
  var paths = [];
  for (var name in soundMap) {
    var path = soundMap[name];
    names.push(name);
    paths.push(path);
  }
  bufferLoader = new BufferLoader(context, paths, function(bufferList) {
    for (var i = 0; i < bufferList.length; i++) {
      var buffer = bufferList[i];
      var name = names[i];
      obj[name] = buffer;
    }
    if (callback) {
      callback();
    }
  });
  bufferLoader.load();
}

function playSound(buffer, time) {
  var source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source[source.start ? 'start' : 'noteOn'](time);
}
function playSound(buffer, time, intensity) {
    var gainNode = context.createGain();
    var source = context.createBufferSource();
    source.buffer = buffer;

    // Connect source to a gain node
    source.connect(gainNode);
    // Connect gain node to destination
    gainNode.connect(context.destination);

    var gainval = intensity || 0.5;
    gainNode.gain.value = gainval;
    
    //source.start(time);
    source[source.start ? 'start' : 'noteOn'](time);
    
    /////////////////////////////////
    // source.start (when, in seconds) 
    // The 'when' parameter defines when the play will start. 
    // If when represents a time in the past, the play will start immediately.
    // https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode/start
}

/***** Sound Collection *****/
function DRUMKIT(){
  loadSounds(this, {
    snare: 'http://jennyhyc.github.io/project/sounds/drum/snare.wav',
    tomHh: 'http://jennyhyc.github.io/project/sounds/drum/tomHh.wav',
    tomLw: 'http://jennyhyc.github.io/project/sounds/drum/tomLw.wav',
    tomFl: 'http://jennyhyc.github.io/project/sounds/drum/tomFl.wav',
    bass : 'http://jennyhyc.github.io/project/sounds/drum/bass.wav',
    hatCl: 'http://jennyhyc.github.io/project/sounds/drum/hatCl.wav',
    hatOp: 'http://jennyhyc.github.io/project/sounds/drum/hatOp.wav',
    HatPd: 'http://jennyhyc.github.io/project/sounds/drum/HatPd.wav',
    crash: 'http://jennyhyc.github.io/project/sounds/drum/crash.wav',
    ride : 'http://jennyhyc.github.io/project/sounds/drum/ride.wav',
    clap : 'http://jennyhyc.github.io/project/sounds/drum/clap.wav',
    stick: 'http://jennyhyc.github.io/project/sounds/drum/stick.wav',
    
    metronome_ding:  'http://jennyhyc.github.io/project/sounds/metronome/ding.wav',
    metronome_click: 'http://jennyhyc.github.io/project/sounds/metronome/click.wav'
  });
}
