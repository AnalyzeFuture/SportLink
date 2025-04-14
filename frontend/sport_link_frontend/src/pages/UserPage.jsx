import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/userGetUserProfile";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postAtom";
import ParticipationData from "../components/ParticipationData";
import { useToast } from "@chakra-ui/react";

const UserPage = () => {
  const { user, loading } = useGetUserProfile();
  const { username } = useParams();
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [fetchingPosts, setFetchingPosts] = useState(true);
  const [view, setView] = useState("posts"); // New state for toggling views
  const toast = useToast();

  useEffect(() => {
    const getPosts = async () => {
      setFetchingPosts(true);
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        console.log("get Posts data: ", data);
        setPosts(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    };
    // console.log("inside user page user : ", user);
    getPosts();
  }, [username, showToast, setPosts]);

  const handleDeleteParticipationData = async (id) => {
    try {
      // Call the backend API to delete the participation record
      const res = await fetch(`/api/users/participation/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`, // Include the token for authentication
        },
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Success",
          description: "Participation record deleted successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error(data.error || "Failed to delete participation record.");
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  // console.log("post is here and it is recoil state", posts);

  if (!user && loading)
    return (
      <Flex justifyContent={"center"}>
        <Spinner size="xl" />
      </Flex>
    );

  if (!user && !loading) return <h1>User not found</h1>;
  return (
    <>
      <UserHeader user={user} setView={setView} />
      <ParticipationData
        user={user}
        handleDelete={handleDeleteParticipationData}
      />
      {view === "posts" && (
        <>
          {!fetchingPosts && posts.length === 0 && <h1>User has no Post</h1>}
          {fetchingPosts && (
            <Flex justifyContent={"center"} my={12}>
              <Spinner size={"xl"} />
            </Flex>
          )}
          {posts.map((post) => (
            <Post key={post._id} post={post} postedBy={post.postedBy} />
          ))}
        </>
      )}
      {view === "analysis" && <h1>Analysis Component (To be implemented)</h1>}
    </>
  );
};
export default UserPage;
