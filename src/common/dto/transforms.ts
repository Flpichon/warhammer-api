import { Transform } from 'class-transformer';

type TrimOptions = {
  toLowerCase?: boolean;
};
// bonne pratique ?? (MEMO @FLP)
export function Trim(options: TrimOptions = {}): PropertyDecorator {
  return Transform(
    ({ value }: { value: unknown }) => {
      if (typeof value !== 'string') {
        return value;
      }
      const trimmed = value.trim();
      return options.toLowerCase ? trimmed.toLowerCase() : trimmed;
    },
    { toClassOnly: true },
  );
}
