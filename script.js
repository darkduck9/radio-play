function checkDeviceType() {
    const userAgent = navigator.userAgent.toLowerCase();
    // 检测是否为平板设备
    const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent) || 
                    (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
    // 如果是平板，直接返回desktop
    if (isTablet) {
        return {
            deviceType: 'desktop'
        };
    }
    // 其他设备保持原有逻辑
    const isMobile = /iphone|ipad|ipod|android|windows phone/i.test(userAgent);
    return {
        deviceType: isMobile ? 'mobile' : 'desktop'
    };
}

			if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(function(registration) {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(function(error) {
            console.log('Service Worker registration failed:', error);
        });
}

			var radio = null;
			var player = radio;
			var playButton = player;
			var volumeLevel = playButton;
			var select = volumeLevel;
			var muteButton = select;
			var timerID = muteButton;
			var appTitle = timerID;
			var currentList = appTitle;
			var previousList = currentList;
			var isPaused = true;
			var isMuted = false;
			var volume = 1;
			var delay = 7500;
			var playTxt = 'play';
			var pauseTxt = 'pause';
			var muteTxt = 'mute';
			var speakerTxt = [
				'speaker-0',
				'speaker-1',
				'speaker-2',
				'speaker-3',
			];
			var imagePrefix = './icons/';
			var imageSuffix = '.svg';
			var favicon = document.querySelectorAll('link[rel="shortcut icon"]');
		favicon[0].href = imagePrefix + 'hit' + '.png';
			var eventEnabled = false;
			console.log('script. eventEnabled: ', eventEnabled);
			(function() {
				var imgsArr = [
					'mute',
					'pause',
					'play',
					'speaker-0',
					'speaker-1',
					'speaker-2',
					'speaker-3',
				];
				imgsArr.forEach(function (i) {
					var item = document.createElement('img');
					item['src'] = imagePrefix + i + imageSuffix;item.loading = 'lazy';
				});
			})();
			const CancelToken = axios.CancelToken;
			let cancel;
			var getTrackData = (url, current, previous) => axios.get(url, {
				cancelToken: new CancelToken(function executor(c) {
					// An executor function receives a cancel function as a parameter
					cancel = c;
				})
			})
				.then(function (response) {
					var data = response['data'].concat();
					var currentData = data.shift();
					renderData(current, currentData);
					renderData(previous, data);
					setCurrentData(currentData);
				})
				.catch(function (error) {
					// handle error
					console.log(error);
				})
				.finally(function() {
					document.body.classList.remove('loading');
					eventEnabled = true;
				});

   window.addEventListener('load', function(event) {
   const deviceInfo = checkDeviceType();
    if (deviceInfo.deviceType === 'mobile') {
        document.body.classList.add('mobile');
    }
    
				// Document entities
				radio = document.getElementById('video');               // Audio/Video
				player = document.querySelector('.player');             // Player
				muteButton = player.querySelector('.mute-button');      // Mute button
				volumeLevel = player.querySelector('.volume-level');    // Volume level
				appTitle = document.querySelector('.player_title');     // Application title
				currentList = document.querySelector('.current');       // Current playing
				previousList = document.querySelector('.previous');     // Previously played
				// Player
				// Play/Pause button
				playButton = player.querySelector('.play-button');
				playButton.dataset['paused'] = Number(isPaused);
				var pauseValue = isPaused ? playTxt : pauseTxt;
				setText(playButton, pauseValue, imagePrefix, imageSuffix);
				playButton.addEventListener('click', function(e) {
					isPaused = playButtonHanler(this, playAudio, stopAudio);
				}, false);
				// Mute button
				setMuteButtonText(muteButton);
				muteButton.addEventListener('click', function(e) {
					isMuted = !isMuted;
					radio['muted'] = isMuted;
					setMuteButtonText(this);
					if (isMuted) {
						volumeLevel['value'] = 0;
					} else {
						volumeLevel['value'] = volume * 100;
					}
				});
				// Volume level
				volumeLevel.addEventListener('change', volumeLevelHandler);
				volumeLevel.addEventListener('input', volumeLevelHandler);

				// Radio event Listeners
				radio.addEventListener('progress', progressListener);
				radio.addEventListener('loadeddata', enableBodyListener);
				radio.addEventListener('seeked', function(event) {
					console.log('seeked');
				});
				radio.addEventListener('error', function(event) {
					console.log('error');
					console.error(event['message']);
					stopAudio();
				});
				select = document.getElementById('src_select');
				select.addEventListener('change', selectChange);
			   srcSelect = document.getElementById('src_select');
			   value = srcSelect['value'];
				document.body.classList.remove('loading');
				timerID = setTimeout(function request() {if (select.value !== ''){
					getTrackData(JSON.parse(select['value'])['request'], currentList, previousList);}
					timerID = setTimeout(request, delay);
				},3000);
				eventEnabled = true;
				console.log('events enabled. eventEnabled: ', eventEnabled);
			});

			function playButtonHanler(button, playHandler, pauseHandler) {
				if (!eventEnabled) return;

				eventEnabled = false;
				button.dataset['paused'] = Number(!Number(button.dataset['paused']));
				var txt;
				var result = Number(button.dataset['paused']);
				if (result) {
					txt = playTxt;
					pauseHandler();
				} else {
					txt = pauseTxt;
					playHandler();
				}
				setText(button, txt, imagePrefix, imageSuffix);

				return Number(button.dataset['paused']);
			};
var currentData;
const tavr = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH-LIEQnJciIUI-0nzHzsfJlRiYA3X95exVMjZE3SJsytCBoHZ082B813yVhGEXfXqCiI&usqp=CAU';

function setCurrentData(data) {
    currentData = data;
    updateMediaMetadata();
}
function updateMediaMetadata() {
    if ('mediaSession' in navigator && 'MediaMetadata' in window && currentData) {
        var mediaMetadata = new MediaMetadata({
            title: currentData.song || '',
            artist: currentData.singer || '',
            artwork: [{
                src: currentData.cover || tavr,
                sizes: currentData.cover ? '500x500' : '200x200',
                type: currentData.cover ? 'image/jpg' : 'image/png'
            }]
        });
        navigator.mediaSession.metadata = mediaMetadata;
    }
}

	function playAudio() {
    audio.pause();
    loadings();
    var srcSelect = document.getElementById('src_select');
    var value = JSON.parse(srcSelect['value']);     
    updateTitle(value['name']);
    radio.src = value['src'];
    radio.addEventListener('stalled', stalledHandler);
    
    if ('mediaSession' in navigator && 'MediaMetadata' in window) {
        updateMediaMetadata(); 
   
        var observer = new MutationObserver(function (mutationsList) {
            if (radio.paused) {
                observer.disconnect();
            } else {
                updateMediaMetadata();
            }
        });
        var observerOptions = { childList: true, subtree: true };
        observer.observe(currentList, observerOptions);
    }

    if (currentHls) {
        currentHls.destroy();
    }
    radio.play();
}

			function stopAudio() {
				if (radio) {
					radio.pause();
					radio.currentTime = 0;
				}
				clearTimeout(timerID);
				isPaused = true;
				eventEnabled = true;
				setText(playButton, playTxt, imagePrefix, imageSuffix);
				document.body.classList.remove('loading');
			};
			function progressListener() {
				eventEnabled = false;
				isPaused = this.paused;
				isMuted = this.muted;
				var txt = pauseTxt;
				if (isPaused) {
					txt = playTxt;
				}
				setText(playButton, txt, imagePrefix, imageSuffix);
				playButton.dataset['paused'] = Number(isPaused);
				document.body.classList.remove('loading');
				eventEnabled = true;
			};

			function enableBodyListener() {
				var txt = 'play';
				if(this.readyState >= 2) {
					txt = 'pause';
					document.body.classList.remove('loading');
					eventEnabled = true;
				} else {
					console.log('there was some error while loading audio');
					stopAudio();
				}
				setText(playButton, txt, imagePrefix, imageSuffix);
			};

			var eventEnabled = true;
	var currentRequest = null; // 用于跟踪当前请求

	function selectChange() {
		if (!eventEnabled) {
			return; // 如果事件被禁用，则不执行任何操作
		}
   
		eventEnabled = false;
		var self = this;
		var value = JSON.parse(self['value']);
		document.body.classList.remove('loading');
        isCurrentlyPolling = false;
        CurrentlyPolling = false; 
		if (currentRequest !== null) {
			 clearTimeout(currentRequest);
		}

		if (radio['paused']) {
			document.body.classList.remove('loading');
		 } else {
			stopAudio();
			playAudio();
		}

		currentRequest = setTimeout(function request() {
			getTrackData(value['request'], currentList, previousList);
			currentRequest = setTimeout(request, delay);
		}, 3000);

		eventEnabled = true;
	}


			function stalledHandler() {
				console.log('stalled');
				loadings();
				stopAudio();
				playAudio();
			};

			function setMuteButtonText(node) {
				if (radio.muted) {
					node.style.backgroundImage = 'url(' + imagePrefix + muteTxt + imageSuffix + ')';
					return;
				}

				node.style.backgroundImage = 'url(' + imagePrefix + speakerTxt[getDiapason(radio['volume'])] + imageSuffix + ')';
			};

			function getDiapason(num) {
				if (num >= 1) return 3;

				if (num > 1/2) return 2;

				if (num > 0) return 1;

				return 0;
			};

			function volumeLevelHandler() {
				var value = this['value'];
				var valueForDec = Number(value/100);

				volume = valueForDec;
				radio['volume'] = valueForDec;

				setMuteButtonText(muteButton);
			};

			function renderData(node, data) {
				if (!Array.isArray(data)) {
					data = [data];
				}
				while (node.firstChild) node.removeChild(node.firstChild);
				Array.prototype.forEach.call(data, function (i) {
					node.appendChild(renderItem(i));
				});
			}

			function setText(destination, value, prefix, suffix) {
				destination.style.backgroundImage = 'url(' + prefix + value + suffix + ')';
			}

	 function renderItem(data) {
	var img = data['cover'] ? 'background-image:url(' + data['cover'] + '); background-size: 100%;' : 'background-image:url(./icons/def.svg); background-size: 100%;';
		var result = document.createElement('li');
		var logo = document.createElement('span');
		var info = document.createElement('span');
		var singer = document.createElement('span');
		var separator = document.createElement('span');
		var song = document.createElement('span');

		result.className = 'playlist_item';
		logo.className = 'playlist_item__logo';
		info.className = 'playlist_item__info';
		singer.className = 'playlist_item__singer';
		separator.className = 'playlist_item__separator';
		song.className = 'playlist_item__song';

		logo.style = img;
		singer.textContent = data['singer'];
		separator.innerHTML = '&nbsp;&mdash;&nbsp;';
		song.textContent = data['song'];
	   
		result.appendChild(logo);
		info.appendChild(singer);
		info.appendChild(separator);
		info.appendChild(song);
		result.appendChild(info);
	if (data['cur_time']) {
		var curTime = document.createElement('span');
		curTime.className = 'playlist_item__cur_time';
		curTime.textContent = data['cur_time'];
		info.insertBefore(curTime, info.firstChild); 

		var onAirText = document.createElement('span');
		onAirText.textContent = 'ON AIR (EEST): ';
		info.insertBefore(onAirText, info.firstChild);
	} else if (data['cur_end_time']) {
		var curEndTime = document.createElement('span');
		curEndTime.className = 'playlist_item__cur_end_time';
		curEndTime.textContent = data['cur_end_time'];
		info.insertBefore(curEndTime, info.firstChild);  

		var onAirText = document.createElement('span');
		onAirText.textContent = 'ON AIR (EEST) End:';
		info.insertBefore(onAirText, info.firstChild);  
	}

		if (data['title']) {
			var title = document.createElement('span');
			title.className = 'playlist_item__title';
			title.textContent = data['title'];
			info.appendChild(title);
		}
		
	function removeSymbols(text) {
	  return text.replace(/[^\p{L}\d\s()]/gu, ' ');
	}    
	if (data['video']) {
			var video = document.createElement('a');
			video.className = 'playlist_item__video';
			video.href = 'https://www.youtube.com/watch?v=' + data['video'];
			video.style.userSelect = 'none';
			video.innerHTML = '<img src="./icons/youtube.svg" alt="YouTube Logo">';
			 info.appendChild(video);    }
			  else if (data['song'] && data['singer']) { 
			  var youtubeLink = document.createElement('a');
	  youtubeLink.href = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(removeSymbols(data['song'] + ' ' + data['singer']));
	  youtubeLink.target = '_blank';
	  youtubeLink.style.userSelect = 'none';
	  youtubeLink.innerHTML = '<img src="./icons/youtube.svg" alt="YouTube Logo">';
	  youtubeLink.classList.add('playlist_item__video');
	  info.appendChild(youtubeLink);
	}

	  if (data['song'] && data['singer']) {
	 
	  var neteaseLink = document.createElement('a');
	  neteaseLink.className = 'playlist_item__netease';
	  neteaseLink.href = (document.body.classList.contains('mobile')
    ? 'https://y.music.163.com/m/'
    : 'https://music.163.com/#/search/m/?s='+ encodeURIComponent(removeSymbols(data['song'] + ' ' + data['singer']))) ;
	  neteaseLink.target = '_blank';
	  neteaseLink.style.userSelect = 'none';
	  neteaseLink.innerHTML = '<img src="./icons/netease.svg" alt="Netease Logo">';
	  info.appendChild(neteaseLink);
	  
	   var spotifyLink = document.createElement('a');
	  spotifyLink.className = 'playlist_item__spotify';
     spotifyLink.href = (document.body.classList.contains('mobile')
    ? 'https://open.spotify.com/search/results/'
    : 'https://open.spotify.com/search/')
    + encodeURIComponent(removeSymbols(data['song'] + ' ' + data['singer']));
      spotifyLink.target = '_blank';
	  spotifyLink.style.userSelect = 'none';
	  spotifyLink.innerHTML = '<img src="./icons/spotify.svg" alt="spotify Logo">';
	  info.appendChild(spotifyLink);
	   const dlLink = document.createElement('a');
	  dlLink.className = 'playlist_item__dl';
	  dlLink.target = '_blank'; 
      let baURL = "https://yym4.com/search/";
      let fiURL = baURL + encodeURIComponent(removeSymbols(data['song'] + ' ' + data['singer']));
	  dlLink.href = fiURL;
	  dlLink.style.userSelect = 'none';
	  dlLink.innerHTML = '<img src="./icons/dl.svg" alt="dl Logo">';
	  info.appendChild(dlLink);
		}
		return result;
	}

		const audio = document.getElementById('audio');
		const inputUrl = document.getElementById('inputUrl');
	let currentHls = null; // Store the current HLS instance
	var selectElement = document.getElementById("src_select");

	var desiredOption = selectElement.querySelector("option[value='']");
let useApiInfo = localStorage.getItem('useApiInfo') === 'true';
const apiCheckbox = document.getElementById('apiinfo');

if (apiCheckbox) {
    apiCheckbox.checked = useApiInfo;
    apiCheckbox.addEventListener('change', (e) => {
        useApiInfo = e.target.checked;
        localStorage.setItem('useApiInfo', useApiInfo);
    });
}
let lastTpid = null;
let currentUpdateTimer = null;
let isCurrentlyPolling = false;
let CurrentlyPolling = false;
async function fetchAndUpdateTrackInfo(id, cover, songInfoDiv) { 
    if (!isCurrentlyPolling) {
        return;
    }
    try {
        const response = await fetch(`https://us.api.iheart.com/api/v3/live-meta/stream/${id}/currentTrackMeta`);
        if (response.ok && isCurrentlyPolling) {
            if (response.status === 204) {
                currentUpdateTimer = setTimeout(() => {
                    fetchAndUpdateTrackInfo(id, cover, songInfoDiv);
                }, 30000);
                return;
            }

            const trackData = await response.json();
            
            updateSongInfo(songInfoDiv, {
                title: trackData.title || '',
                artist: trackData.artist || '',
                cover: trackData.imagePath || cover
            });

            if (trackData.endTime && trackData.startTime) {
                const startTime = dayjs(trackData.startTime).valueOf();
                const endTime = dayjs(trackData.endTime).valueOf();
                const now = dayjs().valueOf();
                
                let timeUntilNext = endTime - now;

                if (timeUntilNext <= 0 || timeUntilNext < 1000) {
                    timeUntilNext = 10000;
                }

                if (currentUpdateTimer) {
                    clearTimeout(currentUpdateTimer);
                }
                
                currentUpdateTimer = setTimeout(() => {
                    fetchAndUpdateTrackInfo(id, cover, songInfoDiv);
                }, timeUntilNext);
            } else {
                currentUpdateTimer = setTimeout(() => {
                    fetchAndUpdateTrackInfo(id, cover, songInfoDiv);
                }, 10000);
            }
        } else {
            currentUpdateTimer = setTimeout(() => {
                fetchAndUpdateTrackInfo(id, cover, songInfoDiv);
            }, 10000);
        }
    } catch (error) {
        console.error('Error fetching track metadata:', error);
        currentUpdateTimer = setTimeout(() => {
            fetchAndUpdateTrackInfo(id, cover, songInfoDiv);
        }, 10000);
    }
}

const corsProxyUrl = 'https://tezworker.chatgpt-api.workers.dev/?';
let bbcUpdateTimer = null;

async function fetchBBCTrackInfo(id, cover, songInfoDiv) {
    const apiUrl = `https://rms.api.bbc.co.uk/v2/services/${id}/segments/latest?experience=domestic&offset=0&limit=1`;
    const proxiedUrl = corsProxyUrl + encodeURIComponent(apiUrl);
    if (!CurrentlyPolling) {
        return;
    }
    try {
        const response = await fetch(proxiedUrl);
        if (response.ok&&CurrentlyPolling) {
            const data = await response.json();
            if (data.data && data.data.length > 0) {
                const segment = data.data[0];
                const artist = segment.titles.primary || 'Artist';
                const title = segment.titles.secondary || 'Title';
                const imageUrl = segment.image_url ? segment.image_url.replace('{recipe}', '320x320') : cover;

                updateSongInfo(songInfoDiv, {
                    title,
                    artist,
                    cover: imageUrl
                });

     const nowPlaying = segment.offset.now_playing || false;
                let nextUpdateInterval = nowPlaying ? 60 : 30;
                if (bbcUpdateTimer) {
                    clearTimeout(bbcUpdateTimer);
                }

                bbcUpdateTimer = setTimeout(() => {
                    fetchBBCTrackInfo(id, cover, songInfoDiv);
                }, nextUpdateInterval * 1000);
            } else {
                console.warn('No track data found in BBC API response. Retrying in 20 seconds.');
                scheduleBBCRetry(id, cover, songInfoDiv, 30);
            }
        } else {
            console.error('Failed to fetch BBC track data:', response.status);
            scheduleBBCRetry(id, cover, songInfoDiv, 30);
        }
    } catch (error) {
        console.error('Error fetching BBC track metadata:', error);
        scheduleBBCRetry(id, cover, songInfoDiv, 30);
    }
}

function scheduleBBCRetry(id, cover, songInfoDiv, interval = 30) {
    if (bbcUpdateTimer) {
        clearTimeout(bbcUpdateTimer);
    }
    bbcUpdateTimer = setTimeout(() => {
        fetchBBCTrackInfo(id, cover, songInfoDiv);
    }, interval * 1000);
}
function innerInfo(data, cover, songInfoDiv) {
    if (!data || data.frag.title.includes("adContext") || data.frag.title.includes("text=\"")) {
        return;
    }

    if (!data.frag.title.includes("url=")) {
        updateSongInfo(songInfoDiv, {
            title: data.frag.title,
            artist: '',
            cover
        });
        return;
    }

    const titleMatch = data.frag.title.match(/title="([^"]*)"/);
    const artistMatch = data.frag.title.match(/artist="([^"]*)"/);
    const tpid = extractTPID(data.frag.title);

    if (!tpid || tpid === "0") {
        handleNonTPIDSong(titleMatch, artistMatch, cover, songInfoDiv);
        return;
    }

    if (lastTpid !== tpid) {
        handleTPIDSong(tpid, titleMatch, artistMatch, cover, songInfoDiv);
    }
}

