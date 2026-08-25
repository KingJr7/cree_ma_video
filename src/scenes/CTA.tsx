import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { Entrance, SceneExit, WordReveal } from "../components/Motion";

export const CTA_S = 3.5;

// CTA calme — glow sur le seul mot clé. La dernière frame reste sombre et
// stable pour une boucle propre vers le hook.
export const CTA: React.FC<{ duration: number }> = ({ duration }) => {
  return (
    <SceneExit duration={duration}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 300,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 48,
          }}
        >
          <WordReveal
            text="Teste-la ce soir."
            delay={6}
            per={4}
            heroWord="ce"
            style={{
              fontFamily: theme.fonts.display,
              fontWeight: 700,
              fontSize: 118,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: theme.colors.text,
              textAlign: "center",
            }}
          />
          <Entrance delay={Math.round(24)}>
            <div
              style={{
                fontFamily: theme.fonts.body,
                fontWeight: 400,
                fontSize: 40,
                color: theme.colors.textDim,
                textAlign: "center",
                maxWidth: 780,
                lineHeight: 1.35,
              }}
            >
              Enregistre cette vidéo,
              <br />
              tu la ressortiras à ta prochaine paie.
            </div>
          </Entrance>
        </div>
      </AbsoluteFill>
    </SceneExit>
  );
};
