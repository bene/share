import { useEffect, useRef, useState } from "hono/jsx";

import { Dots } from "./Dots";
import { IconDownload } from "./IconDownload";

const uuidByteLength = 36 as const;

export default function Counter() {
  const ac = useRef(new AbortController());
  const inputEl = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFileIds, setUploadedFileIds] = useState<string[]>([]);
  const [state, setState] = useState<
    "selecting" | "uploading" | "failed" | "done"
  >("selecting");

  useEffect(() => {
    ac.current?.signal.addEventListener("abort", () => {
      setState("failed");
    });
    return () => ac.current?.abort();
  }, []);

  const onChange = (e: Event) => {
    if (!(e.target instanceof HTMLInputElement) || !e.target.files) {
      return;
    }

    for (const file of Array.from(e.target.files)) {
      setFiles((prev) => [...prev, file]);
    }
  };

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    if (files.length === 0) {
      inputEl.current?.click();
      return;
    }

    const body = new FormData();

    for (const file of files) {
      body.append("files", file);
    }

    setState("uploading");

    const res = await fetch("/api/upload", {
      signal: ac.current?.signal,
      method: "POST",
      body,
    });

    const reader = res.body!.getReader({
      mode: "byob",
    });

    for (let i = 0; i < files.length; i++) {
      const chunk = await reader.read(new Uint8Array(uuidByteLength));
      const id = new TextDecoder().decode(chunk.value);

      setUploadedFileIds((prev) => [...prev, id]);

      if (chunk.done) {
        break;
      }
    }

    await reader.cancel();
    setState("done");
  };

  return (
    <div
      class="h-dvh w-dvw bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url("/background.jpeg")`,
      }}
    >
      <form
        class="size-full p-4 flex items-center justify-center backdrop-blur-sm"
        onSubmit={(e) => onSubmit(e as SubmitEvent)}
      >
        <div class="w-full max-w-sm max-h-full flex flex-col gap-4 lg:gap-8 bg-white shadow-2xl rounded-2xl p-4 lg:p-8 xl:p-12">
          <p class="font-serif text-4xl font-bold">Datei hochladen</p>

          <div class="flex flex-col gap-2 overflow-y-scroll">
            {files.map((file, index) => (
              <div
                key={file.name}
                class="flex items-center gap-3 text-gray-800"
              >
                <div class="h-12 aspect-video relative bg-gray-200 rounded">
                  {file.type.startsWith("image/") && (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      class="absolute size-full object-contain rounded"
                    />
                  )}
                </div>
                <div class="overflow-hidden">
                  <p class="break-words text-pretty">{file.name}</p>

                  {state === "uploading" && (
                    <div class="w-full rounded bg-gray-200 relative">
                      <div
                        class="h-2 rounded bg-red-600"
                        style={{
                          width: `33%`,
                        }}
                      />
                    </div>
                  )}
                </div>

                {state === "done" && (
                  <a href="" target="_blank">
                    <IconDownload class="w-4 h-4" />
                  </a>
                )}
              </div>
            ))}
          </div>

          {state === "selecting" && (
            <>
              <div class="flex justify-center w-full rounded border-dashed border p-4 border-gray-900/25 px-6 py-10">
                <div class="text-center">
                  <div class="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      for="file-upload"
                      class="relative cursor-pointer rounded-md bg-white font-semibold text-red-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-red-600 focus-within:ring-offset-2 hover:text-red-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        ref={inputEl}
                        name="file-upload"
                        type="file"
                        class="sr-only"
                        onChange={onChange}
                        multiple
                      />
                    </label>
                    <p class="pl-1">or drag and drop</p>
                  </div>
                  <p class="text-xs leading-5 text-gray-600">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </>
          )}

          {state === "selecting" ? (
            <button
              type="submit"
              class="w-full bg-black text-white rounded px-3 py-2"
            >
              {files.length === 0
                ? "Datein ausgewählt"
                : files.length === 1
                  ? "1 Datei hochladen"
                  : `${files.length} Datein hochladen`}
            </button>
          ) : state === "uploading" ? (
            <button
              type="button"
              class="w-full bg-red-600 text-white rounded px-3 py-2"
              onClick={() => ac.current?.abort()}
            >
              Abbrechen
              <Dots />
            </button>
          ) : state === "done" ? (
            <button
              type="button"
              class="w-full bg-black text-white rounded px-3 py-2"
            >
              Archiv herunterladen
            </button>
          ) : null}
        </div>
      </form>
    </div>
  );
}
