import { useSession } from "next-auth/react";
import Button from "./Button";
import ProfileImage from "./ProfileImage";
import {
  type ElementRef,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { api } from "@/utils/api";

function updateTextAreaSize(textarea?: HTMLTextAreaElement | null) {
  if (textarea == null) return;

  textarea.style.height = "0";
  textarea.style.height = `${textarea.scrollHeight}px`;
}

export default function NewTweetForm() {
  const session = useSession();

  if (session.status !== "authenticated") return;

  return <Form />;
}

function Form() {
  const session = useSession();
  const [inputValue, setInputValue] = useState<string>("");
  const textAreaRef = useRef<ElementRef<"textarea">>();

  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaSize(textArea);
    textAreaRef.current = textArea;
  }, []);

  useLayoutEffect(() => {
    updateTextAreaSize(textAreaRef.current);
  }, [inputValue]);

  const trpcUtils = api.useContext();

  const createTweet = api.tweet.create.useMutation({
    onSuccess: (newTweet) => {
      setInputValue("");

      if (session.status !== "authenticated") return;

      trpcUtils.tweet.infiniteFeed.setInfiniteData({}, (oldData) => {
        if (!oldData?.pages[0]) return;

        const newCacheTweet = {
          ...newTweet,
          likeCount: 0,
          likedByMe: false,
          user: {
            id: session.data.user.id,
            name: session.data.user.name ?? null,
            image: session.data.user.image ?? null,
          },
        };

        return {
          ...oldData,
          pages: [
            {
              ...oldData.pages[0],
              tweets: [newCacheTweet, ...oldData.pages[0].tweets],
            },
            ...oldData.pages.slice(1),
          ],
        };
      });
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    createTweet.mutate({ content: inputValue });
  };

  if (session.status !== "authenticated") return;

  return (
    <form
      className=" flex flex-col gap-2 border-b px-4 py-2"
      onSubmit={handleSubmit}
    >
      <div className="flex gap-4">
        <ProfileImage src={session.data.user.image} />
        <textarea
          ref={inputRef}
          style={{ height: 0 }}
          value={inputValue}
          onChange={(evt) => setInputValue(evt.target.value)}
          className="flex-grow resize-none overflow-hidden p-4 text-lg outline-none"
          placeholder="What's happening?"
        />
      </div>
      <Button className="self-end">Tweet</Button>
    </form>
  );
}
