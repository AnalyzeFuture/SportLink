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
        postTitle="Let's talk about threads."
      />
      <UserPost
        likes={2500}
        replies={400}
        postImg="/post2.png"
        postTitle="Nice Course"
      />
      <UserPost
        likes={1600}
        replies={100}
        postImg="/post3.png"
        postTitle="Elon musk & future?"
      />
      <UserPost
        likes={1550}
        replies={25}
        postTitle="This is my first thread."
      />
    </>
  );
};
export default UserPage;