function extractTPID(title) {
    const tpidPart = title.split('TPID=')[1];
    if (!tpidPart) return null;
    
    const numbersOnly = tpidPart.match(/\d+/);
    return numbersOnly ? numbersOnly[0] : null;
}

function handleNonTPIDSong(titleMatch, artistMatch, cover, songInfoDiv) {
    const programInfo = titleMatch?.[1]?.trim() || "";
    const artistInfo = artistMatch?.[1]?.trim() || "";

    if (!programInfo) {
        songInfoDiv.style.display = 'none';
        return;
    }

    updateSongInfo(songInfoDiv, {
        title: programInfo,
        artist: artistInfo,
        cover
    });
}

function handleTPIDSong(tpid, titleMatch, artistMatch, cover, songInfoDiv) {
    lastTpid = tpid;
    const title = titleMatch?.[1].trim() || '';
    const artist = artistMatch?.[1].trim() || '';
    
    updateSongInfo(songInfoDiv, { title, artist, cover });

    if (useApiInfo) {
        apiInfo(tpid, songInfoDiv, { title, artist, cover });
    }
}

function updateSongInfo(songInfoDiv, { title, artist, cover }) {
    songInfoDiv.innerHTML = '';
    songInfoDiv.style.display = 'flex';

    const coverElement = document.createElement('div');
    coverElement.className = 'song-cover';
    coverElement.style.backgroundImage = `url('${cover}')`;

    const detailsContainer = document.createElement('div');
    detailsContainer.className = 'song-details';

    const textElement = document.createElement('div');
    textElement.className = 'song-text';
    textElement.textContent = artist ? `${artist} - ${title}` : title;

    detailsContainer.appendChild(textElement);

    songInfoDiv.appendChild(coverElement);
    songInfoDiv.appendChild(detailsContainer);
  let songtext = textElement.textContent;
    addLinksToSongInfo(songtext, detailsContainer);
    updateMediaSession(title, artist || "HITFM Player", cover);
}

function addLinksToSongInfo(songtext, detailsContainer) {
    const linksContainer = document.createElement('div');
    linksContainer.className = 'links-container';

    const links = [
        {
            class: 'playlist_item__video',
            url: `https://www.youtube.com/results?search_query=${encodeURIComponent(songtext)}`,
            icon: './icons/youtube.svg',
            alt: 'YouTube Logo'
        },
        {
            class: 'playlist_item__netease',
            url: document.body.classList.contains('mobile')
                ? 'https://y.music.163.com/m/m/'
                : `https://music.163.com/#/search/m/?s=${encodeURIComponent(songtext)}`,
            icon: './icons/netease.svg',
            alt: 'NetEase Logo'
        },
        {
            class: 'playlist_item__spot',
            url: `${document.body.classList.contains('mobile')
                ? 'https://open.spotify.com/search/results/'
                : 'https://open.spotify.com/search/'}${encodeURIComponent(songtext)}`,
            icon: './icons/spotify.svg',
            alt: 'Spotify Logo'
        },
        {
            class: 'playlist_item__dlo',
            url: `https://yym4.com/search/${encodeURIComponent(songtext.replace(/\//g, ''))}`,
            icon: './icons/dl.svg',
            alt: 'dl Logo'
        }
    ];

    links.forEach(link => {
        const anchor = document.createElement('a');
        anchor.className = `music-link ${link.class}`;
        anchor.target = '_blank';
        anchor.href = link.url;
        anchor.innerHTML = `<img src="${link.icon}" alt="${link.alt}">`;
        linksContainer.appendChild(anchor);
    });

    detailsContainer.appendChild(linksContainer);
}

async function apiInfo(trackId, songInfoDiv, fallbackInfo) {
    try {
        const response = await fetch(
            `https://us.api.iheart.com/api/v1/catalog/getTrackByTrackId?trackId=${trackId}`
        );

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const { track } = await response.json();
        if (!track) throw new Error('No track data found in API response');

        const songData = {
            title: track.title || fallbackInfo.title,
            artist: track.artist || fallbackInfo.artist,
            cover: track.imagePath || fallbackInfo.cover
        };
        updateSongInfo(songInfoDiv, songData);
        
        const coverElement = songInfoDiv.querySelector('.song-info-cover');
        if (coverElement && track.imagePath) {
            coverElement.classList.add('song-info-cover-api');
        }

    } catch (error) {
        console.error('Error fetching or parsing track info:', error);
    }
}
function updateMediaSession(title, artist, cover) {
  if ('mediaSession' in navigator && 'MediaMetadata' in window) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: title,
      artist: artist,
      artwork: [{
        src: cover,
        sizes: '200x200',
        type: 'image/png'
      }]
    });
  }
}

function play(url,title,cover,id,mark) {
  loadings();
  if (url && cover && 'mediaSession' in navigator && 'MediaMetadata' in window) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: title,
      artist: 'HITFM Player',
      artwork: [{
        src: cover,
        sizes: '200x200',
        type: 'image/png'
      }]
    });
  }
  const songInfoDiv = document.getElementById('songInfo');
  songInfoDiv.style.display = 'none';
  desiredOption.selected = true;
  audio.pause();
  isCurrentlyPolling = false;
  CurrentlyPolling = false; 
  if (currentHls) {
    currentHls.destroy();
  }
  if (currentRequest !== null) {
    clearTimeout(currentRequest);
  }
  if (Hls.isSupported()) {
    const hls = new Hls();
    currentHls = hls;
    hls.loadSource(url);
    hls.attachMedia(video);

   if (mark === 2 && useApiInfo) {
        isCurrentlyPolling = true;
        fetchAndUpdateTrackInfo(id, cover, songInfoDiv);
    } else if (mark === 3 && useApiInfo) {
         CurrentlyPolling = true;
        fetchBBCTrackInfo(id, cover, songInfoDiv);
    } else {
        hls.on(Hls.Events.FRAG_PARSING_METADATA, (event, data) => {
            innerInfo(data, cover, songInfoDiv);
        });
    }
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      video.play();
    });

