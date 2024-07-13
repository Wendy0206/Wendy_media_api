import React from "react";
import { useState, useEffect, useRef } from "react";

export const Media = () => {
  const [currentSong, setCurrentSong] = useState(0);
  const [playStatus, setPlayStatus] = useState("fa-solid fa-play ");
  const playT = useRef(false);
  const [volumeT, setVolumeT] = useState(0.5);
  const [volumeE, setVolumeE] = useState("fa-solid fa-volume-low fa-xl");
  const [songP, setSongP] = useState(0);
  const [stepS, setStepS] = useState(0);
  const [playlistSong, setPlaylistSong]=useState([{img:"https://cdns-images.dzcdn.net/images/cover/831c34bd0039e6332b8b618c1fa6a929/500x500.jpg"}]);

  var audioTest = new Audio();


  let img_list = [
    "https://cdns-images.dzcdn.net/images/cover/831c34bd0039e6332b8b618c1fa6a929/500x500.jpg",
    "https://s1.dmcdn.net/v/S-MwE1WgtvFViG2sj/x1080",
    "https://i.scdn.co/image/ab67616d0000b27367c738a703dc979f5c3c52ef",
    "https://cdns-images.dzcdn.net/images/cover/3f1ec90f24e5f311583f59ad7dafa071/500x500.jpg",
    "https://i.scdn.co/image/ab67616d00001e0248f3a25e34a3fe7a873d46a1",
    "https://a10.gaanacdn.com/gn_img/song/kGxbnw0Ky4/xbngdYXaKy/size_m_1614024161.webp",
    "https://filepicker-images.genius.com/idi9yu9pcan",
    "https://i1.sndcdn.com/artworks-cCAWyxo4yxk5gEuY-J4DSRw-t1080x1080.jpg",
    "https://i.ytimg.com/vi/3iSro4wK944/maxresdefault.jpg",
    "https://images.genius.com/4266b9bfee49ff03f23d7a70e460894c.1000x1000x1.png",
  ];

  let interval;
  let startPress = null;

  useEffect(() => {
  
    let check_storage = JSON.parse(sessionStorage.getItem('allSongs'));
    if (!check_storage) {
    	downloadSongs();
    } else {
    
    	setPlaylistSong(check_storage.allsongs);
    }
  
  
  }, []);

  useEffect(() => {
    if (playT.current && songP < 50) {
      interval = setInterval(() => {
        setSongP(songP + 1);
      }, stepS);
      return () => clearInterval(interval);
    } else if (songP === 50) {
      switch_function(1);
      clearInterval(interval);
    }
  }, [stepS, songP]);

  const downloadSongs = async () => {
    const url =
      "https://spotify23.p.rapidapi.com/albums/?ids=3IBcauSj5M2A6lTeffJzdv";
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "b7d8c24116msh18d47855c91a4c6p129b19jsn25ca23c193e6",
        "x-rapidapi-host": "spotify23.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();

      let newArray = [...result.albums[0].tracks.items];

      let newArray2 = [];
      newArray.map((elm, id) => {
        let each_elm = {};
        each_elm.title = elm.name;
        each_elm.author = elm.artists[0].name;
        each_elm.url = elm.preview_url;
        each_elm.img =img_list[id];
        newArray2.push(each_elm);
        return true;
      });
      setPlaylistSong(newArray2);
      let storage_obj= {
        allsongs: newArray2,
        date_stored: new Date().toLocaleDateString()
      }
      sessionStorage.setItem("allSongs", JSON.stringify(storage_obj));
    } catch (error) {
      console.error(error);
    }
  };

  function play_function(id) {
    // check if user click on the play button
    if (id === -1) {
      if (playT.current === false) {
        play_song(currentSong);
      } else {
        setPlayStatus("fa-solid fa-play");
        audioTest.pause();
        playT.current = false;
      }
    }

    // else user click on a song directly
    else {
      if (playT.current === true) {
        setPlayStatus("fa-solid fa-pause ");
      }
      play_song(id);
    }
  }

  const play_song = (id) => {
    playT.current = true;
    setPlayStatus("fa-solid fa-pause ");
    setCurrentSong(id);
    audioTest.src = playlistSong[id].url;
    audioTest.play();
    setSongP(0);
  };

  function switch_function(pos) {

let check_storage = JSON.parse(sessionStorage.getItem('allSongs'));

    if (songP > 25 && pos === -1) {
      play_song(currentSong);
    } else {
      let final = currentSong + pos;
      if (currentSong === playlistSong.length - 1 && pos === 1) {
        final = 0;
      }
      if (currentSong === 0 && pos === -1) {
        final = playlistSong.length - 1;
      }
      play_song(final);
      setCurrentSong(final);
    }
  }

  const get_duration = (e) => {
    setStepS(Math.floor((e.target.duration * 1000) / 50));
  };

  function volume_up() {
    if (volumeT === 0) {
      setVolumeT(0.5);
      audioTest.volume = volumeT;
    } else {
      if (volumeT < 1.0) {
        setVolumeT(volumeT + 0.1);
        audioTest.volume = volumeT;
        setVolumeE("fa-solid fa-volume-low fa-xl");
      }
    }
  }

  function counterDown() {
    startPress = Date.now();
  }

  function counterUp() {
    if (Date.now() - startPress > 1000) {
      setVolumeE("fa-solid fa-volume-xmark fa-xl");
      audioTest.muted = true;
    } else {
      if (volumeT > 0) {
        setVolumeT(volumeT - 0.1);
        audioTest.volume = volumeT;
      }
    }
  }



  return (
    <div className="player">
    
      <img
        className="cover"
        alt="Current song cover"
        src={playlistSong[currentSong].img}
      />
      <nav>
        <div className="left">
          <i className="fas fa-bars"></i>
          <h6>Playlist</h6>
        </div>
        <div className="right">
          <div className="search-container">
            <form action="/search" method="get">
              <input
                className="search expandright"
                id="searchright"
                type="search"
                name="q"
                placeholder="Search"
              />
              <label className="button searchbutton" htmlFor="searchright">
                <span className="mglass">&#9906;</span>
              </label>
            </form>
          </div>
        </div>
      </nav>

      <div className="player-ui">
      
        <div className="small">
          <span onMouseDown={() => counterDown()} onMouseUp={() => counterUp()}>
            <i
              title="press or press and hold for 2 seconds to mute"
              className={volumeE}
            ></i>
          </span>
          <i
            className="fa-solid fa-volume-high "
            onClick={() => volume_up()}
          ></i>
        </div>

        <input
          type="range"
          className="progress"
          max="50"
          value={songP}
          step={1}
        />

        <div className="controls">
          <i
            className="fas fa-step-backward "
            onClick={() => switch_function(-1)}
          ></i>
          <i className={playStatus} onClick={() => play_function(-1)}></i>
          <i
            className="fas fa-step-forward  "
            onClick={() => switch_function(1)}
          ></i>
      
      </div>
  </div>
          <div className="title">
          <h3>{playlistSong[currentSong].title}</h3>
           <h5>{playlistSong[currentSong].author}</h5>
        </div>
     
      <div className="music" id="style-1">
        {playlistSong.map((elm, index) => (
          <div className="song-1" key={index}>
            <div className="info">
              <img className="img" alt="Song cover" src={elm.img} />
              <div className="titles">
                <h5>{elm.title}</h5>
                <p>{elm.author}</p>
              </div>
            </div>
            <div className="state">
              <i
                className={
                  currentSong === index
                    ? playT.current
                      ? "fa-brands fa-deezer fa-bounce fa-xl cplay"
                      : "fa-solid fa-play"
                    : "fa-solid fa-play "
                }
                onClick={() => play_function(index)}
              ></i>
            </div>
          </div>
        ))}

        <audio
          ref={(e) => (audioTest = e)}
          preload="metadata"
          id="testTone"
          onLoadedMetadata={(e) => get_duration(e)}
        />
      </div>
    </div>
  );
};
