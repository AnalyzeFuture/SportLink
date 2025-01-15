import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";

const UserPage = () => {
  return (
    <>
      <UserHeader />

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