function isIgnorableError(errorDetails) {
  const ignorableErrors = [
    Hls.ErrorDetails.BUFFER_APPEND_ERROR,
    Hls.ErrorDetails.bufferStalledError,
    Hls.ErrorDetails.internalException,
    //其他需要忽略的错误类型
  ];
  return ignorableErrors.includes(errorDetails);
}

hls.on(Hls.Events.ERROR, function (event, data) {
  if (isIgnorableError(data.details)) {
    console.warn(`Ignorable error occurred: ${data.details}`);
    return;
  }

  if (data.fatal) {
    switch (data.type) {
      case Hls.ErrorTypes.NETWORK_ERROR:
        console.error('Network error occurred');
        handleUnrecoverableError(` (${data.details})，尝试默认方式`);
        break;
      default:
        console.error(`An unrecoverable error (${data.details}) occurred, stopping load`);
        handleUnrecoverableError(`不可恢复的错误 (${data.details})，停止加载`);
        break;
    }
  } else {
    console.error(`Unhandled error occurred: ${data.details}`);
  }
});

function handleNetworkError(errorDetails) {
  if (navigator.onLine) {
    showNotification('网络错误，尝试重新加载');
    hls.startLoad(); 
    
    setTimeout(() => {
      if (hls.networkDetails && hls.networkDetails.status !== 200) {
        handleUnrecoverableError(`网络错误 (${errorDetails})，无法重新加载`);
      }
    }, 5000);
  } else {
    showNotification('离线状态，等待网络重新连接...');
    window.addEventListener('online', handleNetworkReconnect);
    
    setTimeout(() => {
      if (!navigator.onLine) {
        handleUnrecoverableError(`网络错误 (${errorDetails})，无法重新连接`);
        window.removeEventListener('online', handleNetworkReconnect);
      }
    }, 30000);
  }
}

function handleNetworkReconnect() {
  showNotification('网络已重新连接，尝试重新加载媒体');
  window.removeEventListener('online', handleNetworkReconnect);
  hls.startLoad();
}

