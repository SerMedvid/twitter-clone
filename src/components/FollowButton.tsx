import { useSession } from "next-auth/react";
import Button from "./Button";

type Props = {
  isFollowing: boolean;
  userId: string;
  isLoading: boolean;
  onClick: () => void;
};

export default function FollowButton({
  isFollowing,
  isLoading,
  userId,
  onClick,
}: Props) {
  const session = useSession();

  if (session.status !== "authenticated" || session.data.user.id === userId) {
    return null;
  }

  return (
    <Button disabled={isLoading} onClick={onClick} small gray={isFollowing}>
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}
