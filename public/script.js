const socket = io('/')
const videoGrid = document.getElementById('video-grid')
<<<<<<< HEAD
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
=======
>>>>>>> 7134ff2318627983ee859d43a873c176e64d8cb5
const myPeer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '443'
})
<<<<<<< HEAD
var  chunks=[] ;
=======
>>>>>>> 7134ff2318627983ee859d43a873c176e64d8cb5
let myVideoStream;
const myVideo = document.createElement('video')
myVideo.muted = true;
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream = stream;
  addVideoStream(myVideo, stream)
  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
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

<<<<<<< HEAD
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
=======
>>>>>>> 7134ff2318627983ee859d43a873c176e64d8cb5
const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}
<<<<<<< HEAD
=======

>>>>>>> 7134ff2318627983ee859d43a873c176e64d8cb5
const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}
<<<<<<< HEAD
=======

>>>>>>> 7134ff2318627983ee859d43a873c176e64d8cb5
const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}
