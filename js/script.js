'use strict';
// import {Howl, Howler} from 'js/howler.js/dist/howler.core.min';

$(document).ready(function() {
  console.log('chargé !');

  const SIMON_CHOICES_DISPLAY_DELAY = 1000;

// Les clés ont le même nom que les IDs des svg
  let simonKeys = [
    'simon_green',
    'simon_red',
    'simon_blue',
    'simon_yellow',
  ];

  //Initialisation des sons avec la librairie Howler
  let simonSounds = {
    simon_green: new Howl({
      src: ['sounds/simonSound1.mp3'],
      volume: 0.8,
    }),
    simon_red: new Howl({
      src: ['sounds/simonSound2.mp3'],
      volume: 0.8,
    }),
    simon_blue: new Howl({
      src: ['sounds/simonSound3.mp3'],
      volume: 0.8,
    }),
    simon_yellow: new Howl(
        {
          src: ['sounds/simonSound4.mp3'],
          volume: 0.6,
        }),
  };

  let simonChoices = [];
  let playerChoices = [];
  let simonCurrentIndex = 0;
  let playerCurrentIndex = -1;
  let playerMadeMistake = false;
  let simonIsPlaying = false;
  let finded = 0;

  function playSound(sound) {
    // sounds[sound].currentTime = 0.01;
    // sounds[sound].play();
    simonSounds[sound].play();
  }

  function clickedKeyHandler(e) {
    if (!playerMadeMistake && !simonIsPlaying) {
      e.preventDefault();
      const playerChoosenKey = e.currentTarget.id;
      playerChoices.push(playerChoosenKey);
      playerCurrentIndex++;
      // console.log('playerChoosenKey', playerChoosenKey);
      // console.log('playerChoices', playerChoices);
      // console.log(playerChoosenKey === simonChoices[0]);
      // showSimonChoices();
      //  On teste le choix du joueur avec les choix de simon
      playSound(playerChoosenKey);
      testPlayerChoices();
    }
  }

  function generateSimonChoice() {
    simonChoices.push(simonKeys[Math.floor(Math.random() * 4)]);
  }

  function simonPlays() {
    //Permet d'empêcher de cliquer pendant l'affichage des choix de Simon (testé dans une autre fonction)
    simonIsPlaying = true;

    let intervalSimonPlays = setInterval(() => {
      let simonchoice = simonChoices[simonCurrentIndex];
      console.log('Simon : ', simonchoice);
      // $('#message').text('Simon joue !');
      // playSound(simonchoice);

      simonSounds[simonchoice].play();
      // On éclaircit la couleur de la touche pendant une demi-seconde
      let currentKey = $(`#${simonchoice} path`);
      currentKey.addClass('simon_plays').delay(500).queue(function(next) {
        $(this).removeClass('simon_plays');
        next();
      });

      simonCurrentIndex++;

      // IL faut tester quand on arrête de générer les choix (à la fin du tableau)
      if (simonCurrentIndex >= simonChoices.length) {
        simonCurrentIndex = 0;
        clearInterval(intervalSimonPlays);
        $('#message').delay(1500).text('À vous !');
        simonIsPlaying = false;
      }
    }, SIMON_CHOICES_DISPLAY_DELAY);
  }

  function playerLoose() {
    playerMadeMistake = true;
    console.log('Perdu !');
    init();
  }

  function testPlayerChoices() {
    if (playerCurrentIndex <= simonChoices.length - 1) {
      console.log(
          ` player ${playerChoices[playerCurrentIndex]} / Simon ${simonChoices[playerCurrentIndex]}`,
      );
      if (playerChoices[playerCurrentIndex] !==
          simonChoices[playerCurrentIndex]) {
        playerLoose();

      } else if (playerCurrentIndex === simonChoices.length - 1) {
        //Et on incrémente le nombre de notes trouvées
        finded++;
        $('#tour').text(finded);
        //  On est à la fin des choix du joueur => on génère un nouveau choix de Simon
        generateSimonChoice();
        //    On remet les index des choix actuels à 0, et on vide le tableau des choix du joueur
        simonCurrentIndex = 0;
        playerCurrentIndex = -1;
        playerChoices = [];
        console.log('Simon joue !');
        $('#message').text('Simon joue !');
        simonPlays();
      }
    }
  }

  function init() {
    // On attache les écouteurs d'évènement sur les 4 touches
    $('svg').unbind('click').bind('click', (e => {
      clickedKeyHandler(e);
    }));
    simonCurrentIndex = 0;
    playerCurrentIndex = -1;
    simonChoices = [];
    playerChoices = [];
    generateSimonChoice();
    // $('#tour').text(finded);
    if (playerMadeMistake) {
      $('#instructions').addClass('hidden');
      $('#loose').removeClass('hidden');
      $('.modal').slideToggle();
      playerMadeMistake = false;
      finded = 0;
      $('#tour').text(finded);
    } else {
      $('#loose').addClass('hidden');
      //  On attend le click pour démarrer
      $('.modal').click(() => {
        $('.modal').slideToggle();
        run();
      });
    }
  }

  function run() {
    console.log('Simon joue !');
    $('#message').text('Simon joue !');
    simonPlays();
  }

  init();
});
