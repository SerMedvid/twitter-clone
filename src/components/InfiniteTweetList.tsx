import InfiniteScroll from "react-infinite-scroll-component";
import { type Tweet } from "types";
import TweetCard from "./TweetCard";
import LoadingSpinner from "./LoadingSpinner";

type Props = {
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean | undefined;
  fetchNewTweets: () => Promise<unknown>;
  tweets: Tweet[];
};

export default function InfiniteTweetList({
  tweets,
  isError,
  isLoading,
  hasMore,
  fetchNewTweets,
}: Props) {
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <h1>Error...</h1>;

  if (tweets == null || tweets.length === 0) {
    return (
      <h2 className="my-4 text-center text-2xl text-gray-500">No Tweets</h2>
    );
  }

  return (
    <ul>
      <InfiniteScroll
        dataLength={tweets.length}
        next={fetchNewTweets}
        hasMore={!!hasMore}
        loader={<LoadingSpinner />}
      >
        {tweets.map((tweet) => (
          <TweetCard key={tweet.id} {...tweet} />
        ))}
      </InfiniteScroll>
    </ul>
  );
}
