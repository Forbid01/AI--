import { describe, expect, it, vi } from 'vitest';
import { extractJson, generateJson } from './json.js';

describe('extractJson', () => {
  it('parses fenced json with trailing commas', () => {
    const text = '```json\n{"items":["one","two",],"ok":true,}\n```';
    expect(extractJson(text)).toEqual({ items: ['one', 'two'], ok: true });
  });

  it('extracts json when the model adds surrounding prose', () => {
    const text = 'Here is the JSON you requested:\n{"hero":{"title":"Hello"}}\nThank you!';
    expect(extractJson(text)).toEqual({ hero: { title: 'Hello' } });
  });
});

describe('generateJson', () => {
  it('retries once when the first response is unrecoverable invalid json', async () => {
    const model = {
      generateContent: vi
        .fn()
        .mockResolvedValueOnce({
          response: { text: () => '{"items":["one" "two"]}' },
        })
        .mockResolvedValueOnce({
          response: { text: () => '{"items":["one","two"]}' },
        }),
    };

    const result = await generateJson(model, 'Return JSON');

    expect(result).toEqual({ items: ['one', 'two'] });
    expect(model.generateContent).toHaveBeenCalledTimes(2);
  });
});
