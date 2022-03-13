/*
* The Fisher–Yates shuffle code is taken from Mike Bostock's article to optimize random shuffling.
* source: https://bost.ocks.org/mike/shuffle/
* */
export const FYShuffle = (array) => {
  let m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}