function handleUnrecoverableError(message) {
  showNotification(message);
  hls.stopLoad();
  document.body.classList.remove('loading');
  window.openLink(title, url);
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => {
    document.body.removeChild(notification);
  }, 2000);
}
  } else {
    alert('只有m3u8能触发播放，其他格式需要在自定义电台创建按钮播放');
  }
}

	function cplay() {
			const url = inputUrl.value;
			 play(url);
	}

	 const videoModal = document.getElementById('videoModal');
	 const musicModal = document.getElementById('musicModal');
	  const videoContainer = document.getElementById('videoContainer');
	  const video = document.getElementById('video');
	  const showButton = document.getElementById('showButton');
	  const closeButton = document.getElementById('closeButton'); 
	  const at40 = document.getElementById('at40');
	  const closeButton2 = document.getElementById('closeButton2');

	 showButton.addEventListener('click', function () {
    videoModal.classList.add('show'); 
});
     closeButton.addEventListener('click', function () {
    videoModal.classList.remove('show');
});

	 
at40.addEventListener('click', function () {
    musicModal.classList.add('show');
});
closeButton2.addEventListener('click', function () {
    musicModal.classList.remove('show');
});


	let currentChannel = 'hitfm';
    function updateTitle(newTitle) {
  document.title = newTitle;
  appTitle.textContent = newTitle;
  const loaderElement = document.querySelector('.loader');
  if (loaderElement) {
    loaderElement.textContent = newTitle;
  }
}
let timeoutId;
function loadings() {
    clearTimeout(timeoutId);
    document.body.classList.add('loading');
    timeoutId = setTimeout(function() {
        document.body.classList.remove('loading');
    }, 12000);
}
		function playmore(link, title,cover){ 
			const url = link;
			const fileExtension = url.split('.').pop().toLowerCase();
			desiredOption.selected = true;
			if (currentHls) {
				currentHls.destroy();
			}
			 if (currentRequest !== null) {
		clearTimeout(currentRequest);
	  }
			if (fileExtension !== 'm3u8') {
				stopAudio();
				const audio = document.getElementById('video');
				loadings();
				updateTitle(title);
				audio.src = url;

				try {
					const playPromise = audio.play();
					if (playPromise !== undefined) {
						playPromise.then(_ => {
							document.body.classList.remove('loading');
							if ('mediaSession' in navigator && 'MediaMetadata' in window) {
    navigator.mediaSession.metadata = new MediaMetadata({
        title: title,
        artist: 'HITFM Player',
        artwork: [{
            src: cover,
            sizes: '300x300',
            type: 'image/jpg'
        }]
    });
}
						}).catch(error => {//302跳转非直链m3u8无法使用hls.js播放
						 const notification = document.createElement('div');
		notification.className = 'notification';
		notification.textContent = `尝试默认播放方式`;
		 document.body.appendChild(notification);
		 setTimeout(() => {
			document.body.removeChild(notification);
		}, 1000);
		window.openLink(title, url);
						});
					}
				} catch (error) {
		window.openLink(title, url);
				}
			} else {
		   setPlaybackInfo(url, title,cover);
			 }
	   }
	   
 let ihId;
	function setPlaybackInfo(url,title,cover,channel,id,mark) {
	 loadings();
	  inputUrl.value = url;
	  updateTitle(title);
if (url.endsWith('.m3u8')) {
    play(url, title, cover, id, mark);
  } else {
	let link = url;
    playmore(link, title, cover);
  }	  
      currentChannel = channel;
	  updateProgramName(currentChannel);
	  ihId = id;
	}

	function download(data, filename) {
		console.log('downloading...');
		var blob = new Blob([arrayConcat(data)], {
			type: 'application/octet-stream'
		});
		saveAs(blob, filename);
	}

	function arrayConcat(inputArray) {
		var totalLength = inputArray.reduce(function (prev, cur) {
			return prev + cur.length
		}, 0);
		var result = new Uint8Array(totalLength);
		var offset = 0;
		inputArray.forEach(function (element) {
			result.set(element, offset);
			offset += element.length;
		});
		return result;
	}

	function saveAs(blob, filename) {
		var url = URL.createObjectURL(blob);
		var a = document.createElement("a");
		document.body.appendChild(a);
		a.style = "display: none";
		a.href = url;
		a.download = filename;
		a.click();
		window.URL.revokeObjectURL(url);
	}

	var currentRecord = null; // 存储当前录制的数据对象
	var startTime = null; // 记录录制开始的时间
	var recordedTimeElement = document.getElementById('recordedTime');
	 var isRecording = false; // 录制状态标志

	function updateRecordedTime() {
		if (startTime && currentRecord) {
			var currentTime = new Date().getTime();
			var elapsedTime = (currentTime - startTime) / 1000;  
			var elapsedSeconds = parseInt(elapsedTime);  
			recordedTimeElement.textContent = '已录制时长: ' + elapsedSeconds + '秒';  
		}
	}

	function showRecordedTime() {
		recordedTimeElement.style.display = 'block';  
	}

	function hideRecordedTime() {
		recordedTimeElement.style.display = 'none';  
	}

	function stopRecord() {
		if (currentRecord) {
			 var FileName = appTitle.textContent + ".mp3";
			download(currentRecord.data['audio'], FileName);
			currentRecord.hls.destroy();
			currentRecord = null;
			startTime = null;
			hideRecordedTime();
			isRecording = false;
		}
		cplay();
	}


	function startRecord() {
		if (isRecording) {
			 stopRecord();
		} else {
			 if (currentRecord) {
				 currentRecord.hls.destroy();
				currentRecord = null;
			}

			var dataStream = {
				'audio': []
			};
			var hls = new Hls();
			hls.loadSource(inputUrl.value);
			hls.attachMedia(video);
			hls.on(Hls.Events.MANIFEST_PARSED, function () {
				video.play();
				hls.on(Hls.Events.BUFFER_APPENDING, function (event, data) {
					console.log("appending");
					dataStream[data.type].push(data.data);
				});
			});

			currentRecord = {
				hls: hls,
				data: dataStream
			};
			startTime = new Date().getTime();  
			showRecordedTime();  

			 setInterval(updateRecordedTime, 1000);

			audio.onended = function (e) {
				stopRecord();
			}

			isRecording = true;  
		}
	}

	const contentContainer = document.getElementById("content-container");
	const toggleButton = document.getElementById("toggleButton");

	 const isContentHidden = localStorage.getItem("isContentHidden") === "true";

	 contentContainer.style.display = isContentHidden ? "none" : "block";

	 toggleButton.addEventListener("click", () => {
		if (contentContainer.style.display === "none" || contentContainer.style.display === "") {
			contentContainer.style.display = "block";  
			localStorage.setItem("isContentHidden", "false");  
		} else {
			contentContainer.style.display = "none";  
			localStorage.setItem("isContentHidden", "true");  
		}
	});
	const tavrContainer = document.getElementById("tavr-container");
	const toggButton = document.getElementById("toggButton");

	 const isConHidden = localStorage.getItem("isConHidden") === "true";

	 tavrContainer.style.display = isConHidden ? "none" : "block";

	 toggButton.addEventListener("click", () => {
		if (tavrContainer.style.display === "none" || tavrContainer.style.display === "") {
			tavrContainer.style.display = "block";  
			localStorage.setItem("isConHidden", "false");  
		} else {
			tavrContainer.style.display = "none";  
			localStorage.setItem("isConHidden", "true");  
		}
	});

	const savedContainer = document.getElementById("savedC");

	 savedContainer.addEventListener("mouseenter", () => {
	  savedContainer.style.overflowY = "overlay";  
	});

	savedContainer.addEventListener("mouseleave", () => {
	  savedContainer.style.overflowY = "hidden";  
	});
	
	document.addEventListener("DOMContentLoaded", function() { 
 const radioButtons = document.querySelectorAll('.radio-button');
    radioButtons.forEach(button => {
        const iconDiv = button.querySelector('.radio-icon');
        if (iconDiv && button.dataset.image) {
            iconDiv.style.backgroundImage = `url(${button.dataset.image})`;
        }
    });
    const lastViewedPage = localStorage.getItem('lastViewedPage');
    const initialPage = lastViewedPage ? parseInt(lastViewedPage) : 1;

    const pages = document.querySelectorAll('.rpage');
    pages.forEach((page, index) => {
        if (index + 1 === initialPage) {
            page.classList.remove('inactive');
        } else {
            page.classList.add('inactive');
        }
    });

    updatePaginationButtons(initialPage);
    updatePaginationIndicator(initialPage);

    initPagination();
		const openMenuButton = document.getElementById("openMenuButton");
		const menu = document.getElementById("menu");
		const menuContent = document.getElementById("menuContent");
		const menuContent2 = document.getElementById("menuContent2");
		const addRowButton = document.getElementById("addRowButton");
		const exportM3uFile = document.getElementById("exportM3uFile");
		const reM3uFile = document.getElementById("reM3uFile");
		const saveButton = document.getElementById("saveButton");
		const savedContent = document.getElementById("savedContent");
		const closeMenuButton = document.getElementById("closeMenuButton");  
		
		var select = document.getElementById("src_select");
		var previousPlaylistWrapper = document.getElementById("previous_playlist_wrapper");   
		select.addEventListener("change", function () {
			if (select.value === '') {

				if (previousPlaylistWrapper) {
					previousPlaylistWrapper.style.display = "none"; // Hide
				}
			} else {
				if (previousPlaylistWrapper) {
					previousPlaylistWrapper.style.display = "block"; // Show
				}
			}
		});
		
const subscribeButton = document.getElementById('subscribeButton');
const subscribeModal = document.getElementById('subscribeModal');
const close = document.getElementById('close');
const close2 = document.getElementById('close2');

subscribeButton.addEventListener('click', () => {
  subscribeModal.classList.remove('hidden');
});

close.addEventListener('click', () => {
  subscribeModal.classList.add('hidden');
});
close2.addEventListener("click", function () {
    menu.style.opacity = 0;
    menu.style.transform = 'translateY(-20px)';
    setTimeout(() => {
        menu.classList.add("hidden");
    }, 500);
});
	 
	let db;
	const dbName = 'Mradio';
	const dbVersion = 1;
	const request = indexedDB.open(dbName, dbVersion);

	request.onerror = function (event) {
		console.error('IndexedDB error:', event.target.errorCode);
	};

	request.onupgradeneeded = function (event) {
		db = event.target.result;  // Set db in the upgrade needed event
		db.createObjectStore('m3uContent', { keyPath: 'id' });
	};

	request.onsuccess = function (event) {
		db = event.target.result;  // Set db in the success event
		console.log('IndexedDB opened successfully');
		// Load from IndexedDB on page load
		displayStoredContent();
	};

	 const parseButton = document.getElementById('parseM3U');
	 parseButton.addEventListener('click', parseM3UFromTextarea);

async function parseM3UFromTextarea() {
    const m3uContent = document.getElementById('m3uTextarea').value;
    const urlPattern = /^(http(s)?:\/\/)/;

    function showNotification(message, duration = 2100) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        if (duration > 0) {
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, duration);
        }
        return notification;
    }

    function updateNotification(notification, message, autoHide = true) {
        if (notification) {
            notification.textContent = message;
            if (autoHide) {
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 3000);
            }
        }
    }

    if (urlPattern.test(m3uContent.trim())) {
        let notification = showNotification('文件获取中...', 0);
        try {
            const response = await fetch(m3uContent);

            if (!response.ok) {
                updateNotification(notification, '获取失败');
                return;
            }

            const contentLength = response.headers.get('content-length');
            if (!contentLength) {
                updateNotification(notification, '无法获取文件大小');
                return;
            }

            const total = parseInt(contentLength, 10);
            let loaded = 0;

            const reader = response.body.getReader();
            const stream = new ReadableStream({
                async start(controller) {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        loaded += value.byteLength;
                        updateNotification(notification, `加载中... ${(loaded / total * 100).toFixed(2)}%`, false);
                        controller.enqueue(value);
                    }
                    controller.close();
                    reader.releaseLock();
                }
            });

            const m3uData = await new Response(stream).text();
            const parsedData = parseM3U(m3uData);
            updateMenuContent(parsedData);
            updateNotification(notification, '获取成功');
        } catch (error) {
            console.error('An error occurred while fetching the M3U file:', error);
            updateNotification(notification, '获取失败');
        }
    } else {
        const parsedData = parseM3U(m3uContent);
        updateMenuContent(parsedData);
    }
}


	function storeGroupContent(groupName, groupData) {
		const transaction = db.transaction(['m3uContent'], 'readwrite');
		const objectStore = transaction.objectStore('m3uContent');

		// Convert the data to a JSON string before storing
		const dataToStore = JSON.stringify(groupData);

		const addRequest = objectStore.put({ id: groupName, data: dataToStore });

		addRequest.onsuccess = function (event) {
			console.log(`Group '${groupName}' data added to IndexedDB successfully.`);
			const notification = document.createElement('div');
		notification.className = 'notification';
		notification.textContent = `  '${groupName}' 已成功存储`;
		 document.body.appendChild(notification);
		 setTimeout(() => {
			document.body.removeChild(notification);
		}, 2000);
		};

		addRequest.onerror = function (event) {
			console.error(`Error adding group '${groupName}' data to IndexedDB:`, event.target.errorCode);
		};
	}

	function clearGroupContent(groupName,groupData) {
		const transaction = db.transaction(['m3uContent'], 'readwrite');
		const objectStore = transaction.objectStore('m3uContent');

		const deleteRequest = objectStore.delete(groupName,groupData);

		deleteRequest.onsuccess = function (event) {
			console.log(`Data for group '${groupName}' cleared successfully.`);
			const notification = document.createElement('div');
		notification.className = 'notification';
		notification.textContent = `  '${groupName}' 已成功删除`;
		 document.body.appendChild(notification);
		 setTimeout(() => {
			document.body.removeChild(notification);
		}, 2000);
			displayStoredContent();
		};

		deleteRequest.onerror = function (event) {
			console.error(`Error clearing data for group '${groupName}':`, event.target.errorCode);
		};
	}

	function displayStoredContent() {
		const transaction = db.transaction(['m3uContent'], 'readonly');
		const objectStore = transaction.objectStore('m3uContent');
		const menuContent2 = document.getElementById('menuContent2');
		menuContent2.innerHTML = '';
		objectStore.openCursor().onsuccess = function (cursorEvent) {
			const cursor = cursorEvent.target.result;

			if (cursor) {
				const groupName = cursor.value.id; 

				 const getRequest = objectStore.get(groupName);

				getRequest.onsuccess = function (event) {
					const storedData = event.target.result;
					if (typeof storedData.data === 'string') {
						try {
							const groupData = JSON.parse(storedData.data);
							// Create containers for each group
	const groupContainer = document.createElement('div');
	groupContainer.className = 'groupContainer';
	groupContainer.style.display = 'none';

	const groupButton = document.createElement('a');
	groupButton.className = 'groupButton';
	groupButton.textContent = groupName;

	groupButton.addEventListener('click', function() {
    if (groupContainer.style.maxHeight === '0px' || groupContainer.style.maxHeight === '') {
        groupContainer.style.display = 'block';
        window.getComputedStyle(groupContainer).height;        
        const scrollHeight = groupContainer.scrollHeight + 'px';
        groupContainer.style.maxHeight = scrollHeight;
        groupContainer.style.padding = '10px'; 
    } else {
        groupContainer.style.maxHeight = '0px';
        groupContainer.style.padding = '0px';
        setTimeout(() => {
            groupContainer.style.display = 'none';
        }, 500);
    }
});

	menuContent2.appendChild(groupButton);

			 groupData.forEach(({ tvgLogo, name, link }) => {
				const imgContainer = document.createElement('div');
				imgContainer.className = 'img-container';

				const image = document.createElement('img');
				image.src = tvgLogo;
				image.classList.add('rimg');
				image.loading = 'lazy';

				const nameElement = document.createElement('p');
				nameElement.textContent = name;
				nameElement.classList.add('t');

				imgContainer.appendChild(image);
				imgContainer.appendChild(nameElement);
				 let cover = image.src;
								imgContainer.onclick = () => playLinkContent(name, link,cover);
	 
								imgContainer.addEventListener('contextmenu', (e) => {
		e.preventDefault();
		showContextMenu(e.clientX, e.clientY, name, link, () => saveContent(link, name, imgContainer), () => deleteImgContainer(imgContainer, groupName));
	});

				let touchStartX, touchStartY;
	let isScrolling = false;

	imgContainer.addEventListener('touchstart', (e) => {
	  e.preventDefault();
	  touchStartX = e.touches[0].clientX;
	  touchStartY = e.touches[0].clientY;
	  isScrolling = false;

	  longPressTimer = setTimeout(() => {
		if (!isScrolling) {
		  showContextMenu(touchStartX, touchStartY, name, link, () => saveContent(link, name, imgContainer), () => deleteImgContainer(imgContainer, groupName));
		}
	  }, 500);
	}, { passive: true });

	imgContainer.addEventListener('touchmove', (e) => {
	  const touchMoveX = e.touches[0].clientX;
	  const touchMoveY = e.touches[0].clientY;
	  const deltaX = Math.abs(touchMoveX - touchStartX);
	  const deltaY = Math.abs(touchMoveY - touchStartY);

	   if (deltaX > 2 || deltaY > 2) {
		isScrolling = true;
		clearTimeout(longPressTimer);
	  }
	});

	imgContainer.addEventListener('touchend', () => {
	  clearTimeout(longPressTimer);

	  if (!isScrolling) {
		playLinkContent(name, link,cover);
	  }
	});
				  groupContainer.appendChild(imgContainer);
							});

							menuContent2.appendChild(groupContainer);
							const clearButton = document.createElement('button');
							clearButton.classList.add('clear-button');
							clearButton.textContent = '删除本组';
							clearButton.onclick = () => clearGroupContent(groupName,groupData);
							groupContainer.appendChild(clearButton);
							cursor.continue();
						} catch (error) {
							console.error('Error parsing JSON:', error);
							cursor.continue();
						}
					} else {
						
						cursor.continue();
					}
				};

				getRequest.onerror = function (event) {
					console.error(`Error getting group '${groupName}' data from IndexedDB:`, event.target.errorCode);
					cursor.continue();
				};
			} else {
				
			}
		};
	}
	function deleteImgContainer(imgContainer, groupName) {
		const itemName = imgContainer.querySelector('p').textContent;
		imgContainer.remove();

		const transaction = db.transaction(['m3uContent'], 'readwrite');
		const objectStore = transaction.objectStore('m3uContent');
		const getRequest = objectStore.get(groupName);
		getRequest.onsuccess = function (event) {
			const storedData = event.target.result;

			if (storedData && typeof storedData.data === 'string') {
				try {
					const groupData = JSON.parse(storedData.data);
					const indexToDelete = groupData.findIndex(item => item.name === itemName);
					if (indexToDelete !== -1) {
						groupData.splice(indexToDelete, 1);
						const dataToStore = JSON.stringify(groupData);
						const updateRequest = objectStore.put({ id: groupName, data: dataToStore });
						updateRequest.onsuccess = function () {
							console.log(`Item '${itemName}' deleted from group '${groupName}'`);
							const notification = document.createElement('div');
		notification.className = 'notification';
		notification.textContent = `'${itemName}'已删除`;
		 document.body.appendChild(notification);
		 setTimeout(() => {
			document.body.removeChild(notification);
		}, 1000);
						};
						updateRequest.onerror = function (event) {
							console.error(`Error updating group '${groupName}':`, event.target.errorCode);
						};
					}
				} catch (error) {
					console.error('Error parsing JSON:', error);
				}
			}
		};
		getRequest.onerror = function (event) {
			console.error(`Error getting group '${groupName}' data from IndexedDB:`, event.target.errorCode);
		};
	}

	reM3uFile.addEventListener("click", function () {
		const fileInput = document.createElement('input');
		fileInput.type = 'file';
		 fileInput.addEventListener('change', function (event) {
			const file = event.target.files[0];
			
			if (file) {
				const reader = new FileReader();
				
				reader.onload = function (e) {
					const m3uData = e.target.result;
					const parsedData = parseM3U(m3uData);
					updateMenuContent(parsedData);
				};
				
				reader.readAsText(file);
			}
		});
		fileInput.click();
	});
	exportM3uFile.addEventListener("click", function (){
		const transaction = db.transaction(['m3uContent'], 'readonly');
		const objectStore = transaction.objectStore('m3uContent');
		const allData = {};

		transaction.oncomplete = function () {
			const m3uContent = generateM3uFileContent(allData);
			downloadM3uFile(m3uContent);
		};

		objectStore.openCursor().onsuccess = function (cursorEvent) {
			const cursor = cursorEvent.target.result;
			if (cursor) {
				const groupName = cursor.value.id;
				const getRequest = objectStore.get(groupName);
				console.log(groupName);
				getRequest.onsuccess = function (event) {
					const storedData = event.target.result;
					if (typeof storedData.data === 'string') {
						try {
							const groupData = JSON.parse(storedData.data);
							allData[groupName] = groupData;
						} catch (error) {
							console.error('Error parsing JSON:', error);
						}
					}
					cursor.continue();
				};
				getRequest.onerror = function (event) {
					console.error(`Error getting group '${groupName}' data from IndexedDB:`, event.target.errorCode);
					cursor.continue();
				};
			}
		};
	});

	function generateM3uFileContent(dataObject) {
		let m3uContent = "#EXTM3U\n";
		for (const groupName in dataObject) {
			if (dataObject.hasOwnProperty(groupName)) {
				const groupData = dataObject[groupName];

				groupData.forEach(({ tvgLogo, name, link }) => {
					m3uContent += `#EXTINF:-1 group-title="${groupName}" tvg-logo="${tvgLogo}", ${name}\n${link}\n`;
				});
			}
		}
		return m3uContent;
	}

	function downloadM3uFile(content) {
		const blob = new Blob([content], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'exported.m3u';
		a.click();
		URL.revokeObjectURL(url);
	}

	function updateMenuContent(data) {
		const menuContent2 = document.getElementById('menuContent2');

		Object.keys(data).forEach(groupName => {
			const groupContainer = document.createElement('div');
	groupContainer.className = 'groupContainer';
	groupContainer.style.display = 'none';

	const groupButton = document.createElement('a');
	groupButton.className = 'groupButton';
	groupButton.textContent = groupName;

	groupButton.addEventListener('click', function() {
    if (groupContainer.style.maxHeight === '0px' || groupContainer.style.maxHeight === '') {
        groupContainer.style.display = 'block';
        window.getComputedStyle(groupContainer).height;
        
        const scrollHeight = groupContainer.scrollHeight + 'px';
        groupContainer.style.maxHeight = scrollHeight;
        groupContainer.style.padding = '10px';  
    } else {
        groupContainer.style.maxHeight = '0px';
        groupContainer.style.padding = '0px';
        setTimeout(() => {
            groupContainer.style.display = 'none';
        }, 500);
    }
});

	menuContent2.appendChild(groupButton);
			data[groupName].forEach(({ tvgLogo, name, link }) => {
				const imgContainer = document.createElement('div');
				imgContainer.className = 'img-container';

				const image = document.createElement('img');
				image.src = tvgLogo;
				image.classList.add('rimg');
				image.loading = 'lazy';

				const nameElement = document.createElement('p');
				nameElement.textContent = name;
				nameElement.classList.add('t');

				imgContainer.appendChild(image);
				imgContainer.appendChild(nameElement);
				let cover = image.src;
				imgContainer.addEventListener('click', () => playLinkContent(name, link,cover));
	 
				imgContainer.addEventListener('contextmenu', (e) => {
		e.preventDefault();
		showContextMenu(e.clientX, e.clientY, name, link, () => saveContent(link, name, imgContainer), () => deleteImgContainer(imgContainer, groupName));
	});


					  let touchStartX, touchStartY;
	let isScrolling = false;

	imgContainer.addEventListener('touchstart', (e) => {
	  e.preventDefault();
	  touchStartX = e.touches[0].clientX;
	  touchStartY = e.touches[0].clientY;
	  isScrolling = false;

	  longPressTimer = setTimeout(() => {
		if (!isScrolling) {
		  showContextMenu(touchStartX, touchStartY, name, link, () => saveContent(link, name, imgContainer), () => deleteImgContainer(imgContainer, groupName));
		}
	  }, 500);
	}, { passive: true });

	imgContainer.addEventListener('touchmove', (e) => {
	  const touchMoveX = e.touches[0].clientX;
	  const touchMoveY = e.touches[0].clientY;
	  const deltaX = Math.abs(touchMoveX - touchStartX);
	  const deltaY = Math.abs(touchMoveY - touchStartY);

	   if (deltaX > 2 || deltaY > 2) {
		isScrolling = true;
		clearTimeout(longPressTimer);
	  }
	});

	imgContainer.addEventListener('touchend', () => {
	  clearTimeout(longPressTimer);

	  if (!isScrolling) {
		playLinkContent(name, link,cover);
	  }
	});
		  groupContainer.appendChild(imgContainer);
			});
			menuContent2.appendChild(groupContainer);
		const groupData = data[groupName];
		const storeButton = document.createElement('button');
		storeButton.classList.add('clear-button');
		storeButton.textContent = '存储本组'; 
		storeButton.onclick = () => storeGroupContent(groupName,groupData);
		groupContainer.appendChild(storeButton);    
		});
	}
	 let activeContextMenu = null;

	function showContextMenu(x, y, name, link, onSaveCallback, onDeleteCallback) {
		if (activeContextMenu) {
			document.body.removeChild(activeContextMenu);
			activeContextMenu = null;
		}

		const contextMenu = document.createElement('div');
		contextMenu.className = 'context-menu';
		contextMenu.style.position = 'absolute';
		contextMenu.style.left = x + 'px';

		 const menuHeight = 50;
	const windowHeight = window.innerHeight;
	const scrollTop = window.scrollY || document.documentElement.scrollTop;

	const topPosition = Math.min(y - menuHeight + scrollTop, windowHeight - menuHeight + scrollTop);
	contextMenu.style.top = topPosition + 'px';


		contextMenu.style.zIndex = '1000';
		contextMenu.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
		contextMenu.style.borderRadius = '8px';
		contextMenu.style.padding = '10px';
		contextMenu.style.color = '#ffffff';

		const playOption = document.createElement('div');
		playOption.textContent = '新标签播放';
		playOption.style.color = '#ffffff';
		playOption.style.marginBottom = '2px';
		playOption.style.borderBottom = '2px solid #fff';playOption.style.cursor = 'pointer';
		playOption.addEventListener('click', () => playnewLink(name, link));
		
		const potOption = document.createElement('div');
		potOption.textContent = 'PotPlayer播放';
		potOption.style.color = '#ffffff';
		potOption.style.marginBottom = '2px';
		potOption.style.borderBottom = '2px solid #fff';potOption.style.cursor = 'pointer';
		potOption.addEventListener('click', () => pot(name,link));
		
		const vlcOption = document.createElement('div');
		vlcOption.textContent = 'VLC播放';
		vlcOption.style.color = '#ffffff';
		vlcOption.style.marginBottom = '2px';
		vlcOption.style.borderBottom = '2px solid #fff';vlcOption.style.cursor = 'pointer';
		vlcOption.addEventListener('click', () => vlc(name,link));
		
		const mpvOption = document.createElement('div');
		mpvOption.textContent = 'MPV播放';
		mpvOption.style.color = '#ffffff';
		mpvOption.style.marginBottom = '2px';
		mpvOption.style.borderBottom = '2px solid #fff';mpvOption.style.cursor = 'pointer';
		mpvOption.addEventListener('click', () => mpv(name,link));

		const saveOption = document.createElement('div');
		saveOption.textContent = '添加至主页';
		saveOption.style.color = '#ffffff';
		saveOption.style.cursor = 'pointer';
		saveOption.addEventListener('click', () => {
		onSaveCallback(link, name);
		const notification = document.createElement('div');
		notification.className = 'notification';
		notification.textContent = `'${name}' 已添加`;
		document.body.appendChild(notification);
		setTimeout(() => {
			document.body.removeChild(notification);
		}, 1000);
	});
   
		const delOption = document.createElement('div');
		delOption.textContent = '删除';
		delOption.style.color = '#ffffff';
		delOption.style.marginBottom = '2px';
		delOption.style.borderBottom = '2px solid #fff';delOption.style.cursor = 'pointer';
		delOption.addEventListener('click', () => onDeleteCallback(name));
		contextMenu.appendChild(playOption);
		contextMenu.appendChild(potOption);
		contextMenu.appendChild(vlcOption);
		contextMenu.appendChild(mpvOption);
		contextMenu.appendChild(delOption);
		contextMenu.appendChild(saveOption);

		document.body.appendChild(contextMenu);

		activeContextMenu = contextMenu;

		document.addEventListener('click', () => {
			if (activeContextMenu) {
				document.body.removeChild(activeContextMenu);
				activeContextMenu = null;
			}
		});
	}
	function playnewLink(name, link){
				const title = name;
				updateTitle(title);
				window.open(link, "_blank");}
	
	function compress(str) {
    return btoa(String.fromCharCode(...pako.gzip(str)));
};

let app_name = null;

	function pot(name,link){
	app_name = 'PotPlayer';
    args = [`"${link}"`, `--force-media-title="${name}"`];
	window.open(`ush://${app_name}?${compress(args.join(' '))}`, '_self');			
	appTitle.textContent = name;
	}
        function vlc(name,link){
		app_name = 'VLC';
		args = [`"${link}"`, `--force-media-title="${name}"`];
		window.open(`ush://${app_name}?${compress(args.join(' '))}`, '_self');	
    appTitle.textContent = name;
	}
	function mpv(name,link){
	app_name = 'MPV';
    args = [`"${link}"`, `--force-media-title="${name}"`];
	window.open(`ush://${app_name}?${compress(args.join(' '))}`, '_self');			
	appTitle.textContent = name;
	}
			const dfselect = document.getElementById('dfex');
    dfselect.value = localStorage.getItem('defaultPlayer') || '新标签页';

    dfselect.addEventListener('change', function() {
        const choice = dfselect.value;
        localStorage.setItem('defaultPlayer', choice);
    });

    window.openLink = function(name, link) {
        const choice = dfselect.value;
        switch (choice) {
            case '新标签页':
                window.open(link, '_blank');
                break;
            case 'Potplayer':
                pot(name, link);
                break;
            case 'Vlc':
                vlc(name, link);
                break;
            case 'Mpv':
                mpv(name, link);
                break;
            default:
                window.open(link, '_blank');
        }
    }	
	 function saveContent(link, title, imgContainer) {
		const savedContent = document.getElementById('savedContent');
		const clonedContainer = imgContainer.cloneNode(true);
		// Attach the click event listener to the cloned container
		const image = clonedContainer.querySelector('img');
		const nameElement = clonedContainer.querySelector('p');
		nameElement.classList.remove('t');
		image.loading = 'lazy';
		let cover = image;
		image.onclick = () => playmore(link, title,cover);

		savedContent.appendChild(clonedContainer);
		// Save data to localStorage
		saveToLocalStorage(link, title, imgContainer.innerHTML);
	}

	function saveToLocalStorage(link, title, content) {
		 const savedData = JSON.parse(localStorage.getItem('savedData')) || [];
		 const imgSrc = (new DOMParser().parseFromString(content, 'text/html').querySelector('img')).src;
		 const nextId = savedData.length > 0 ? savedData[savedData.length - 1].id + 1 : 1;

		 savedData.push({ id: nextId, link, name: title, imageBase64: imgSrc });
		 localStorage.setItem('savedData', JSON.stringify(savedData));
		 console.log('Data saved to localStorage:', { id: nextId, link, title, imgSrc });

		 updateSavedContent(savedData);
	}

	function loadSavedContent() {
		const savedContent = document.getElementById('savedContent');
		 const savedData = JSON.parse(localStorage.getItem('savedData')) || [];
		 console.log('Data loaded from localStorage:', savedData);

		 savedData.forEach(item => {
			const clonedContainer = document.createElement('div');

			 const img = document.createElement('img');
			img.src = item.imageBase64;

			 const nameElement = document.createElement('p');
			nameElement.textContent = item.name;

			 clonedContainer.appendChild(img);
			clonedContainer.appendChild(nameElement);
					let cover = img.src;
			img.loading = 'lazy';
			img.onclick = () => playmore(item.link, item.name,cover);

			savedContent.appendChild(clonedContainer);
		});
	}

	document.addEventListener('DOMContentLoaded', loadSavedContent);
	 
	 function parseM3U(m3uData) {
		const lines = m3uData.split('#EXTINF');

		let groups = {};
		let currentGroup = '';

		lines.forEach(line => {
			if (line.trim() !== '') {
				const groupNameMatch = /group-title="([^"]+)"/.exec(line);
				const groupName = groupNameMatch ? groupNameMatch[1] : 'Other';

				if (!groups[groupName]) {
					groups[groupName] = [];
				}

				const tvgLogoMatch = /tvg-logo="([^"]+)"/.exec(line);
				const tvgLogo = tvgLogoMatch ? tvgLogoMatch[1] : '';
				const commaIndex = line.lastIndexOf(',');
				const nameAndLinkPart = line.substring(commaIndex + 1).trim();
				const spaceIndex = nameAndLinkPart.indexOf(' ');
				
				let name, link;
				const urlRegex = /(http[s]?:\/\/\S+|rtmp:\/\/\S+)/;
				const urlMatch = urlRegex.exec(nameAndLinkPart);

				if (urlMatch) {
					 name = nameAndLinkPart.substring(0, urlMatch.index).trim();
					link = urlMatch[0];
				} else {
					 name = nameAndLinkPart;
					link = '';  
				}

				groups[groupName].push({ tvgLogo, name, link });
				currentGroup = groupName;
			}
		});
		return groups;
	}

	function playLinkContent(name,link,cover) {
			   audio.pause();
		 const title = name;
		 playmore(link, title,cover);
	  }
		openMenuButton.addEventListener("click", function () {
    menu.classList.remove("hidden");
    setTimeout(() => {
        menu.style.opacity = 1;
        menu.style.transform = 'translateY(0)';
    }, 10);
});


	addRowButton.addEventListener("click", function () {
		const row = createRow("", "", "");
		const imgContainer = row.querySelector(".img-container");
		const imageInput = row.querySelector(".image-input");
		imgContainer.style.background = "url('./icons/pic.svg') center center / cover no-repeat";
		row.insertBefore(imgContainer, row.firstChild);
		row.insertBefore(imageInput, row.firstChild);
		menuContent.appendChild(row);

		imageInput.addEventListener("change", function () {
			const file = imageInput.files[0];
			const reader = new FileReader();
			reader.onload = function (e) {
				imgContainer.style.background = "none";
				const selectedImage = document.createElement("img");
				selectedImage.src = e.target.result;
				selectedImage.classList.add("rimg");
				imgContainer.innerHTML = "";
				imgContainer.appendChild(selectedImage);
			};
			reader.readAsDataURL(file);
		});
	});

		saveButton.addEventListener("click", function () {
		const rows = menuContent.getElementsByClassName("menu-row");

		 const savedData = JSON.parse(localStorage.getItem("savedData")) || [];

		 savedData.length = 0;

		for (let i = 0; i < rows.length; i++) {
			const row = rows[i];
			const linkInput = row.querySelector(".link-input");
			const nameInput = row.querySelector(".name-input");
			const imageInput = row.querySelector(".image-input");

			const imageFile = imageInput.files[0];
			const linkValue = linkInput.value;
			const nameValue = nameInput.value;

			if (linkValue && nameValue) {
				if (imageFile) {
					const reader = new FileReader();
					reader.onload = function (event) {
						const imageBase64 = event.target.result;
						const id = getNewId();

						row.dataset.link = linkValue;
						row.dataset.title = nameValue;

						savedData.push({
							id,
							imageBase64: imageBase64,
							link: linkValue,
							name: nameValue,
						});

						saveDataToLocalStorage(savedData);
						updateSavedContent(savedData);
						resetMenu();
					};

					reader.readAsDataURL(imageFile);
				} else {
					const imgContainer = row.querySelector(".img-container");
					const img = imgContainer.querySelector("img");
					const imageBase64 = img ? img.src : "";
					const id = getNewId();

					row.dataset.link = linkValue;
					row.dataset.title = nameValue;

					savedData.push({
						id,
						imageBase64: imageBase64,
						link: linkValue,
						name: nameValue,
					});
				}
			}
		}
		saveDataToLocalStorage(savedData);
		updateSavedContent(savedData);
		const notification = document.createElement('div');
		notification.className = 'notification';
		notification.textContent = `已保存`;
		 document.body.appendChild(notification);
		 setTimeout(() => {
			document.body.removeChild(notification);
		}, 2000);
	});

	function getNewId() {
		const savedData = JSON.parse(localStorage.getItem("savedData")) || [];
		return savedData.length > 0 ? savedData[savedData.length - 1].id + 1 : 1;
	}

	   function createRow(imageBase64, linkValue, nameValue, isSaved = false) {
			const row = document.createElement("div");
			row.classList.add("menu-row");

			  const imgContainer = document.createElement("div");
		imgContainer.classList.add("img-container");
		imgContainer.addEventListener("click", function () {
			imageInput.click();
		});

		const imageInput = document.createElement("input");
		imageInput.type = "file";
		imageInput.classList.add("image-input");
		imageInput.style.display = "none"; 
		imageInput.addEventListener("change", function () {
	 
			const file = imageInput.files[0];
			const reader = new FileReader();
			reader.onload = function (e) {
				const image = document.createElement("img");
				image.src = e.target.result;
				image.classList.add("rimg");
				imgContainer.innerHTML = "";
				imgContainer.appendChild(image);
			};
			reader.readAsDataURL(file);
		});
	const infoinput = document.createElement("div");
	infoinput.classList.add("infoinput");

	const linkInput = document.createElement("input");
	linkInput.type = "text";
	linkInput.classList.add("link-input");
	linkInput.value = linkValue; 
	linkInput.placeholder = "链接"; 

	const nameInput = document.createElement("input");
	nameInput.type = "text";
	nameInput.classList.add("name-input");
	nameInput.value = nameValue; 
	nameInput.placeholder = "名称";

			const deleteButton = document.createElement("button");
			deleteButton.textContent = "删除";
			deleteButton.classList.add("infoinput");

			deleteButton.addEventListener("click", function () {
				const id = parseInt(row.dataset.id);
				const savedData = JSON.parse(localStorage.getItem("savedData")) || [];
				const newData = savedData.filter(function (data) {
					return data.id !== id;
				});
				localStorage.setItem("savedData", JSON.stringify(newData));
				 menuContent.removeChild(row);
				 updateSavedContent(newData);
			});

			 let rowData = {
				link: linkValue,
				title: nameValue,
			};

			row.appendChild(imgContainer);  
			row.appendChild(imageInput);
			row.appendChild(infoinput);
			 infoinput.appendChild(linkInput);
			 infoinput.appendChild(nameInput);
			row.appendChild(deleteButton);

			 if (imageBase64 && isSaved) {
				const image = document.createElement("img");
				image.src = imageBase64;
				image.classList.add("rimg");
				imgContainer.appendChild(image);
			}
	 
			return row;
		}

		 function saveDataToLocalStorage(data) {
			localStorage.setItem("savedData", JSON.stringify(data));
		}

		function attachClickEvent(imgContainer, link, title,cover) {
		imgContainer.addEventListener("click", function () {
		 playmore(link, title,cover);
		});
	}

		 function updateSavedContent(data) {
			savedContent.innerHTML = "";

			data.sort((a, b) => a.id - b.id); // 根据序号排序

			data.forEach(function (item) {
				const imgContainer = document.createElement("div");
				imgContainer.classList.add("img-container");

				const image = document.createElement("img");
				image.src = item.imageBase64;
				image.classList.add("rimg");

				const name = document.createElement("p");
				name.textContent = item.name;

				imgContainer.appendChild(image);
				imgContainer.appendChild(name);

				savedContent.appendChild(imgContainer);
				let cover = image.src;
				// 使用闭包为每个图片容器添加点击事件
				attachClickEvent(imgContainer, item.link, item.name,cover);
			});
		}
	function restoreDataFromLocalStorage() {
		const savedData = JSON.parse(localStorage.getItem("savedData")) || [];
		updateSavedContent(savedData);

		// 在菜单中恢复已保存的数据
		savedData.forEach(function (data, index) {
			const { imageBase64, link, name } = data;
			const row = createRow(imageBase64, link, name, true);
			row.dataset.id = index + 1; 
			menuContent.appendChild(row);
		});

		const toggleButton = document.createElement('div');
toggleButton.className = 'groupButton';
toggleButton.textContent = '主页电台';
menuContent.className = 'groupContainer';
menuContent.style.overflow = 'hidden';
menuContent.style.transition = 'max-height 0.5s ease, padding 0.5s ease';
menuContent.style.maxHeight = '0'; 
menuContent.style.padding = '0';

const isMenuExpanded = localStorage.getItem('menuContentIsExpanded');
if (isMenuExpanded === 'true') {
    menuContent.style.maxHeight = 'none'; 
    menuContent.style.padding = '10px';
    requestAnimationFrame(() => {
        menuContent.style.maxHeight = menuContent.scrollHeight + 'px';
    });
} else {
    menuContent.style.maxHeight = '0';
    menuContent.style.padding = '0';
}

const observer = new MutationObserver((mutations) => {
    if (menuContent.style.maxHeight !== '0px') {
        menuContent.style.maxHeight = menuContent.scrollHeight + 'px';
    }
});
observer.observe(menuContent, { childList: true, subtree: true });
toggleButton.addEventListener('click', function () {
    if (menuContent.style.maxHeight === '0px' || menuContent.style.maxHeight === '') {
        menuContent.style.maxHeight = menuContent.scrollHeight + 'px'; 
        menuContent.style.padding = '10px';
        localStorage.setItem('menuContentIsExpanded', 'true');
    } else {
        menuContent.style.maxHeight = '0';
        menuContent.style.padding = '0';
        localStorage.setItem('menuContentIsExpanded', 'false');
    }
});
menuContent.insertAdjacentElement('beforebegin', toggleButton);
	}
		 restoreDataFromLocalStorage();

