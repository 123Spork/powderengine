//
//  sound.js
//  Puzzler World
//
//  Created by Finblade on 12/12/2013.
//  Copyright (c) 2013, 2014 Finblade Ltd. All rights reserved.
//

var sound_enabled = true;

if (sound_enabled) {

   var audio_engine = cc.AudioEngine.getInstance();
   var sfx_vol_multiplier = 1;
   var bgm_vol = 1;

   playEffect = function (file, loop, pitch, pan, volume) {
      if (document['ccConfig']['useAudio']==true && sound_enabled==true) {
         var undef = typeof (undefined);
         loop = typeof (loop) === undef ? false : loop;
         pitch = typeof (pitch) === undef ? 1.0 : pitch;
         pan = typeof (pan) === undef ? 0.0 : pan;
         volume = typeof (volume) === undef ? 1.0 : volume;
         var iOS = /(iPad|iPhone|iPod)/g.test( navigator.userAgent );
         file = iOS ? file + ".mp3" : file + ".ogg";
         try{
            var sound = audio_engine.playEffect(file, loop, pitch, pan, volume);
         }catch(e){
            sound_enabled=false;
         }

         return 
      }
   };

   getEffectsVolume = function () {
      return this.sfx_vol_multiplier;
   };

   getMusicVolume = function () {
      return this.bgm_vol;
   };

   setEffectsVolume = function (vol) {
      pwsLog("VERBOSE", "Effects vol = " + Math.round(vol * 100) + "%%");
      this.sfx_vol_multiplier = vol;
      audio_engine.setEffectsVolume(vol);
   };

   setMusicVolume = function (vol) {
      pwsLog("VERBOSE", "Music vol = " + Math.round(vol * 100) + "%%");
      this.bgm_vol = vol;
      audio_engine.setMusicVolume(vol);
   };

   pauseEffect = function (id) {
      audio_engine.pauseEffect(id);
   };

   resumeEffect = function (id) {
      audio_engine.resumeEffect(id);
   };

   pauseAllEffects = function () {
      audio_engine.pauseAllEffects();
   };

   resumeAllEffects = function () {
      audio_engine.resumeAllEffects();
   };

   stopEffect = function (id) {
      try {
         audio_engine.stopEffect(id);
      } catch (e) {
         pwsLog("WARN", e);
      }
   };

   stopAllEffects = function () {
      audio_engine.stopAllEffects();
   };

   playBackgroundMusic = function (file, loop) {
      loop = typeof (loop) == typeof (undefined) ? false : loop;
       var iOS = /(iPad|iPhone|iPod)/g.test( navigator.userAgent );
       file = iOS ? file + ".mp3" : file + ".ogg";
      audio_engine.playMusic(file, loop);
   };

   stopBackgroundMusic = function () {
      audio_engine.stopMusic();
   };

   preloadEffect = function (file) {
      audio_engine.preloadEffect(file);
   };

   isAudioLoading =function(file){
      return audio_engine._audiosLoading[file]
   };

   unloadEffect = function (file) {
      audio_engine.unloadEffect(file);
   };
} else {
   getEffectsVolume = function () {
      return 0;
   };

   getMusicVolume = function () {
      return 0;
   };

   setEffectsVolume = function (vol) {

   };

   setMusicVolume = function (vol) {

   };

   playEffect = function (file, loop) {
      return 0;
   };

   pauseEffect = function (id) {

   };

   resumeEffect = function (id) {

   };

   pauseAllEffects = function () {

   };

   resumeAllEffects = function () {

   };

   stopEffect = function (id) {

   };

   playBackgroundMusic = function (file, loop) {

   };

   stopBackgroundMusic = function () {

   };

   preloadEffect = function (file) {

   };

   unloadEffect = function (file) {

   };
}
