import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";

const UserPage = () => {
  const [user, setUser] = useState(null);
  const { username } = useParams();
  const showToast = useShowToast();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();

        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUser(data);
        // console.log(data);
      } catch (error) {
        showToast("Error", error, "Error");
        console.log("Error inside getUser: ", error);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [username, showToast]);

  if (!user && loading)
    return (
      <Flex justifyContent={"center"}>
        <Spinner size="xl" />
      </Flex>
    );

  if (!user && !loading) return <h1>User not found</h1>;
  return (
    <>
      <UserHeader user={user} />

      <UserPost
        likes={1300}
        replies={200}
        postImg="/post1.png"
        postTitle="Neeraj Chopra's best throws"
      />
      <UserPost
        likes={2500}
        replies={400}
        postImg="/post2.png"
        postTitle="Neeraj Chopra At Paris Olympics"
      />
      <UserPost
        likes={1600}
        replies={100}
        postImg="/post3.png"
        postTitle="Gold Medal Locked In for India"
      />
      <UserPost
        likes={1550}
        replies={25}
        postTitle=" Neeraj Chopra Becomes 1st Indian To Win Gold At World Athletics Championships"
      />
    </>
  );
};
export default UserPage;