document.getElementById("addMore").addEventListener("click", function() {
  // 创建一个新的 subcontain 容器
  const subcontain0 = document.createElement("div");
  subcontain0.classList.add("subcontain0");
  const subcontain = document.createElement("div");
  subcontain.classList.add("subcontain");

  // 在 subcontain 中添加输入框
  const input_N = document.createElement("input");
  input_N.setAttribute("type", "text");
  input_N.setAttribute("id", "sub_N");
  input_N.setAttribute("placeholder", "订阅名称");
  const input_L = document.createElement("input");
  input_L.setAttribute("type", "text");
  input_L.setAttribute("id", "sub_L");
  input_L.setAttribute("placeholder", "订阅链接");
  const saButton = document.createElement("button");
  saButton.classList.add("set");
  saButton.setAttribute("id", "sav");
  saButton.textContent = "保存";
  // 在 subcontain 中添加删除按钮
  const delButton = document.createElement("button");
  delButton.classList.add("set");
  delButton.setAttribute("id", "del1");
  delButton.textContent = "删除";

  // 为删除按钮添加点击事件
  delButton.addEventListener("click", function() {
    // 获取父容器并将其从DOM中移除
    const parentContainer = subcontain.parentNode;
    parentContainer.removeChild(subcontain);
  });

  // 将输入框和按钮添加到 subcontain 中
  subcontain.appendChild(input_N);
  subcontain.appendChild(input_L);
  subcontain.appendChild(saButton);
  subcontain.appendChild(delButton);

  document.querySelector(".subcontain0").appendChild(subcontain);
});
var bgContainer = document.getElementById("background-container");
	  if (localStorage.getItem("backgroundImage")) {
		var backgroundImage = localStorage.getItem("backgroundImage");
    bgContainer.style.backgroundImage = backgroundImage;
    bgContainer.style.backgroundSize = "cover";
    bgContainer.style.backgroundPosition = "center";
    bgContainer.style.backgroundAttachment = "fixed";
    bgContainer.style.backgroundRepeat = "no-repeat";
    bgContainer.style.backgroundPosition = bgPosition;
    localStorage.setItem("backgroundImage", backgroundImage);
    
    var blurLevel = localStorage.getItem("blurLevel") || 0;
    bgContainer.style.filter = `blur(${blurLevel}px)`;
	  }

	  if (localStorage.getItem("themeMode") === "dark") {
		document.body.classList.add("dark");
	  }
