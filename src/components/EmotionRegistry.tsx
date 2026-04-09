"use client";

import { useState } from "react";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { useServerInsertedHTML } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

type EmotionCache = ReturnType<typeof createCache>;

function createEmotionRegistry() {
  const cache = createCache({ key: "mui", prepend: true });
  cache.compat = true;

  const previousInsert = cache.insert;
  let inserted: string[] = [];

  cache.insert = (...args: Parameters<EmotionCache["insert"]>) => {
    const serialized = args[1];

    if (cache.inserted[serialized.name] === undefined) {
      inserted.push(serialized.name);
    }

    return previousInsert(...args);
  };

  return {
    cache,
    flush: () => {
      const names = inserted;
      inserted = [];
      return names;
    },
  };
}

export default function EmotionRegistry({ children }: Props) {
  const [{ cache, flush }] = useState(createEmotionRegistry);

  useServerInsertedHTML(() => {
    const names = flush();

    if (names.length === 0) {
      return null;
    }

    let styles = "";

    for (const name of names) {
      const style = cache.inserted[name];

      if (typeof style === "string") {
        styles += style;
      }
    }

    return (
      <style
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
