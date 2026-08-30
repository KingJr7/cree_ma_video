// Mibeko — audio : voix off complète + nappe musicale très légère en fond.
import React from "react";
import { Audio, staticFile } from "remotion";

export const AudioMibeko: React.FC = () => (
  <>
    <Audio src={staticFile("sfx/track.wav")} volume={0.1} />
    <Audio src={staticFile("voicecc.mp3")} volume={0.95} />
  </>
);