// 选择在线背景按钮点击事件
var selectOnlineBgBtn = document.getElementById("select-online-bg-btn");
selectOnlineBgBtn.addEventListener("click", function() {
  var bgUrl = prompt("请输入在线背景图URL：");
  if (bgUrl && bgContainer) {
    bgContainer.style.backgroundImage = `url(${bgUrl})`;
    bgContainer.style.backgroundSize = "cover";
    bgContainer.style.backgroundPosition = "center";
    bgContainer.style.backgroundAttachment = "fixed";
    bgContainer.style.backgroundRepeat = "no-repeat";
    bgContainer.style.backgroundPosition = bgPosition;
    localStorage.setItem("backgroundImage", bgUrl);
    
    var blurLevel = localStorage.getItem("blurLevel") || 0;
    bgContainer.style.filter = `blur(${blurLevel}px)`;
  }
});

var selectLocalBgBtn = document.getElementById("select-local-bg-btn");
selectLocalBgBtn.addEventListener("click", function() {
  var selectBgInput = document.createElement("input");
  selectBgInput.type = "file";
  selectBgInput.accept = "image/*";
  selectBgInput.addEventListener("change", function(event) {
    var file = event.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.onload = function() {
        var bgUrl = reader.result;        
          bgContainer.style.backgroundImage = `url(${bgUrl})`;
          bgContainer.style.backgroundSize = "cover";
          bgContainer.style.backgroundPosition = "center";
          bgContainer.style.backgroundAttachment = "fixed";
          bgContainer.style.backgroundRepeat = "no-repeat";
          bgContainer.style.backgroundPosition = bgPosition;
          var blurLevel = localStorage.getItem("blurLevel") || 0;
          bgContainer.style.filter = `blur(${blurLevel}px)`;
          
          localStorage.setItem("backgroundImage", bgUrl);
      };
      reader.readAsDataURL(file);
    }
  });
  selectBgInput.click();
});

	  var clearBgBtn = document.getElementById("clear-bg-btn");
	  clearBgBtn.addEventListener("click", function() {
		document.body.style.backgroundImage = "";
		localStorage.removeItem("backgroundImage");
	  });
		var bgPositionSelect = document.getElementById("bg-position-select");
if (localStorage.getItem("bgPosition")) {
  var storedPosition = localStorage.getItem("bgPosition");
  bgPositionSelect.value = storedPosition;
  if (bgContainer) {
    bgContainer.style.backgroundPosition = storedPosition;
  }
}

bgPositionSelect.addEventListener("change", function() { 
 var selectedPosition = bgPositionSelect.value;
  if (bgContainer) {
    bgContainer.style.backgroundPosition = selectedPosition;
  }
  localStorage.setItem("bgPosition", selectedPosition);
});
	var blurSlider = document.getElementById("blur-slider");

// 检查本地存储是否有背景模糊程度数据
if (localStorage.getItem("blurLevel")) {
  var storedBlurLevel = localStorage.getItem("blurLevel");
  blurSlider.value = storedBlurLevel;
  updateBackgroundBlur(storedBlurLevel);
}

blurSlider.addEventListener("input", function() {
  var blurLevel = blurSlider.value;
  updateBackgroundBlur(blurLevel);
  localStorage.setItem("blurLevel", blurLevel);
});
var bgPosition = localStorage.getItem("bgPosition") || "center"; 
function updateBackgroundBlur(blurLevel) {
  var bgUrl = localStorage.getItem("backgroundImage");  
  if (bgUrl && bgContainer) {
    bgContainer.style.backgroundImage = `url(${bgUrl})`;
    bgContainer.style.backgroundSize = "cover";
    bgContainer.style.backgroundPosition = bgPosition;
    bgContainer.style.backgroundAttachment = "fixed";
    bgContainer.style.backgroundRepeat = "no-repeat";
    bgContainer.style.filter = `blur(${blurLevel}px)`; 
  }
   var selectedPosition = bgPositionSelect.value;
    localStorage.setItem("bgPosition", selectedPosition);
}
	localStorage.removeItem("selectedOptionIndex");

	  var toggleMenuBtn = document.getElementById("toggle-menu-btn");
var submenuPopup = document.getElementById("submenu-popup");
toggleMenuBtn.addEventListener("click", function(e) {
    e.stopPropagation();
    submenuPopup.classList.toggle("show");
});
document.addEventListener("click", function() {
    submenuPopup.classList.remove("show");
});
submenuPopup.addEventListener("click", function(e) {
    e.stopPropagation();
});  
	  // 切换主题模式
  document.body.classList.add('no-transition');
  
  var darkModeButton = document.getElementById("darkModeButton");    
  darkModeButton.addEventListener("click", function() {
    toggleThemeMode();
  });
  
  var currentMode = localStorage.getItem("themeMode") || 'light';
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addListener(handleSystemThemeChange);
  applyThemeMode();
  
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.classList.remove('no-transition');
    });
  });
  
  function handleSystemThemeChange(e) {
    if (currentMode === 'auto') {
      applyThemeMode();
    }
  }
  
  function applyThemeMode() {
    const isDark = 
      currentMode === 'dark' || 
      (currentMode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      document.body.classList.add("dark");
      document.body.style.setProperty("--triangle-color", "#E5E5E5");
      document.body.style.setProperty("--background-color", "#424242");
      var controlElements = document.querySelectorAll(".control");
      for (var i = 0; i < controlElements.length; i++) {
        var controlElement = controlElements[i];
        controlElement.style.filter = "invert(90%)";
      }
    } else {
      document.body.classList.remove("dark");
      document.body.style.setProperty("--triangle-color", "black");
      document.body.style.setProperty("--background-color", "#fff");
      var controlElements = document.querySelectorAll(".control");
      for (var i = 0; i < controlElements.length; i++) {
        var controlElement = controlElements[i];
        controlElement.style.filter = "none";
      }
    }   
    updateButtonText();
  }

  function toggleThemeMode() {
    const darkModeButton = document.getElementById("darkModeButton");
    
    switch(currentMode) {
      case 'light':
        currentMode = 'dark';
        break;
      case 'dark':
        currentMode = 'auto';
        break;
      case 'auto':
        currentMode = 'light';
        break;
    }
    localStorage.setItem("themeMode", currentMode);
    applyThemeMode();
    
    darkModeButton.style.backgroundSize = "100%"; 
  }
  
