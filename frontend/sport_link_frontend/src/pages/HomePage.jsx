import { Flex, Spinner } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import { useEffect, useState } from "react";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Box } from "@chakra-ui/react";
import postsAtom from "../atoms/postAtom";
import ProfileSidebar from "../components/ProfileSidebar";

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const user = useRecoilValue(userAtom);
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();
  useEffect(() => {
    const getFeedPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/posts/feed/feed");
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }

        setPosts(data);
        // console.log("posts data:",data);
      } catch (error) {
        showToast("Error", error.message, "Error");
      } finally {
        setLoading(false);
      }
    };
    getFeedPosts();
  }, [showToast, setPosts]);
  return (
    <>
      <Box flex="1" w={250} left={40} position={"fixed"}>
        {" "}
        {/* Sidebar width */}
        <ProfileSidebar user={user} />
      </Box>{" "}
      {loading && (
        <Flex justify={"center"}>
          <Spinner size={"xl"} />
        </Flex>
      )}
      {!loading && posts.length === 0 && (
        <h1>Follow some users to see the feed</h1>
      )}
      {posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}
    </>
  );
};

export default HomePage;
