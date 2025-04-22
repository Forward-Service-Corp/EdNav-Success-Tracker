import { CompletionCheckmark } from "./CompletionCheckmark";

export default {
  title: "Tracker/Atoms/CompletionCheckmark",
  component: CompletionCheckmark,
  tags: ["#ohYeahPizza", "atom", "tracker", "checkmark"],
  argTypes: {
    completed: {
      control: "boolean",
      description: "Whether the task is marked as complete",
      defaultValue: false,
    },
  },
};

const Template = (args: { completed: boolean }) => (
  <CompletionCheckmark {...args} />
);

type StoryType = typeof Template & { args: { completed: boolean } };
export const Incomplete = Template.bind({}) as StoryType;
Incomplete.args = {
  completed: false,
};

export const Complete = Template.bind({}) as StoryType;
Complete.args = {
  completed: true,
};
