import { diff_match_patch } from "diff-match-patch";

interface Option {
  code: string;
  name: string;
}

function preprocessString(s: string): string {
  if (!s) {
    return '';
  }

  return s
    .toUpperCase()
    .replace(/&/g, "AND")
    .replace(/,/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function findSimilar(
  value: string,
  options: Option[],
  threshold: number = 5
): Option[] {
  const dmp = new diff_match_patch();
  const processedValue = preprocessString(value);

  const exactMatch = options.find(
    (option) => preprocessString(option.name) === processedValue
  );
  if (exactMatch) {
    return [exactMatch];
  }

  return options.filter((option) => {
    const processedOption = preprocessString(option.name);
    const diff = dmp.diff_main(processedValue, processedOption);
    const distance = dmp.diff_levenshtein(diff);

    return distance <= threshold;
  });
}
