const defaultSettings = {
  sensitivity: {
    DAS: 30,
    SD_DAS: 30,
    ARR: 40,
    SDR: 40,
  },

  keybinds: [
    { event: "ROTATE_CW", trigger: "ArrowUp" },
    { event: "ROTATE_CCW", trigger: "KeyZ" },
    { event: "MOVE_RIGHT", trigger: "ArrowRight" },
    { event: "MOVE_LEFT", trigger: "ArrowLeft" },
    { event: "MOVE_DOWN", trigger: "ArrowDown" },
    { event: "HARD_DROP", trigger: "Space" },
    { event: "HOLD", trigger: "KeyC" },
    { event: "PAUSE", trigger: "Escape" },
  ],

  cosmetics: {
    skin: 1,
    background: 1,
  },
};

const defaultRecords = [
  [
    { label: "OVR_TOTAL_ROTATIONS", value: 0 },
    { label: "OVR_TOTAL_LOCKS", value: 0 },
    { label: "OVR_TOTAL_SCORE", value: 0 },
    { label: "OVR_TOTAL_GAMES", value: 0 },
  ],

  [
    { label: "SPR_BEST_40L", value: 1000000 },
    { label: "SPR_BEST_20L", value: 1000000 },
    { label: "SPR_BEST_100L", value: 1000000 },
    { label: "SPR_TOTAL_GAMES", value: 0 },
  ],

  [
    { label: "PL_SPR_BEST_40L", value: 1000000 },
    { label: "PL_SPR_BEST_20L", value: 1000000 },
    { label: "PL_SPR_BEST_100L", value: 1000000 },
    { label: "PL_SPR_TOTAL_GAMES", value: 0 },
  ],

  [
    { label: "ULT_BEST_3MIN", value: 0 },
    { label: "ULT_BEST_2MIN", value: 0 },
    { label: "ULT_BEST_1MIN", value: 0 },
    { label: "ULT_TOTAL_GAMES", value: 0 },
  ],

  [
    { label: "PL_ULT_BEST_3MIN", value: 0 },
    { label: "PL_ULT_BEST_2MIN", value: 0 },
    { label: "PL_ULT_BEST_1MIN", value: 0 },
    { label: "PL_ULT_TOTAL_GAMES", value: 0 },
  ],

  [
    { label: "MAR_BEST_LINES_CLASSIC", value: 0 },
    { label: "MAR_BEST_SCORE_CLASSIC", value: 0 },
    { label: "MAR_BEST_LINES_FREEPLAY", value: 0 },
    { label: "MAR_BEST_SCORE_FREEPLAY", value: 0 },
    { label: "MAR_TOTAL_GAMES", value: 0 },
  ],

  [
    { label: "PL_MAR_BEST_LINES_CLASSIC", value: 0 },
    { label: "PL_MAR_BEST_SCORE_CLASSIC", value: 0 },
    { label: "PL_MAR_BEST_LINES_FREEPLAY", value: 0 },
    { label: "PL_MAR_BEST_SCORE_FREEPLAY", value: 0 },
    { label: "PL_MAR_TOTAL_GAMES", value: 0 },
  ],
];

// Set up local storage if the user doesn't already have it set
if (localStorage.getItem("Records") == null) {
  localStorage.setItem("Settings", JSON.stringify(defaultSettings));
  localStorage.setItem("Records", JSON.stringify(defaultRecords));
}