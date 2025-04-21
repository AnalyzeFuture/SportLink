import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import { v2 as cloudinary } from "cloudinary";
// import fetch from "node-fetch"; // Add this import

const createPost = async (req, res) => {
  try {
    const { postedBy, text } = req.body;
    let { img, hashtags } = req.body;
    // console.log("hashtags : ", hashtags);
    // let { img } = req.body;
    if (!postedBy || !text) {
      return res
        .status(400)
        .json({ message: "Postedby and text fields are required" });
    }

    const user = await User.findById(postedBy);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorised to create post" });
    }

    const maxLength = 500;
    if (text.length > maxLength) {
      return res
        .status(400)
        .json({ error: `Text must be less than ${maxLength} characters` });
    }

    // Extract hashtags from the text
    // const extractedHashtags = (await hashtags.match(/#\w+/g)) || [];

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
      // console.log("img url in create post: ", img);
    }

    const newPost = new Post({
      postedBy,
      text,
      img,
      hashtags,
      // hashtags: extractedHashtags,
    });
    await newPost.save();

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in createPost: ", err);
  }
};

const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in getPost: ", err);
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorised to delete post" });
    }
    if (Post.img) {
      const imgId = Post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in deletePost: ", err);
  }
};
const likeUnlikePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      // Unlike post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      res.status(200).json({ message: "Post unliked successfully" });
    } else {
      // Like post
      post.likes.push(userId);
      await post.save();

      // Fetch recommended posts
      try {
        const response = await fetch(
          "http://127.0.0.1:8080/api/recommendations",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ post_id: postId }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch recommendations");
        }

        const recommendations = await response.json();

        // Populate the recommendations with actual posts
        const recommendedPosts = await Post.find({
          _id: { $in: recommendations },
        });

        res
          .status(200)
          .json({ message: "Post liked successfully", recommendedPosts });
      } catch (fetchError) {
        console.error("Error fetching recommendations: ", fetchError);
        res.status(500).json({ error: "Failed to fetch recommendations" });
      }
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in likeUnlikePost: ", err);
  }
};

const replyToPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;
    const userProfilePic = req.user.profilePic;
    const username = req.user.username;

    if (!text) {
      return res.status(400).json({ error: "Text field is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Fetch sentiment from the sentiment analysis API
    let sentiment = 0; // Default sentiment
    try {
      const response = await fetch("http://127.0.0.1:8080/api/sentiment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const data = await response.json();
        sentiment = data.sentiment; // Assuming the API returns { sentiment: 0/1 }
      } else {
        console.error("Failed to fetch sentiment");
      }
    } catch (error) {
      console.error("Error fetching sentiment:", error);
    }

    const reply = { userId, text, userProfilePic, username, sentiment };

    post.replies.push(reply);
    await post.save();

    res.status(200).json(reply);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in replyToPost:", err);
  }
};

const getFeedPosts = async (req, res) => {
  // console.log("fdes");
  try {
    const userId = req.user._id;
    // console.log("getFeedPosts user ID: ", req.user._id);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    const following = user.following;
    const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({
      createdAt: -1,
    });

    res.status(200).json(feedPosts);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in getFeedPosts: ", err.message);
  }
};

const getUserPosts = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    const posts = await Post.find({ postedBy: user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    console.log("request received");

    const posts = await Post.find(
      {},
      { img: 0, postedBy: 0, createdAt: 0, updatedAt: 0, __v: 0 }
    )
      .sort({ createdAt: -1 })
      .lean(); // Use `.lean()` to return plain JavaScript objects instead of Mongoose documents

    // Add likesCount and sentimentScore to each post
    const modifiedPosts = posts.map((post) => {
      const sentimentScore = post.replies.reduce(
        (sum, reply) => sum + (reply.sentiment || 0),
        0
      ); // Sum up all sentiment values in the replies array

      return {
        ...post,
        likesCount: post.likes.length, // Calculate likes count
        sentimentScore, // Add sentimentScore
      };
    });

    res.status(200).json(modifiedPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in getAllPosts:", error);
  }
};

const labelAllSentiments = async (req, res) => {
  try {
    const posts = await Post.find({}); // Fetch all posts

    for (const post of posts) {
      for (const reply of post.replies) {
        try {
          const response = await fetch("http://127.0.0.1:8080/api/sentiment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: reply.text }),
          });

          if (response.ok) {
            const data = await response.json();
            reply.sentiment = data.sentiment; // Update sentiment in the reply
            console.log(reply.text, " : ", data.sentiment); // Log the reply text and sentiment
          } else {
            console.error(`Failed to fetch sentiment for reply: ${reply.text}`);
          }
        } catch (error) {
          console.error(
            `Error fetching sentiment for reply: ${reply.text}`,
            error
          );
        }
      }
      await post.save(); // Save the updated post with labeled replies
    }

    res.status(200).json({ message: "All sentiments labeled successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in labelAllSentiments:", error);
  }
};

export {
  createPost,
  getPost,
  deletePost,
  likeUnlikePost,
  replyToPost,
  getFeedPosts,
  getUserPosts,
  getAllPosts,
  labelAllSentiments,
};
