import { Flex, Spinner } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import { useEffect, useState } from "react";
import Post from "../components/Post";
import { useRecoilState, useRecoilValue } from "recoil";
import { Box } from "@chakra-ui/react";
import postsAtom from "../atoms/postAtom";
import userAtom from "../atoms/userAtom";
import ProfileSidebar from "../components/ProfileSidebar";
import PopupForm from "../components/Popupform";

const HomePage = () => {
  const user = useRecoilValue(userAtom); // Get user data from Recoil state
  const [posts, setPosts] = useRecoilState(postsAtom);
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
      {/* Render PopupForm only if user data is incomplete */}
      {user &&
        (!user.lovedSport ||
          !user.experience ||
          !user.achievements ||
          !user.bmi ||
          !user.preferredTime) && <PopupForm />}
      <Box flex="1" w={250} left={40} position={"fixed"}>
        <ProfileSidebar />
      </Box>
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
