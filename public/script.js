const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const videoRecordButton = document.getElementById('recordVideo')
const stopVideoRecord = document.getElementById('stopVideo')
const playButton = document.querySelector('button#play');
const downloadButton = document.querySelector('button#download');
const recordedVideo = document.querySelector('video#recorded');
const uploadVideo = document.querySelector('button#upload');
// const myPeer = new Peer(undefined, {
//   host: 'peerjs-server.herokuapp.com',
//   secure: true,
//   port: 443,
//   config: {'iceServers': [
//     { url: 'stun:stun.l.google.com:19302' },
//     {
//       urls: "stun:openrelay.metered.ca:80"
//     },
//     {
//       urls: "turn:openrelay.metered.ca:80",
//       username: "openrelayproject",
//       credential: "openrelayproject"
//     },
//     {
//       urls: "turn:openrelay.metered.ca:443",
//       username: "openrelayproject",
//       credential: "openrelayproject"
//     },
//     {
//       urls: "turn:openrelay.metered.ca:443?transport=tcp",
//       username: "openrelayproject",
//       credential: "openrelayproject"
//     }
    

//   ]} /* Sample servers, please use appropriate ones */
// })
const myPeer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '443'
})
var  chunks=[] ;
let myVideoStream;
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
  
   
}).then(stream => {
  myVideoStream = stream;
  addVideoStream(myVideo, stream)
  
  var mediaRecorder = new MediaRecorder(stream);

  console.log("---------stream",stream);
  mediaRecorder.start();
  videoRecordButton.onclick = function() {
   
    playButton.disabled = true;
    downloadButton.disabled = true;
    console.log("mediaRecorder.state",mediaRecorder.state);
    console.log("recorder started");
    videoRecordButton.style.background = "red";
    videoRecordButton.style.color = "black";

    stopVideoRecord.onclick = function() {
      mediaRecorder.stop();
      console.log(mediaRecorder.state);
      console.log("recorder stopped");
      videoRecordButton.style.background = "";
      videoRecordButton.style.color = "";
      playButton.disabled = false;
      downloadButton.disabled = false;
    }
    mediaRecorder.onstop = function(e) {
      console.log("data available after MediaRecorder.stop() called.");
 mediaRecorder.stop();;
  //     var clipName = prompt('Enter a name for your sound clip');

  //     var clipContainer = document.createElement('article');
  //     var clipLabel = document.createElement('p');
  //     var audio = document.createElement('audio');
  //     var deleteButton = document.createElement('button');

  //     clipContainer.classList.add('clip');
  //     audio.setAttribute('controls', '');
  //     deleteButton.innerHTML = "Delete";
  //     clipLabel.innerHTML = clipName;

  //     clipContainer.appendChild(audio);
  //     clipContainer.appendChild(clipLabel);
  //     clipContainer.appendChild(deleteButton);
  //     // soundClips.appendChild(clipContainer);

  //     audio.controls = true;
  //     var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
  // //  chunks = []
  //     var audioURL = URL.createObjectURL(blob);
  //     audio.src = audioURL;
  //     console.log("recorder stopped");

  //     deleteButton.onclick = function(e) {
  //       evtTgt = e.target;
  //       evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
  //     }
    }

    // mediaRecorder.ondataavailable = function(e) {
    //   chunks.push(e.data);
    // }
    mediaRecorder.ondataavailable = e => chunks.push(e.data);


  }
  myPeer.on('call', call => {
    console.log('call ',call)
    call.answer(stream)
  
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      console.log(userVideoStream)
      addVideoStream(video, userVideoStream)
    })
  })
  playButton.addEventListener('click', () => {
    const superBuffer = new Blob(chunks, {type: 'video/webm'});
    recordedVideo.src = null;
    recordedVideo.srcObject = null;
    recordedVideo.src = window.URL.createObjectURL(superBuffer);
    recordedVideo.controls = true;
    recordedVideo.play();
  });
  
  downloadButton.addEventListener('click', () => {
    const blob = new Blob(chunks, {type: 'video/mp4'});
    const url = window.URL.createObjectURL(blob);
    console.log(url,'url=')
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    console.log('url======',url)
    a.download = 'test.mp4';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  });
  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
})
 // input value
 let text = $("input");
 // when press enter send message
 $('html').keydown(function (e) {
   if (e.which == 13 && text.val().length !== 0) {
     socket.emit('message', text.val());
     text.val('')
   }
 });
 socket.on("createMessage", message => {
   $("ul").append(`<li class="message"><b>user</b><br/>${message}</li>`);
   scrollToBottom()
 })
socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  console.log(userId)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
} 

uploadVideo.addEventListener('click', () => {
  const blob = new Blob(chunks, {type: 'video/mp4'});
  recordedVideo.src = window.URL.createObjectURL(blob);
  // recordedVideo.src = window.URL.createObjectURL(superBuffer);
  // recordedVideo.controls = true;
  // recordedVideo.play();
console.log(recordedVideo.src)

  var formData = new FormData();
  formData.append('video', recordedVideo.src);
  
  // Execute the ajax request, in this case we have a very simple PHP script
  // that accepts and save the uploaded "video" file
  xhr('./uploadVideo.php', formData, function (fName) {
      console.log("Video succesfully uploaded !" );
  });

  // Helper function to send 
  function xhr(url, data, callback) {
    console.log("url" ,url);
    console.log("data" ,data);
      var request = new XMLHttpRequest();
      console.log('request----',request)
      request.onreadystatechange = function () {
        console.log('request.readyState --',request.readyState )
          if (request.readyState == 4 && request.status == 200) {
             console.log(location.href + request.responseText)
              callback(location.href + request.responseText);
          }
      };
      request.open('GET', url);
      request.send(data);
  }

});
// user completed recording and stream is available
// function fileUpload(video) {
//   // the blob object contains the recorded data that
//   // can be downloaded by the user, stored on server etc.
//   console.log('finished recording: ', myPeer.recordedData);

//   // Create an instance of FormData and append the video parameter that
//   // will be interpreted in the server as a file
//   var formData = new FormData();
//   formData.append('video', player.recordedData.video);
  
//   // Execute the ajax request, in this case we have a very simple PHP script
//   // that accepts and save the uploaded "video" file
//   xhr('./uploadVideo.php', formData, function (fName) {
//       console.log("Video succesfully uploaded !");
//   });

//   // Helper function to send 
//   function xhr(url, data, callback) {
//       var request = new XMLHttpRequest();
//       request.onreadystatechange = function () {
//           if (request.readyState == 4 && request.status == 200) {
//               callback(location.href + request.responseText);
//           }
//       };
//       request.open('POST', url);
//       request.send(data);
//   }
// });
myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})
function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })
  peers[userId] = call
}
function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}
const scrollToBottom = () => {
  var d = $('.main__chat_window');
  d.scrollTop(d.prop("scrollHeight"));
}
const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}
const playStop = () => {
  console.log('object')
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  } else {
    setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}
const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}
const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}
const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}
const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}
