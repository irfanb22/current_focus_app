export const quotes = [
  {
    text: "Task anxiety is a house of cards. It falls apart the moment you start",
    author: "Irfan Bhanji",
    screen: "start-unpleasant-5min"
  },
  {
    text: "There's no such thing as *later*. It's just another word for *never*.",
    author: "Sahil Bloom", 
    screen: "timer-pleasant"
  },
  {
    text: "Doing things is energizing, wasting time is depressing. You don't need that much 'rest'.",
    author: "Nabeel S. Qureshi",
    screen: "timer-pleasant"
  },
  {
    text: "If you do the most important thing first each day, then you'll always get something important done",
    author: "James Clear",
    screen: "completion"
  },
  {
    text: "Never sacrifice momentum. I might know a better path, but if we've got a lot of momentum, if everyone's united and they're marching together and the path is O.K., just go with the flow.",
    author: "Ben Chestnut",
    screen: "completion"
  }
];

export const getCompletionQuote = () => {
  const completionQuotes = quotes.filter(quote => quote.screen === "completion");
  const randomIndex = Math.floor(Math.random() * completionQuotes.length);
  return completionQuotes[randomIndex];
};