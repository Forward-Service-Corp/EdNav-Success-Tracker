// utils/generateSentence.ts

export function generateSentence(navigator: string, client: string, selections: string[], path: string[]) {

  if (!path || path.length === 0) return "No information available.";

  const [group, ...rest] = path;

  if (group === "adult") return handleAdult(navigator, client, selections, rest);
  if (group === "youth") return handleYouth(navigator, client, selections, rest);

  return "Unknown category.";
}

function handleAdult(navigator: string, client: string, selections: string[], path: string[]) {

  if (!path.length) return "An adult has some record.";

  const [section, ...rest] = path;
  const joined = rest.join(" → ");

  switch (section) {
    case "enrolled in":
      return pickRandom([
        `${navigator} noted that ${client} enrolled in the ${joined} program.`,
        `${client} has now joined the ${joined} program, as observed by ${navigator}.`,
        `According to ${navigator}, ${client} started the ${joined} program.`,
        `${navigator} reported enrollment of ${client} in ${joined}.`,
        `${client} was enrolled in ${joined}, per ${navigator}.`
      ]);

    case "graduated from":
      return pickRandom([
        `${navigator} noted that ${client} graduated from ${joined}.`,
        `${client} successfully completed their program at ${joined}, said ${navigator}.`,
        `${navigator} reported ${client}'s graduation from ${joined}.`,
        `${client} graduated from ${joined} according to ${navigator}.`,
        `${navigator} confirmed that ${client} is a graduate of ${joined}.`
      ]);

    case "inactive":
      return pickRandom([
        `${navigator} noted that ${client} became inactive because: ${joined}.`,
        `${client} is now marked inactive due to: ${joined} (via ${navigator}).`,
        `${navigator} reported inactivity for ${client} – reason: ${joined}.`,
        `${client} became inactive. Reason noted by ${navigator}: ${joined}.`,
        `${joined} caused ${client}'s inactivity as per ${navigator}.`
      ]);

    case "needs": {
      const readable = formatList(selections || []);
      return pickRandom([
        `${navigator} determined that ${client} needs ${readable}.`,
        `${client} expressed needs for ${readable}, noted by ${navigator}.`,
        `${navigator} identified the following needs for ${client}: ${readable}.`,
        `${client} is in need of ${readable}, according to ${navigator}.`,
        `${navigator} reported that ${client} needs ${readable}.`
      ]);
    }

    case "referred to":
      return pickRandom([
        `${navigator} noted that ${client} was referred to ${joined}.`,
        `${client} was referred to ${joined} (by ${navigator}).`,
        `${navigator} made a referral for ${client} to ${joined}.`,
        `${client} got referred to ${joined}, as per ${navigator}.`,
        `According to ${navigator}, a referral was made to ${joined} for ${client}.`
      ]);

    case "educational activity":
      return pickRandom([
        `${navigator} noted that ${client} participated in the ${joined} educational activity.`,
        `${client} is active in ${joined} per ${navigator}'s report.`,
        `${navigator} marked ${client} as attending ${joined}.`,
        `${client} is engaged in ${joined} activity, observed by ${navigator}.`,
        `${joined} is the educational activity ${client} is in, reported by ${navigator}.`
      ]);

    default:
      // Check if we have selections and this is a multi-select case
      if (selections && selections.length > 0) {
        const readable = formatList(selections);
        return pickRandom([
          `${navigator} recorded that ${client} selected ${readable} for ${section}.`,
          `${client} chose ${readable} in ${section}, as noted by ${navigator}.`,
          `${navigator} documented ${client}'s selection of ${readable} in ${section}.`,
          `For ${section}, ${client} selected ${readable} (recorded by ${navigator}).`,
          `${navigator} noted that ${client} picked ${readable} from ${section} options.`
        ]);
      }
      
      return `Adult: ${[section, ...rest].join(" → ")}`;
  }
}

function handleYouth(navigator: string, client: string, selections: string[], path: string[]): string {

  if (!path.length) return "A youth has some record.";

  const [section, ...rest] = path;
  const joined = rest.join(" → ");

  switch (section) {
    case "attending":
      return pickRandom([
        `${navigator} noted that ${client} is attending ${joined}.`,
        `${client} is currently enrolled in ${joined}, per ${navigator}.`,
        `${navigator} reported ${client}'s attendance at ${joined}.`,
        `${joined} is where ${client} attends, as seen by ${navigator}.`,
        `${navigator} confirmed that ${client} is a student at ${joined}.`
      ]);

    case "completed":
      return pickRandom([
        `${navigator} noted that ${client} completed ${joined}.`,
        `${client} completed ${joined} according to ${navigator}.`,
        `${navigator} reported completion of ${joined} by ${client}.`,
        `${joined} was completed by ${client} as per ${navigator}.`,
        `${client} finished ${joined}, noted by ${navigator}.`
      ]);

    case "enrolled in":
      return pickRandom([
        `${navigator} noted that ${client} enrolled in the ${joined} program.`,
        `${client} joined ${joined}, confirmed by ${navigator}.`,
        `Enrollment into ${joined} was made by ${client}, per ${navigator}.`,
        `${navigator} shared that ${client} is now in the ${joined} program.`,
        `${client} started the ${joined} program, observed by ${navigator}.`
      ]);

    case "grade advancement":
      return pickRandom([
        `${navigator} noted that ${client} advanced to grade: ${joined}.`,
        `${client} moved to grade ${joined}, reported by ${navigator}.`,
        `${navigator} confirmed advancement of ${client} to ${joined}.`,
        `A grade jump to ${joined} was recorded for ${client}, said ${navigator}.`,
        `${client} now belongs to grade ${joined}, per ${navigator}.`
      ]);

    case "referred to":
      return pickRandom([
        `${navigator} noted that ${client} was referred to ${joined}.`,
        `${client} received a referral to ${joined}, said ${navigator}.`,
        `According to ${navigator}, ${client} got referred to ${joined}.`,
        `${navigator} made a referral to ${joined} for ${client}.`,
        `${joined} was referred to ${client} (via ${navigator}).`
      ]);

    case "supportive services": {
      const readable = formatList(selections || []);
      return pickRandom([
        `${navigator} determined that ${client} needs ${readable}.`,
        `${client} expressed needs for ${readable}, noted by ${navigator}.`,
        `${navigator} identified the following needs for ${client}: ${readable}.`,
        `${client} is in need of ${readable}, according to ${navigator}.`,
        `${navigator} reported that ${client} needs ${readable}.`
      ]);
    }

    default:
      // Check if we have selections and this is a multi-select case
      if (selections && selections.length > 0) {
        const readable = formatList(selections);
        return pickRandom([
          `${navigator} recorded that ${client} selected ${readable} for ${section}.`,
          `${client} chose ${readable} in ${section}, as noted by ${navigator}.`,
          `${navigator} documented ${client}'s selection of ${readable} in ${section}.`,
          `For ${section}, ${client} selected ${readable} (recorded by ${navigator}).`,
          `${navigator} noted that ${client} picked ${readable} from ${section} options.`
        ]);
      }
      
      return `Youth: ${[section, ...rest].join(" → ")}`;
  }
}

function pickRandom(choices: string[]): string {
  return choices[Math.floor(Math.random() * choices.length)];
}

function formatList(items: string[] | null | undefined): string {

  if (!items || items.length === 0) return 'no specific items';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;

  const result = `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
  return result;
}