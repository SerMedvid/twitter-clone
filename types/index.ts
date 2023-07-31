export type Tweet = {
  id: string;
  content: string;
  cretedAt?: Date;
  likeCount: number;
  likedByMe: boolean;
  user: {
    id: string;
    image: string | null;
    name: string | null;
  };
};
