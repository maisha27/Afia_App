export interface QuestionOption {
  value: 0 | 1 | 2 | 3;
  label: string;
}

export interface Question {
  id: number;
  text: string;
  options: [QuestionOption, QuestionOption, QuestionOption, QuestionOption];
}

export const questions: Question[] = [
  {
    id: 1,
    text: "How often do you find yourself worrying about your health?",
    options: [
      { value: 0, label: "Rarely or not at all" },
      { value: 1, label: "Sometimes, but it passes quickly" },
      { value: 2, label: "Often, and it can linger for a while" },
      { value: 3, label: "Most of the time, and it is hard to stop" },
    ],
  },
  {
    id: 2,
    text: "When you notice a new ache, pain, or unusual feeling in your body, how do you typically react?",
    options: [
      { value: 0, label: "I barely pay attention to it" },
      { value: 1, label: "I notice it but move on fairly easily" },
      { value: 2, label: "I tend to focus on it and wonder what it means" },
      { value: 3, label: "It dominates my thinking and I struggle to ignore it" },
    ],
  },
  {
    id: 3,
    text: "How often do you check your body for signs that something might be wrong (for example, feeling for lumps, checking your pulse, examining your skin)?",
    options: [
      { value: 0, label: "I rarely do this" },
      { value: 1, label: "Occasionally, when something catches my attention" },
      { value: 2, label: "Fairly regularly, more than I probably need to" },
      { value: 3, label: "Very frequently, it has become a habit I repeat throughout the day" },
    ],
  },
  {
    id: 4,
    text: "When you experience a physical symptom, how quickly does your mind go to serious or worst-case explanations?",
    options: [
      { value: 0, label: "It does not, I generally assume it is minor" },
      { value: 1, label: "Occasionally, but I can usually reassure myself" },
      { value: 2, label: "Quite often, my mind jumps to something serious" },
      { value: 3, label: "Almost immediately, I tend to fear the worst" },
    ],
  },
  {
    id: 5,
    text: "How much do you worry that you might have a serious health condition that has not been found yet?",
    options: [
      { value: 0, label: "This does not really cross my mind" },
      { value: 1, label: "It crosses my mind sometimes but does not stay" },
      { value: 2, label: "I think about this fairly often and it bothers me" },
      { value: 3, label: "It is a constant worry that is hard to shake" },
    ],
  },
  {
    id: 6,
    text: "Do you find yourself imagining what it would be like to be diagnosed with a serious illness?",
    options: [
      { value: 0, label: "No, I do not tend to think about that" },
      { value: 1, label: "Occasionally, but only briefly" },
      { value: 2, label: "Quite often, and the thoughts feel vivid" },
      { value: 3, label: "Frequently, and the images feel very real and distressing" },
    ],
  },
  {
    id: 7,
    text: "When a health-related worry enters your mind, how easy is it for you to let it go?",
    options: [
      { value: 0, label: "I can let it go without much effort" },
      { value: 1, label: "It takes a bit of effort but I manage" },
      { value: 2, label: "It is difficult and the thought keeps coming back" },
      { value: 3, label: "I cannot seem to let it go no matter what I try" },
    ],
  },
  {
    id: 8,
    text: "After being told by a doctor that you are fine, how long does the relief typically last?",
    options: [
      { value: 0, label: "I feel fully reassured and the worry goes away" },
      { value: 1, label: "I feel better for a good while before any doubt returns" },
      { value: 2, label: "The relief is short-lived and doubt creeps back fairly soon" },
      { value: 3, label: "I struggle to believe it even at the time, or the worry returns almost immediately" },
    ],
  },
  {
    id: 9,
    text: "When you hear about someone else's illness or come across health-related information, how does it affect you?",
    options: [
      { value: 0, label: "It does not particularly affect how I feel about my own health" },
      { value: 1, label: "I might briefly wonder about my own health, then move on" },
      { value: 2, label: "It often makes me worry about whether I have the same condition" },
      { value: 3, label: "It almost always triggers significant worry about my own health" },
    ],
  },
  {
    id: 10,
    text: "When you notice a physical sensation you cannot immediately explain, what is your first thought?",
    options: [
      { value: 0, label: "Probably nothing, bodies do odd things sometimes" },
      { value: 1, label: "It is likely nothing, but I might keep an eye on it" },
      { value: 2, label: "I wonder whether it could be a sign of something wrong" },
      { value: 3, label: "I feel fairly convinced it must mean something is wrong with me" },
    ],
  },
  {
    id: 11,
    text: "Compared to other people your age, how at risk do you feel for developing a serious illness?",
    options: [
      { value: 0, label: "About the same or less than most people" },
      { value: 1, label: "Slightly more at risk than average" },
      { value: 2, label: "Noticeably more at risk than most people" },
      { value: 3, label: "Much more at risk, I feel like it is very likely to happen to me" },
    ],
  },
  {
    id: 12,
    text: "How often do you feel that there is something genuinely wrong with your health right now, even without a diagnosis?",
    options: [
      { value: 0, label: "I rarely feel that way" },
      { value: 1, label: "Occasionally, but I can usually talk myself out of it" },
      { value: 2, label: "Fairly often, and it is hard to shake the feeling" },
      { value: 3, label: "Most of the time, I feel certain something is wrong" },
    ],
  },
  {
    id: 13,
    text: "Does worry about your health get in the way of enjoying your day or doing what you normally would?",
    options: [
      { value: 0, label: "No, it does not affect my daily life" },
      { value: 1, label: "Occasionally it gets in the way a little" },
      { value: 2, label: "It regularly interferes with my enjoyment or routine" },
      { value: 3, label: "It significantly limits what I do and how much I enjoy things" },
    ],
  },
  {
    id: 14,
    text: "When you notice a symptom, how able are you to come up with a harmless or everyday explanation for it?",
    options: [
      { value: 0, label: "I can easily think of a simple, harmless reason" },
      { value: 1, label: "I can usually find an explanation, though it takes some thought" },
      { value: 2, label: "I struggle to think of any harmless explanation" },
      { value: 3, label: "I cannot think of any explanation other than something serious" },
    ],
  },
];