function updateButtonText() {
  const darkModeButton = document.getElementById("darkModeButton");
  const iconElement = darkModeButton.querySelector("use");
  darkModeButton.setAttribute('data-mode', currentMode);
  
  switch(currentMode) {
    case 'light':
      iconElement.setAttribute('xlink:href', '#light-icon');
      darkModeButton.setAttribute('title', 'Light');
      break;
    case 'dark':
      iconElement.setAttribute('xlink:href', '#dark-icon');
      darkModeButton.setAttribute('title', 'Dark');
      break;
    case 'auto':
      iconElement.setAttribute('xlink:href', '#auto-icon');
      darkModeButton.setAttribute('title', 'Auto');
      break;
  }
}
  
  updateButtonText();

	});
	//dom end
const themeMode = localStorage.getItem('themeMode');
if (themeMode === 'default') {
  localStorage.setItem("themeMode", 'light');
}

			 function goToWebpage2() {
	  const url = "https://www.acfun.cn/u/633603";
		window.location.href = url;
	}	 


	  const mainColorInput = document.getElementById('main-color');
	  const savedColor = localStorage.getItem('mainColor');
	  if (savedColor) {
		document.documentElement.style.setProperty('--main-color', savedColor);
		mainColorInput.value = savedColor;
	  }
	  mainColorInput.addEventListener('input', function() {
		const selectedColor = mainColorInput.value;
		document.documentElement.style.setProperty('--main-color', selectedColor);
		localStorage.setItem('mainColor', selectedColor);
	  });
	  const textToEdit = document.getElementById('textToEdit');
	const editButton = document.getElementById('editButton');

	if (localStorage.getItem('editedText')) {
	  textToEdit.textContent = localStorage.getItem('editedText');
	}

	editButton.addEventListener('click', () => {
	  const newText = prompt('Enter new text:', textToEdit.textContent);
	  if (newText !== null) {
		textToEdit.textContent = newText;
		localStorage.setItem('editedText', newText);
	  }
	});
	const divElementTop = document.querySelector('.container');
	const divElementLeft = document.querySelector('.item-left');
	const divElementRight = document.querySelector('.item-right');
	const divElementWeb = document.querySelector('.app');
	const colorInput1 = document.getElementById('bg-color');
	const opacityInput1 = document.getElementById('opacity');
	const radiusInput1 = document.getElementById('corner-radius');
	const colorInput2 = document.getElementById('bg-color1');
	const opacityInput2 = document.getElementById('opacity1');
	const radiusInput2 = document.getElementById('corner-radius1');
	const colorInput3 = document.getElementById('bg-color2');
	const opacityInput3 = document.getElementById('opacity2');
	const radiusInput3 = document.getElementById('corner-radius2');
	const colorInput4 = document.getElementById('bg-color3');
	const opacityInput4 = document.getElementById('opacity3');
	// 恢复存储的设置
	if (localStorage.getItem('bg-color')) {
	  colorInput1.value = localStorage.getItem('bg-color');
	  divElementLeft.style.backgroundColor = `rgba(${hexToRgb(colorInput1.value)}, ${opacityInput1.value})`;
	}

	if (localStorage.getItem('corner-radius')) {
	  radiusInput1.value = localStorage.getItem('corner-radius');
	  divElementLeft.style.borderRadius = `${radiusInput1.value}px`;
	}

	if (localStorage.getItem('opacity')) {
	  opacityInput1.value = localStorage.getItem('opacity');
	  divElementLeft.style.backgroundColor = `rgba(${hexToRgb(colorInput1.value)}, ${opacityInput1.value})`;
	}

	if (localStorage.getItem('bg-color1')) {
	  colorInput2.value = localStorage.getItem('bg-color1');
	  divElementRight.style.backgroundColor = `rgba(${hexToRgb(colorInput2.value)}, ${opacityInput2.value})`;
	}

	if (localStorage.getItem('corner-radius1')) {
	  radiusInput2.value = localStorage.getItem('corner-radius1');
	  divElementRight.style.borderRadius = `${radiusInput2.value}px`;
	}

	if (localStorage.getItem('opacity1')) {
	  opacityInput2.value = localStorage.getItem('opacity1');
	  divElementRight.style.backgroundColor = `rgba(${hexToRgb(colorInput2.value)}, ${opacityInput2.value})`;
	}
	if (localStorage.getItem('bg-color2')) {
	  colorInput3.value = localStorage.getItem('bg-color2');
	  divElementTop.style.backgroundColor = `rgba(${hexToRgb(colorInput3.value)}, ${opacityInput3.value})`;
	}

	if (localStorage.getItem('corner-radius2')) {
	  radiusInput3.value = localStorage.getItem('corner-radius2');
	  divElementTop.style.borderRadius = `${radiusInput3.value}px`;
	}

	if (localStorage.getItem('opacity2')) {
	  opacityInput3.value = localStorage.getItem('opacity2');
	  divElementTop.style.backgroundColor = `rgba(${hexToRgb(colorInput3.value)}, ${opacityInput3.value})`;
	}
	if (localStorage.getItem('bg-color3')) {
	  colorInput4.value = localStorage.getItem('bg-color3');
	  divElementWeb.style.backgroundColor = `rgba(${hexToRgb(colorInput4.value)}, ${opacityInput4.value})`;
	}

	if (localStorage.getItem('opacity3')) {
	  opacityInput4.value = localStorage.getItem('opacity3');
	  divElementWeb.style.backgroundColor = `rgba(${hexToRgb(colorInput4.value)}, ${opacityInput4.value})`;
	}
	// 保存设置到本地存储
	colorInput1.addEventListener('input', function() {
	  const opacity = opacityInput1.value;
	  divElementLeft.style.backgroundColor = `rgba(${hexToRgb(colorInput1.value)}, ${opacity})`;
	  localStorage.setItem('bg-color', colorInput1.value);
	});

	radiusInput1.addEventListener('input', function() {
	  divElementLeft.style.borderRadius = `${radiusInput1.value}px`;
	  localStorage.setItem('corner-radius', radiusInput1.value);
	});

	opacityInput1.addEventListener('input', function() {
	  const opacity = opacityInput1.value;
	  divElementLeft.style.backgroundColor = `rgba(${hexToRgb(colorInput1.value)}, ${opacity})`;
	  localStorage.setItem('opacity', opacity);
	});

	colorInput2.addEventListener('input', function() {
	  const opacity1 = opacityInput2.value;
	  divElementRight.style.backgroundColor = `rgba(${hexToRgb(colorInput2.value)}, ${opacity1})`;
	  localStorage.setItem('bg-color1', colorInput2.value);
	});

	radiusInput2.addEventListener('input', function() {
	  divElementRight.style.borderRadius = `${radiusInput2.value}px`;
	  localStorage.setItem('corner-radius1', radiusInput2.value);
	});

	opacityInput2.addEventListener('input', function() {
	  const opacity1 = opacityInput2.value;
	  divElementRight.style.backgroundColor = `rgba(${hexToRgb(colorInput2.value)}, ${opacity1})`;
	  localStorage.setItem('opacity1', opacity1);
	});
	colorInput3.addEventListener('input', function() {
	  const opacity2 = opacityInput3.value;
	  divElementTop.style.backgroundColor = `rgba(${hexToRgb(colorInput3.value)}, ${opacity2})`;
	  localStorage.setItem('bg-color2', colorInput3.value);
	});

	radiusInput3.addEventListener('input', function() {
	  divElementTop.style.borderRadius = `${radiusInput3.value}px`;
	  localStorage.setItem('corner-radius2', radiusInput3.value);
	});

	opacityInput3.addEventListener('input', function() {
	  const opacity2 = opacityInput3.value;
	  divElementTop.style.backgroundColor = `rgba(${hexToRgb(colorInput3.value)}, ${opacity2})`;
	  localStorage.setItem('opacity2', opacity2);
	});

const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const appleStatusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
const themeColorInput = document.getElementById('theme-color');
const syncColorsCheckbox = document.getElementById('sync-colors');
const defaultColor = '#ffffffff';

function applyThemeColor(color) {
    themeColorMeta.setAttribute('content', color);
    document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]').setAttribute('content', 'default');
    setTimeout(() => {
        document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]').setAttribute('content', color);
    }, 20);
    themeColorInput.value = color;
}

function loadSavedColors() {
    const savedThemeColor = localStorage.getItem('themeColor') || defaultColor;
    const savedBgColor = localStorage.getItem('bg-color3') || defaultColor;
    const syncColors = localStorage.getItem('syncColors') === 'true';
    const savedOpacity = localStorage.getItem('opacity3') || '1';

    colorInput4.value = savedBgColor;
    opacityInput4.value = savedOpacity;

    const rgbaColor = `rgba(${hexToRgb(savedBgColor)}, ${savedOpacity})`;
    const hexColorWithOpacity = rgbaToHex(rgbaColor);
    applyThemeColor(syncColors ? hexColorWithOpacity : savedThemeColor);

    syncColorsCheckbox.checked = syncColors;
    updateThemeColorState();
}

function updateThemeColorState() {
    themeColorInput.disabled = syncColorsCheckbox.checked;
    if (syncColorsCheckbox.checked) {
        const opacity3 = opacityInput4.value;
        const rgbaColor = `rgba(${hexToRgb(colorInput4.value)}, ${opacity3})`;
        const hexColorWithOpacity = rgbaToHex(rgbaColor);
        applyThemeColor(hexColorWithOpacity);
    }
}

colorInput4.addEventListener('input', function() {
    const opacity3 = opacityInput4.value;
    const rgbaColor = `rgba(${hexToRgb(colorInput4.value)}, ${opacity3})`;
    const hexColorWithOpacity = rgbaToHex(rgbaColor);
    divElementWeb.style.backgroundColor = rgbaColor;
    localStorage.setItem('bg-color3', colorInput4.value);
    localStorage.setItem('opacity3', opacity3);

    if (syncColorsCheckbox.checked) {
        applyThemeColor(hexColorWithOpacity);
    }
});

opacityInput4.addEventListener('input', function() {
    const opacity3 = opacityInput4.value;
    const rgbaColor = `rgba(${hexToRgb(colorInput4.value)}, ${opacity3})`;
    const hexColorWithOpacity = rgbaToHex(rgbaColor);
    divElementWeb.style.backgroundColor = rgbaColor;
    localStorage.setItem('opacity3', opacity3);

    if (syncColorsCheckbox.checked) {
        applyThemeColor(hexColorWithOpacity);
    }
});

themeColorInput.addEventListener('change', (event) => {
    const newColor = event.target.value;
    applyThemeColor(newColor);
    localStorage.setItem('themeColor', newColor);
});

syncColorsCheckbox.addEventListener('change', () => {
    updateThemeColorState();
    localStorage.setItem('syncColors', syncColorsCheckbox.checked);
    if (syncColorsCheckbox.checked) {
        const opacity3 = opacityInput4.value;
        const rgbaColor = `rgba(${hexToRgb(colorInput4.value)}, ${opacity3})`;
        const hexColorWithOpacity = rgbaToHex(rgbaColor);
        applyThemeColor(hexColorWithOpacity);
    }
});

window.addEventListener('load', loadSavedColors);

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
}

