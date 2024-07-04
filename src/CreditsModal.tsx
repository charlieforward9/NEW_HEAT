import React from "react";
import { useNHDispatch } from "./state";

const CreditsModal: React.FC = () => {
  const dispatch = useNHDispatch();

  return (
    <div
      className="modal-overlay"
      onClick={() => dispatch({ type: "SET_CREDITS", show: false })}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Credits</h2>
        <p>Standing on shoulders of giants</p>
        <ul>
          <li>
            <strong>Dreamt by</strong>
            <span>
              <a
                href="https://www.linkedin.com/in/c--rich/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Charbo Rich
              </a>
            </span>
          </li>
          <li>
            <strong>Collected with</strong>
            <span>
              <a
                href="https://www.garmin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Garmin
              </a>
              /
              <a
                href="https://www.strava.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Strava
              </a>
            </span>
          </li>
          <li>
            <strong>Persisted with</strong>
            <span>
              <a
                href="https://www.strava.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Strava
              </a>
            </span>
          </li>
          <li>
            <strong>Processed in</strong>
            <span>
              <a
                href="https://www.python.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Python
              </a>
            </span>
          </li>
          <li>
            <strong>Filtered with</strong>
            <span>
              <a
                href="https://h3geo.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                H3
              </a>
            </span>
          </li>
          <li>
            <strong>Built in</strong>
            <span>
              <a
                href="https://www.typescriptlang.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                TypeScript
              </a>
            </span>
          </li>
          <li>
            <strong>Framed with</strong>
            <span>
              <a
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                React
              </a>
            </span>
          </li>
          <li>
            <strong>Mapped with</strong>
            <span>
              <a
                href="https://developers.google.com/maps"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google
              </a>
            </span>
          </li>
          <li>
            <strong>Interleaved with</strong>
            <span>
              <a
                href="https://deck.gl"
                target="_blank"
                rel="noopener noreferrer"
              >
                DeckGL
              </a>
            </span>
          </li>
          <li>
            <strong>Optimized with</strong>
            <span>
              <a
                href="https://million.dev"
                target="_blank"
                rel="noopener noreferrer"
              >
                Million
              </a>
            </span>
          </li>
          <li>
            <strong>Bundled with</strong>
            <span>
              <a
                href="https://vitejs.dev"
                target="_blank"
                rel="noopener noreferrer"
              >
                Vite
              </a>
            </span>
          </li>
          <li>
            <strong>Hosted with</strong>
            <span>
              <a
                href="https://pages.github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Pages
              </a>
            </span>
          </li>
          <li>
            <strong>Versioned with</strong>
            <span>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Github
              </a>
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CreditsModal;
