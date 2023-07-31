import Link from "next/link";
import { type Tweet } from "types";
import ProfileImage from "./ProfileImage";
import HeartButton from "./HeartButton";
import { api } from "@/utils/api";

const dateTimeFormatter = Intl.DateTimeFormat(undefined, {
  dateStyle: "short",
});

export default function TweetCard({
  id,
  content,
  user,
  cretedAt,
  likedByMe,
  likeCount,
}: Tweet) {
  const trpcUtils = api.useContext();

  const toggleLike = api.tweet.toggleLike.useMutation({
    onSuccess: ({ addedLike }) => {
      const updateData: Parameters<
        typeof trpcUtils.tweet.infiniteFeed.setInfiniteData
      >[1] = (oldData) => {
        if (!oldData) return;

        const countModifier = addedLike ? 1 : -1;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => {
            return {
              ...page,
              tweets: page.tweets.map((tweet) => {
                if (tweet.id === id) {
                  return {
                    ...tweet,
                    likeCount: tweet.likeCount + countModifier,
                    likedByMe: addedLike,
                  };
                }

                return tweet;
              }),
            };
          }),
        };
      };
      trpcUtils.tweet.infiniteFeed.setInfiniteData({}, updateData);
      trpcUtils.tweet.infiniteFeed.setInfiniteData(
        { onlyFollowing: true },
        updateData
      );
      trpcUtils.tweet.infiniteProfileFeed.setInfiniteData(
        { userId: user.id },
        updateData
      );
    },
  });

  const handleLikeToggle = () => {
    toggleLike.mutate({ id });
  };

  return (
    <li className="flex gap-4 border-b p-4">
      <Link href={`/profiles/${user.id}`}>
        <ProfileImage src={user.image} />
      </Link>
      <div className="flex flex-grow flex-col">
        <div className="flex gap-1">
          <Link
            href={`/profiles/${user.id}`}
            className="font-bold outline-none hover:underline focus-visible:underline"
          >
            {user.name}
          </Link>
          <span className="text-gray-500">-</span>
          <span className="text-gray-500">
            {dateTimeFormatter.format(cretedAt)}
          </span>
        </div>
        <p className=" whitespace-pre-wrap">{content}</p>
        <HeartButton
          onClick={handleLikeToggle}
          likeCount={likeCount}
          likedByMe={likedByMe}
          isLoading={toggleLike.isLoading}
        />
      </div>
    </li>
  );
}