function rgbaToHex(rgba) {
    const [r, g, b, a] = rgba.match(/\d+/g).map(Number);
    const alpha = Math.round(a * 255).toString(16).padStart(2, '0').toUpperCase();
    const hexColor = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
    return `${hexColor}${alpha}`;
}

	function backupLocalStorage() {
		  var backgroundImage = localStorage.getItem("backgroundImage");
		  var bgPosition = localStorage.getItem("bgPosition");
		  var themeMode = localStorage.getItem("themeMode");
		  var bgColor = localStorage.getItem("bg-color");
		  var cornerRadius = localStorage.getItem("corner-radius");
		  var opacity = localStorage.getItem("opacity");
		  var bgColor1 = localStorage.getItem("bg-color1");
		  var cornerRadius1 = localStorage.getItem("corner-radius1");
		  var opacity1 = localStorage.getItem("opacity1");
		  var bgColor2 = localStorage.getItem("bg-color2");
		  var cornerRadius2 = localStorage.getItem("corner-radius2");
		  var opacity2 = localStorage.getItem("opacity2");
		  var bgColor3 = localStorage.getItem("bg-color3");
		  var opacity3 = localStorage.getItem("opacity3");
		  var blurLevel = localStorage.getItem("blurLevel");
		  var savedColor = localStorage.getItem("mainColor");
		  var savedColor2 = localStorage.getItem("themeColor");
		  var backupData = {
			backgroundImage: backgroundImage,
			bgPosition: bgPosition,
			themeMode: themeMode,
			bgColor: bgColor,
			cornerRadius: cornerRadius,
			opacity: opacity,
			bgColor1: bgColor1,
			cornerRadius1: cornerRadius1,
			opacity1: opacity1,
			bgColor2: bgColor2,
			cornerRadius2: cornerRadius2,
			opacity2: opacity2,
			bgColor3: bgColor3,
			opacity3: opacity3,
			blurLevel: blurLevel,
			savedColor: savedColor,
			savedColor2: savedColor2,
		   };
		   var savedData = JSON.parse(localStorage.getItem("savedData")) || [];
		  backupData.savedData = savedData;
		  var backupString = JSON.stringify(backupData);

		  var downloadLink = document.createElement("a");
		  downloadLink.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(backupString));
		  downloadLink.setAttribute("download", "localStorage_backup.json");

		  downloadLink.click();
		}
	 var fileInput = document.getElementById("fileInput");
		var restoreButton = document.getElementById("restoreButton");
		var backupData;

		function selectBackupFile() {
		  fileInput.click();
		}

		fileInput.addEventListener("change", function(event) {
		  var file = event.target.files[0];
		  var reader = new FileReader();

		  reader.onload = function(e) {
			backupData = JSON.parse(e.target.result);
			restoreButton.disabled = false;
			const notification = document.createElement('div');
		notification.className = 'notification';
		notification.textContent = ` 已成功读取备份文件！`;
		 document.body.appendChild(notification);
		 setTimeout(() => {
			document.body.removeChild(notification);
		}, 2000);
		  };

		  reader.readAsText(file);
		});

		function restoreLocalStorage() {
		  // 恢复localStorage数据
		  localStorage.setItem("backgroundImage", backupData.backgroundImage);
		  localStorage.setItem("bgPosition", backupData.bgPosition);
		  localStorage.setItem("themeMode", backupData.themeMode);
		  localStorage.setItem("bg-color", backupData.bgColor);
		  localStorage.setItem("corner-radius", backupData.cornerRadius);
		  localStorage.setItem("opacity", backupData.opacity);
		  localStorage.setItem("bg-color1", backupData.bgColor1);
		  localStorage.setItem("corner-radius1", backupData.cornerRadius1);
		  localStorage.setItem("opacity1", backupData.opacity1);
		  localStorage.setItem("bg-color2", backupData.bgColor2);
		  localStorage.setItem("corner-radius2", backupData.cornerRadius2);
		  localStorage.setItem("opacity2", backupData.opacity2);
		  localStorage.setItem("bg-color3", backupData.bgColor3);
		  localStorage.setItem("opacity3", backupData.opacity3);
		  localStorage.setItem("blurLevel", backupData.blurLevel);
		  localStorage.setItem("mainColor", backupData.savedColor);
		  localStorage.setItem("themeColor", backupData.savedColor2);
		   var savedData = backupData.savedData || [];
		  localStorage.setItem("savedData", JSON.stringify(savedData));
		  const notification = document.createElement('div');
		notification.className = 'notification';
		notification.textContent = `已成功恢复备份数据！`;
		 document.body.appendChild(notification);
		 setTimeout(() => {
			document.body.removeChild(notification);
		}, 1000);   
		  location.reload();
		}
		document.getElementById("next-page-btn").addEventListener("click", function() {
		document.querySelector(".page1").style.display = "none";
		document.querySelector(".page2").style.display = "block";
		document.querySelector(".about").style.display = "none";
	});

	document.getElementById("prev-page-btn").addEventListener("click", function() {
		document.querySelector(".page2").style.display = "none";
		document.querySelector(".page1").style.display = "block";
		document.querySelector(".about").style.display = "none";
	});

	document.getElementById("about-btn").addEventListener("click", function() {
		document.querySelector(".page1").style.display = "none";
		document.querySelector(".page2").style.display = "none";
		document.querySelector(".about").style.display = "block";
	});

	document.querySelector(".about").addEventListener("click", function() {
		document.querySelector(".about").style.display = "none";
		if (document.querySelector(".page1").style.display === "none") {
			document.querySelector(".page2").style.display = "block";
		} else {
			document.querySelector(".page1").style.display = "block";
		}
	});
	
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

function getCurrentProgram(channel) {
    const currentTime = dayjs().tz('Asia/Shanghai');
    const currentDay = currentTime.day(); // 0: 周日, 1: 周一, ..., 6: 周六
    const currentTimeString = currentTime.format('HH:mm:ss');
    
    const selectedChannelSchedule = programSchedule[channel];
    if (!selectedChannelSchedule) {
        return " ";
    }
    
    let daySchedule;
    switch (currentDay) {
        case 0:
            daySchedule = selectedChannelSchedule.Sunday;
            break;
        case 1:
            daySchedule = selectedChannelSchedule.Monday;
            break;
        case 5:
            daySchedule = selectedChannelSchedule.Friday;
            break;
        case 6:
            daySchedule = selectedChannelSchedule.Saturday;
            break;
        default:
            daySchedule = selectedChannelSchedule.TuesdayToThursday;
    }
    
    function isDST() {
        const year = currentTime.year();
        
        const dstStart = dayjs().year(year).month(2).date(1).day(0);
        const secondSundayInMarch = dstStart.date() > 7 ? dstStart : dstStart.add(7, 'day');
        const dstEnd = dayjs().year(year).month(10).date(1).day(0);
        
        return currentTime.isAfter(secondSundayInMarch.hour(2)) && 
               currentTime.isBefore(dstEnd.hour(2));
    }
    
    function adjustForDST(timeString) {
        if (!isDST()) {
            return timeString; 
        }
        
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        const adjustedHours = (hours - 1 + 24) % 24; 
        return `${adjustedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    if (channel === 'hitfm') {
        for (const program of daySchedule) {
            if (currentTimeString >= program.start && currentTimeString <= program.end) {
                return program.name;
            }
        }
    } else {
        const adjustedCurrentTimeString = isDST() ? 
            adjustForDST(currentTimeString) : 
            currentTimeString;
        
        for (const program of daySchedule) {
            if (adjustedCurrentTimeString >= program.start && adjustedCurrentTimeString <= program.end) {
                return program.name;
            }
        }
    }
    
    return " ";
}
function openSongList() {
    const songListContainer = document.getElementById('songListContainer');
    const songListFrame = document.getElementById('songListFrame');
    
    if (/^\d+$/.test(ihId)) {
        songListFrame.src = `ihsi.html?streamId=${ihId}`;
    } else if (/bbc/i.test(ihId)) {
        songListFrame.src = `bbcsi.html?streamId=${ihId}`;
    } else {
        console.log('Invalid stream ID format. SongList not available.');
        return;
    }
    
    songListContainer.style.display = 'block';
    songListContainer.style.transform = 'translate(-50%, -50%) scale(0.9)';
    setTimeout(() => {
        songListContainer.classList.add('active');
    }, 10);
}

function closeSongList() {
    const songListContainer = document.getElementById('songListContainer');
    songListContainer.classList.remove('active');
    songListContainer.style.transform = 'translate(-50%, -50%) scale(0.9)';
    
    setTimeout(() => {
        songListContainer.style.display = 'none';
        document.getElementById('songListFrame').src = '';
    }, 300);
}
function changePage(newPageNum) {
    const pages = document.querySelectorAll('.rpage');
    const currentPage = document.querySelector('.rpage:not(.inactive)');
    const newPage = document.getElementById(`rpage${newPageNum}`);
    const paginationLine = document.querySelector('.pagination-line');
    if (currentPage === newPage) return; 
    if (currentPage) {
        currentPage.classList.add('fadeOut');
        currentPage.addEventListener('animationend', function handler() {
            this.classList.add('inactive');
            this.classList.remove('fadeOut');
            this.removeEventListener('animationend', handler);
            showNewPage(newPage);
        }, { once: true });
    } else {
        showNewPage(newPage);
    }
    updatePaginationIndicator(newPageNum);
    updatePaginationButtons(newPageNum);
    localStorage.setItem('lastViewedPage', newPageNum);
}

function showNewPage(page) {
    page.classList.remove('inactive');
    page.classList.add('fadeIn');
    page.addEventListener('animationend', function handler() {
        this.classList.remove('fadeIn');
        this.removeEventListener('animationend', handler);
    }, { once: true });
}

function updatePaginationIndicator(pageNum) {
    // 这个函数现在由 radioManager.js 处理
    return;
}

function initPagination() {
    // 这个函数现在由 radioManager.js 处理
    return;
}

function updatePaginationButtons(activePageNum) {
    // 这个函数现在由 radioManager.js 处理
    return;
}

function updateProgramName(channel) {
    const programNameElement = document.getElementById("programName");
    const currentProgram = getCurrentProgram(channel);
    programNameElement.innerHTML = `
        ON AIR NOW <br> 
        ${currentProgram}
        <a href="javascript:void(0);" onclick="openSongList()"> 
            <img src="./icons/list.svg" style="width:20px;padding:none;top:4px;left:4px;position: relative">
        </a>
    `;
}
updateProgramName(currentChannel);
setInterval(() => updateProgramName(currentChannel), 60000);
	  

	document.getElementById('at40').addEventListener('click', function () {
	  if (!hasFetched2) {
		clearAudio();
		 fetchmusic('https://api.i-meto.com/meting/api?server=netease&type=playlist&id=6659816005')
	  }
	  removeDynamicButton();
	  createDynamicButton('https://music.163.com/#/playlist?id=6659816005');
	  setTimeout(function () {
		const playlistElement = document.querySelector('.yAudio-playlist');
		if (playlistElement) {
		  var newParagraph = document.createElement('p');
		  newParagraph.innerText = 'American Top 40';
		  newParagraph.style.fontSize = '18px';
		  playlistElement.innerHTML = '';
		  playlistElement.appendChild(newParagraph);
		}
	  }, 4000);
	});

	let hasFetched2 = false;

	function fetchmusic(url) {
	  fetch(url).then(async (response) => {
		const audio = await response.json();
		new YAudio({
		  element: document.querySelector('#yAudio'),
		  audio: audio,
		});
		if (url.includes('6705531149')) {
		  hasFetched = true;
		} else if (url.includes('6659816005')) {
		  hasFetched2 = true;
		}
	  });
	}

	function clearAudio() {
	  const yAudioElement = document.querySelector('#yAudio');
	  while (yAudioElement.firstChild) {
		yAudioElement.removeChild(yAudioElement.firstChild);
	  }
	  hasFetched2 = false;
	}
	function createDynamicButton(playlistUrl) {
	   const dynamicButton = document.createElement('button');
	  dynamicButton.setAttribute('id', 'nelist');
	  dynamicButton.textContent = '前往歌单页面';
	  dynamicButton.style.width = 'auto';
	  dynamicButton.addEventListener('click', function() {
		window.location.href = playlistUrl;
	  });

	  const musicModal = document.getElementById('musiccontain');
	  musicModal.appendChild(dynamicButton);
	}

	function removeDynamicButton() {
	  const existingButton = document.getElementById('nelist');
	  if (existingButton) {
		existingButton.parentNode.removeChild(existingButton);
	  }
	}
	
	const openButton = document.getElementById('openButton');
const overlay = document.getElementById('overlay');
const popup = document.getElementById('popup');
const timeInput = document.getElementById('timeInput');
const setCloseTime = document.getElementById('setCloseTime');
const cancelClose = document.getElementById('cancelClose');
const close3 = document.getElementById('close3');
const countdown = document.getElementById('countdown');
let countdownInterval;
let countdownStart;
let closeTimeout;

openButton.addEventListener('click', () => {
    overlay.style.display = 'block';
    popup.style.display = 'block';
    setTimeout(() => {
        overlay.style.opacity = '1';
        popup.style.opacity = '1';
    }, 10);
});

function closePopup() {
    overlay.style.opacity = '0';
    popup.style.opacity = '0';
    setTimeout(() => {
        overlay.style.display = 'none';
        popup.style.display = 'none';
    }, 500);
}

cancelClose.addEventListener('click', () => {
    clearInterval(countdownInterval);
    clearTimeout(closeTimeout);
    closePopup();
});

close3.addEventListener('click', () => {
    closePopup();
});

setCloseTime.addEventListener('click', () => {
  const minutes = parseInt(timeInput.value);
  if (!isNaN(minutes)) {
    const milliseconds = minutes * 60 * 1000;
    countdownStart = Date.now();
    countdownInterval = setInterval(updateCountdown, 1000);
    closeTimeout = setTimeout(() => {
      clearInterval(countdownInterval);
      overlay.style.display = 'none';
      popup.style.display = 'none';
      window.location.href = "about:blank";
    }, milliseconds);
  }
});

function updateCountdown() {
  const remainingTime = parseInt(timeInput.value * 60 - (Date.now() - countdownStart) / 1000);
  countdown.innerHTML = `剩余时间: ${remainingTime} 秒`;
}
