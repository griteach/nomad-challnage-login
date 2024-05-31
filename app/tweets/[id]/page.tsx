import TweetDetail from "@/components/tweet-detail";

export default function OneTweet({ params }: { params: { id: string } }) {
  console.log("TweetDetail params id : ", params.id);
  return <TweetDetail params={params} />;
}
